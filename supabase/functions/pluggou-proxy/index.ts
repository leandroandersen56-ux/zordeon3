import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch the first gateway_credentials row that belongs to any admin
    const { data: allAdmins } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (!allAdmins || allAdmins.length === 0) {
      return new Response(
        JSON.stringify({ error: "Configuração da plataforma incompleta." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminIds = allAdmins.map((a: { user_id: string }) => a.user_id);

    const { data: creds, error: credsError } = await supabase
      .from("gateway_credentials")
      .select("*")
      .in("user_id", adminIds)
      .not("public_key", "is", null)
      .not("secret_key", "is", null)
      .limit(1)
      .maybeSingle();

    if (credsError || !creds || !creds.public_key || !creds.secret_key) {
      return new Response(
        JSON.stringify({ error: "Credenciais do gateway não configuradas pelo administrador." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { action, ...params } = body;

    const pluggouHeaders = {
      "Content-Type": "application/json",
      "X-Public-Key": creds.public_key,
      "X-Secret-Key": creds.secret_key,
    };

    let response: Response;

    switch (action) {
      case "create-transaction": {
        response = await fetch(`${PLUGGOU_BASE}/transactions`, {
          method: "POST",
          headers: pluggouHeaders,
          body: JSON.stringify(params.payload),
        });
        break;
      }
      case "get-transaction": {
        response = await fetch(`${PLUGGOU_BASE}/transactions/${params.id}`, {
          headers: pluggouHeaders,
        });
        break;
      }
      case "list-transactions": {
        const qs = new URLSearchParams(params.filters || {}).toString();
        response = await fetch(`${PLUGGOU_BASE}/transactions${qs ? `?${qs}` : ""}`, {
          headers: pluggouHeaders,
        });
        break;
      }
      case "create-withdrawal": {
        response = await fetch(`${PLUGGOU_BASE}/withdrawals`, {
          method: "POST",
          headers: pluggouHeaders,
          body: JSON.stringify(params.payload),
        });
        break;
      }
      case "get-withdrawal": {
        response = await fetch(`${PLUGGOU_BASE}/withdrawals/${params.id}`, {
          headers: pluggouHeaders,
        });
        break;
      }
      case "list-withdrawals": {
        const qs = new URLSearchParams(params.filters || {}).toString();
        response = await fetch(`${PLUGGOU_BASE}/withdrawals${qs ? `?${qs}` : ""}`, {
          headers: pluggouHeaders,
        });
        break;
      }
      case "get-balance": {
        response = await fetch(`${PLUGGOU_BASE}/withdrawals/balance`, {
          headers: pluggouHeaders,
        });
        break;
      }
      case "test-connection": {
        response = await fetch(`${PLUGGOU_BASE}/withdrawals/balance`, {
          headers: pluggouHeaders,
        });
        break;
      }
      default:
        return new Response(JSON.stringify({ error: "Ação inválida" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const data = await response.json();
    console.log(`[pluggou-proxy] action=${action} status=${response.status} response=`, JSON.stringify(data));
    if (action === "create-transaction") {
      console.log(`[pluggou-proxy] sent payload=`, JSON.stringify(params.payload));
    }

    if (action === "create-transaction" && response.ok && data?.data?.id) {
      const externalId = String(data.data.id);
      const amountCents = Number(data.data.amount || params.payload?.amount || 0);
      const method = String(params.payload?.payment_method || "pix");
      const normalizedStatus = normalizeStatus(data.data.status || "pending");

      const paymentInsert = supabase.from("payment_transactions").insert({
        user_id: userId,
        external_id: externalId,
        amount: amountCents,
        platform_tax: Number(data.data.platform_tax || 0),
        liquid_amount: Number(data.data.liquid_amount || 0),
        pix_emv: data.data.pix?.emv || "",
        buyer_name: params.payload?.buyer?.buyer_name || "",
        buyer_document: params.payload?.buyer?.buyer_document || "",
        buyer_phone: params.payload?.buyer?.buyer_phone || "",
        status: normalizedStatus,
      });

      const legacyInsert = supabase.from("transactions").insert({
        user_id: userId,
        amount: amountCents / 100,
        method,
        status: normalizedStatus,
        description: `PIX_EXT:${externalId}`,
      });

      const [paymentInsertRes, legacyInsertRes] = await Promise.all([paymentInsert, legacyInsert]);
      if (paymentInsertRes.error) {
        console.error("[pluggou-proxy] payment_transactions insert error:", paymentInsertRes.error);
      }
      if (legacyInsertRes.error) {
        console.error("[pluggou-proxy] transactions insert error:", legacyInsertRes.error);
      }
    }

    if (action === "create-withdrawal" && response.ok && data?.data?.id) {
      await supabase.from("payment_withdrawals").insert({
        user_id: userId,
        external_id: data.data.id,
        amount: params.payload?.amount || 0,
        pix_key_type: params.payload?.key_type || "cpf",
        pix_key: params.payload?.key_value || "",
        status: "pending",
      });
    }

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("pluggou-proxy error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
