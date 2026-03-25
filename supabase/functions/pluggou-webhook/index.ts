import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-webhook-code, x-webhook-event-id",
};

function normalizeStatus(status?: string | null) {
  const value = (status || "pending").toLowerCase();

  if (["paid", "approved", "success", "succeeded"].includes(value)) return "approved";
  if (["refunded", "refund"].includes(value)) return "refunded";
  if (["cancelled", "canceled", "denied", "failed"].includes(value)) return "cancelled";
  if (["expired", "timeout"].includes(value)) return "expired";

  return "pending";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const webhookCode = req.headers.get("x-webhook-code")?.trim() || "";
    const eventIdHeader = req.headers.get("x-webhook-event-id")?.trim() || "";

    const body = await req.json();
    const eventType = body?.event_type || "unknown";
    const data = body?.data || {};
    const externalId = data?.id ? String(data.id) : null;

    let resolvedUserId: string | null = null;
    let txOwnerUserId: string | null = null;

    // Try to resolve user via webhook_code if provided
    if (webhookCode) {
      const { data: creds } = await supabase
        .from("gateway_credentials")
        .select("user_id")
        .eq("webhook_code", webhookCode)
        .maybeSingle();

      if (creds?.user_id) {
        resolvedUserId = creds.user_id;
      }
    }

    // Also try resolving via admin credentials (platform-level webhook)
    if (!resolvedUserId) {
      const { data: adminRole } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin")
        .limit(1)
        .single();

      if (adminRole?.user_id) {
        const { data: adminCreds } = await supabase
          .from("gateway_credentials")
          .select("user_id")
          .eq("user_id", adminRole.user_id)
          .eq("is_active", true)
          .maybeSingle();

        if (adminCreds) {
          resolvedUserId = adminCreds.user_id;
        }
      }
    }

    let previousTxStatus: string | null = null;

    if (externalId) {
      const { data: txRow } = await supabase
        .from("payment_transactions")
        .select("user_id, status")
        .eq("external_id", externalId)
        .maybeSingle();

      if (txRow) {
        txOwnerUserId = txRow.user_id;
        resolvedUserId = resolvedUserId || txRow.user_id;
        previousTxStatus = txRow.status || null;
      }

      const { data: wdRow } = await supabase
        .from("payment_withdrawals")
        .select("user_id")
        .eq("external_id", externalId)
        .maybeSingle();

      if (wdRow) {
        resolvedUserId = resolvedUserId || wdRow.user_id;
      }
    }

    if (!resolvedUserId) {
      return new Response(JSON.stringify({ error: "Webhook não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const eventId =
      eventIdHeader ||
      `${eventType}:${externalId || "sem-id"}:${String(data?.status || "sem-status")}:${String(
        data?.paid_at || data?.updated_at || ""
      )}`;

    const { data: existing } = await supabase
      .from("webhook_events")
      .select("id")
      .eq("event_id", eventId)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase.from("webhook_events").insert({
      event_id: eventId,
      event_type: eventType,
      payload: body,
    });

    const normalizedStatus = normalizeStatus(data?.status);

    if (externalId) {
      await supabase
        .from("payment_transactions")
        .update({
          status: normalizedStatus,
          e2e_id: data?.e2e_id || null,
          liquid_amount: Number(data?.liquid_amount || 0),
          platform_tax: Number(data?.platform_tax || 0),
          paid_at: data?.paid_at || null,
          updated_at: new Date().toISOString(),
        })
        .eq("external_id", externalId);

      await supabase
        .from("transactions")
        .update({
          status: normalizedStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("description", `PIX_EXT:${externalId}`);

      await supabase
        .from("payment_withdrawals")
        .update({
          status: normalizedStatus,
          e2e_id: data?.e2e_id || null,
          liquid_amount: Number(data?.liquid_amount || 0),
          paid_at: data?.paid_at || null,
          updated_at: new Date().toISOString(),
        })
        .eq("external_id", externalId);
    }

    const balanceUserId = txOwnerUserId || resolvedUserId;
    if (normalizedStatus === "approved" && data?.liquid_amount && previousTxStatus !== "approved" && balanceUserId) {
      const liquidReais = Number(data.liquid_amount) / 100;

      // Check if user is admin — admins don't pay Zordeon platform fee
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: balanceUserId,
        _role: "admin",
      });

      let creditAmount = liquidReais;
      let zordeonFee = 0;

      if (!isAdmin) {
        // Apply Zordeon platform fee from fee_config (PIX)
        const { data: feeRow } = await supabase
          .from("fee_config")
          .select("percentage_fee, fixed_fee")
          .eq("method", "pix")
          .eq("is_active", true)
          .maybeSingle();

        if (feeRow) {
          zordeonFee = (liquidReais * Number(feeRow.percentage_fee)) / 100 + Number(feeRow.fixed_fee);
          creditAmount = Math.max(0, liquidReais - zordeonFee);
        }
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("balance_pix")
        .eq("id", balanceUserId)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({
            balance_pix: Number(profile.balance_pix) + creditAmount,
          })
          .eq("id", balanceUserId);
      }

      console.log(`[webhook] balance credit: user=${balanceUserId} liquid=R$${liquidReais} zordeonFee=R$${zordeonFee.toFixed(2)} credited=R$${creditAmount.toFixed(2)} isAdmin=${isAdmin}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("pluggou-webhook error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
