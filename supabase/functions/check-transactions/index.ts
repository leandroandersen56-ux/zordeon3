import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLUGGOU_BASE = "https://api.pluggoutech.com/api";

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
    // Get admin's Pluggou credentials
    const { data: adminRole } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin")
      .limit(1)
      .single();

    if (!adminRole?.user_id) {
      return new Response(JSON.stringify({ error: "Admin não encontrado" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: creds } = await supabase
      .from("gateway_credentials")
      .select("public_key, secret_key")
      .eq("user_id", adminRole.user_id)
      .eq("is_active", true)
      .maybeSingle();

    if (!creds?.public_key || !creds?.secret_key) {
      return new Response(JSON.stringify({ error: "Credenciais não configuradas" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pluggouHeaders = {
      "Content-Type": "application/json",
      "X-Public-Key": creds.public_key,
      "X-Secret-Key": creds.secret_key,
    };

    // Get all pending transactions from last 24h
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: pendingTxs } = await supabase
      .from("payment_transactions")
      .select("id, external_id, user_id, status, amount")
      .eq("status", "pending")
      .gte("created_at", since)
      .not("external_id", "is", null);

    if (!pendingTxs || pendingTxs.length === 0) {
      return new Response(JSON.stringify({ checked: 0, updated: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let updated = 0;

    for (const tx of pendingTxs) {
      try {
        const resp = await fetch(`${PLUGGOU_BASE}/transactions/${tx.external_id}`, {
          headers: pluggouHeaders,
        });

        if (!resp.ok) continue;

        const result = await resp.json();
        const data = result?.data || result;
        const newStatus = normalizeStatus(data?.status);

        if (newStatus === "pending") continue;

        // Update payment_transactions
        await supabase
          .from("payment_transactions")
          .update({
            status: newStatus,
            e2e_id: data?.e2e_id || null,
            liquid_amount: Number(data?.liquid_amount || 0),
            platform_tax: Number(data?.platform_tax || 0),
            paid_at: data?.paid_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", tx.id);

        // Update legacy transactions table
        await supabase
          .from("transactions")
          .update({
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("description", `PIX_EXT:${tx.external_id}`);

        // Credit balance if approved
        if (newStatus === "approved" && data?.liquid_amount) {
          const liquidReais = Number(data.liquid_amount) / 100;
          const balanceUserId = tx.user_id;

          // Check if admin
          const { data: isAdmin } = await supabase.rpc("has_role", {
            _user_id: balanceUserId,
            _role: "admin",
          });

          let creditAmount = liquidReais;

          if (!isAdmin) {
            const { data: feeRow } = await supabase
              .from("fee_config")
              .select("percentage_fee, fixed_fee")
              .eq("method", "pix")
              .eq("is_active", true)
              .maybeSingle();

            if (feeRow) {
              const zordeonFee = (liquidReais * Number(feeRow.percentage_fee)) / 100 + Number(feeRow.fixed_fee);
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

          console.log(`[check-transactions] credited user=${balanceUserId} amount=R$${creditAmount.toFixed(2)} isAdmin=${isAdmin}`);
        }

        updated++;
        console.log(`[check-transactions] tx=${tx.external_id} ${tx.status} -> ${newStatus}`);
      } catch (e) {
        console.error(`[check-transactions] error checking tx=${tx.external_id}:`, e);
      }
    }

    return new Response(JSON.stringify({ checked: pendingTxs.length, updated }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[check-transactions] error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
