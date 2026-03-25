import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-secret-key, x-company-id",
};

const PLUGGOU_BASE = "https://api.pluggoutech.com/api";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

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
    // --- Authenticate merchant via Secret Key + Company ID ---
    const secretKey = req.headers.get("X-Secret-Key") || req.headers.get("x-secret-key");
    const companyId = req.headers.get("X-Company-Id") || req.headers.get("x-company-id");

    if (!secretKey || !companyId) {
      return jsonResponse({ error: "Credenciais ausentes. Envie os headers X-Secret-Key e X-Company-Id." }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Validate merchant credentials
    const { data: merchant, error: merchantError } = await supabase
      .from("merchant_configs")
      .select("user_id, is_active, api_key_hash")
      .eq("user_id", companyId)
      .eq("api_key_hash", secretKey)
      .maybeSingle();

    if (merchantError || !merchant) {
      return jsonResponse({ error: "Chave não encontrada ou inativa." }, 401);
    }

    if (!merchant.is_active) {
      return jsonResponse({ error: "Conta do merchant está inativa." }, 403);
    }

    const merchantUserId = merchant.user_id;

    // --- Get admin's Pluggou credentials ---
    const { data: adminRole } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin")
      .limit(1)
      .single();

    if (!adminRole?.user_id) {
      return jsonResponse({ error: "Configuração da plataforma incompleta." }, 500);
    }

    const { data: creds } = await supabase
      .from("gateway_credentials")
      .select("*")
      .eq("user_id", adminRole.user_id)
      .maybeSingle();

    if (!creds?.public_key || !creds?.secret_key) {
      return jsonResponse({ error: "Credenciais do gateway não configuradas." }, 500);
    }

    const pluggouHeaders = {
      "Content-Type": "application/json",
      "X-Public-Key": creds.public_key,
      "X-Secret-Key": creds.secret_key,
    };

    // --- Parse request ---
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    // Expected paths: /api-gateway/transactions, /api-gateway/transactions/:id, /api-gateway/balance
    const resource = pathParts[1] || "";
    const resourceId = pathParts[2] || "";

    let body: any = {};
    if (req.method === "POST" || req.method === "PUT") {
      try { body = await req.json(); } catch { body = {}; }
    }

    let response: Response;

    // --- Route handling ---
    if (resource === "transactions" && req.method === "POST") {
      // Create transaction
      response = await fetch(`${PLUGGOU_BASE}/transactions`, {
        method: "POST",
        headers: pluggouHeaders,
        body: JSON.stringify(body),
      });
    } else if (resource === "transactions" && req.method === "GET" && resourceId) {
      // Get single transaction
      response = await fetch(`${PLUGGOU_BASE}/transactions/${resourceId}`, {
        headers: pluggouHeaders,
      });
    } else if (resource === "transactions" && req.method === "GET") {
      // List transactions
      const qs = url.search || "";
      response = await fetch(`${PLUGGOU_BASE}/transactions${qs}`, {
        headers: pluggouHeaders,
      });
    } else if (resource === "balance" && req.method === "GET") {
      // Get balance
      response = await fetch(`${PLUGGOU_BASE}/withdrawals/balance`, {
        headers: pluggouHeaders,
      });
    } else if (resource === "withdrawals" && req.method === "POST") {
      // Create withdrawal
      response = await fetch(`${PLUGGOU_BASE}/withdrawals`, {
        method: "POST",
        headers: pluggouHeaders,
        body: JSON.stringify(body),
      });
    } else {
      return jsonResponse({ error: "Endpoint não encontrado. Rotas: POST /transactions, GET /transactions, GET /transactions/:id, GET /balance" }, 404);
    }

    const data = await response.json();
    console.log(`[api-gateway] merchant=${companyId} resource=${resource} method=${req.method} status=${response.status}`);

    // --- Record transaction in DB ---
    if (resource === "transactions" && req.method === "POST" && response.ok && data?.data?.id) {
      const externalId = String(data.data.id);
      const amountCents = Number(data.data.amount || body?.amount || 0);
      const normalizedStatus = normalizeStatus(data.data.status || "pending");

      const paymentInsert = supabase.from("payment_transactions").insert({
        user_id: merchantUserId,
        external_id: externalId,
        amount: amountCents,
        platform_tax: Number(data.data.platform_tax || 0),
        liquid_amount: Number(data.data.liquid_amount || 0),
        pix_emv: data.data.pix?.emv || "",
        buyer_name: body?.buyer?.buyer_name || "",
        buyer_document: body?.buyer?.buyer_document || "",
        buyer_phone: body?.buyer?.buyer_phone || "",
        status: normalizedStatus,
      });

      const legacyInsert = supabase.from("transactions").insert({
        user_id: merchantUserId,
        amount: amountCents / 100,
        method: body?.payment_method || "pix",
        status: normalizedStatus,
        description: `PIX_EXT:${externalId}`,
      });

      const [p, l] = await Promise.all([paymentInsert, legacyInsert]);
      if (p.error) console.error("[api-gateway] payment_transactions insert error:", p.error);
      if (l.error) console.error("[api-gateway] transactions insert error:", l.error);
    }

    if (resource === "withdrawals" && req.method === "POST" && response.ok && data?.data?.id) {
      await supabase.from("payment_withdrawals").insert({
        user_id: merchantUserId,
        external_id: data.data.id,
        amount: body?.amount || 0,
        pix_key_type: body?.key_type || "cpf",
        pix_key: body?.key_value || "",
        status: "pending",
      });
    }

    return jsonResponse(data, response.status);
  } catch (err) {
    console.error("[api-gateway] error:", err);
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Erro interno" },
      500
    );
  }
});
