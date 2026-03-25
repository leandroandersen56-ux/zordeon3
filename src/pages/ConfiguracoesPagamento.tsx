import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, Shield, ExternalLink, CheckCircle2, XCircle, Plug } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GATEWAYS = [
  { value: "pluggou", label: "Pluggou", url: "https://pluggoucash.com/dashboard/apis" },
];

export default function ConfiguracoesPagamento() {
  const { user } = useAuth();
  const [gateway, setGateway] = useState("pluggou");
  const [publicKey, setPublicKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [webhookCode, setWebhookCode] = useState("");
  const [showPublic, setShowPublic] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("gateway_credentials")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setGateway(data.gateway || "pluggou");
          setPublicKey(data.public_key || "");
          setSecretKey(data.secret_key || "");
          setWebhookCode(data.webhook_code || "");
        }
      });
  }, [user]);

  const save = async () => {
    if (!user) return;

    if (webhookCode.trim() && /^https?:\/\//i.test(webhookCode.trim())) {
      toast.error("Webhook Secret deve ser um código, não uma URL.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        gateway,
        public_key: publicKey,
        secret_key: secretKey,
        webhook_code: webhookCode,
        updated_at: new Date().toISOString(),
      };
      const { data: existing } = await supabase
        .from("gateway_credentials")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase.from("gateway_credentials").update(payload).eq("user_id", user.id);
      } else {
        await supabase.from("gateway_credentials").insert(payload);
      }
      toast.success("Credenciais salvas com sucesso!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    if (!user) return;
    setTesting(true);
    setTestResult(null);
    try {
      // Save first
      await save();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const res = await fetch(
        `https://mfqfxgfxrxnnwizmolqf.supabase.co/functions/v1/pluggou-proxy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ action: "test-connection" }),
        }
      );
      if (res.ok) {
        setTestResult("success");
        toast.success("Conexão com o gateway testada com sucesso!");
      } else {
        const err = await res.json();
        setTestResult("error");
        toast.error(err?.message || err?.error || "Falha na conexão");
      }
    } catch {
      setTestResult("error");
      toast.error("Erro ao testar conexão");
    } finally {
      setTesting(false);
    }
  };

  const webhookUrl = `https://mfqfxgfxrxnnwizmolqf.supabase.co/functions/v1/pluggou-webhook`;

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

  const selectedGw = GATEWAYS.find((g) => g.value === gateway);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Plug size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-bold">Configurações de Pagamento</h1>
          <p className="text-muted-foreground text-sm">
            Configure o gateway de pagamento PIX para processar cobranças e saques.
          </p>
        </div>
      </div>

      <div className="glass-card p-5 md:p-8 max-w-3xl space-y-6">
        {/* Gateway selector */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Gateway selecionado</label>
          <select
            value={gateway}
            onChange={(e) => setGateway(e.target.value)}
            className={inputClass}
          >
            {GATEWAYS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* Credentials */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Chave Pública (X-Public-Key)
            </label>
            <div className="relative">
              <input
                type={showPublic ? "text" : "password"}
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="pk_live_..."
                className={inputClass + " pr-10"}
              />
              <button
                onClick={() => setShowPublic(!showPublic)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPublic ? (
                  <EyeOff size={16} className="text-muted-foreground" />
                ) : (
                  <Eye size={16} className="text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Chave Secreta (X-Secret-Key)
            </label>
            <div className="relative">
              <input
                type={showSecret ? "text" : "password"}
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="sk_live_..."
                className={inputClass + " pr-10"}
              />
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showSecret ? (
                  <EyeOff size={16} className="text-muted-foreground" />
                ) : (
                  <Eye size={16} className="text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          <details className="group">
            <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              Webhook Secret (opcional) ▸
            </summary>
            <div className="mt-2">
              <div className="relative">
                <input
                  type={showWebhook ? "text" : "password"}
                  value={webhookCode}
                  onChange={(e) => setWebhookCode(e.target.value)}
                  placeholder="Apenas se fornecido pelo gateway"
                  className={inputClass + " pr-10"}
                />
                <button
                  onClick={() => setShowWebhook(!showWebhook)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showWebhook ? (
                    <EyeOff size={16} className="text-muted-foreground" />
                  ) : (
                    <Eye size={16} className="text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </details>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              URL do Webhook (copie e cole no painel do gateway)
            </label>
            <div className="flex gap-2">
              <input value={webhookUrl} readOnly className={inputClass + " bg-muted cursor-pointer"} onClick={() => {
                navigator.clipboard.writeText(webhookUrl);
                toast.success("URL copiada!");
              }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Clique para copiar</p>
          </div>
        </div>

        {/* Help link */}
        {selectedGw && (
          <a
            href={selectedGw.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink size={14} />
            Como obter suas credenciais → {selectedGw.label}
          </a>
        )}

        {/* Test result */}
        {testResult && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              testResult === "success"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {testResult === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {testResult === "success" ? "Conexão bem-sucedida!" : "Falha na conexão. Verifique suas credenciais."}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={testConnection}
            disabled={testing || !publicKey || !secretKey}
            className="px-5 py-2.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {testing ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
            Testar conexão
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Salvar credenciais
          </button>
        </div>
      </div>
    </div>
  );
}
