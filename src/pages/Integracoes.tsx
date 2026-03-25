import { Search, Plus, Key, Eye, EyeOff, Copy, Globe, RefreshCw, X, ExternalLink, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

import slackLogo from "@/assets/logos/slack.svg";
import googleSheetsLogo from "@/assets/logos/google-sheets.svg";
import telegramLogo from "@/assets/logos/telegram.svg";
import discordLogo from "@/assets/logos/discord.svg";
import utmifyLogo from "@/assets/logos/utmify.png";
import trelloLogo from "@/assets/logos/trello.png";

export default function Integracoes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [url, setUrl] = useState("");
  const [event, setEvent] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [searchWebhook, setSearchWebhook] = useState("");

  const { data: webhooks = [] } = useQuery({
    queryKey: ["webhooks", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("webhooks").select("*").order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const validateUrl = (value: string) => {
    if (!value.startsWith("https://")) {
      setUrlError('A URL deve começar com "https://"');
      return false;
    }
    setUrlError("");
    return true;
  };

  const addWebhook = useMutation({
    mutationFn: async () => {
      if (!validateUrl(url)) throw new Error("URL inválida");
      const { error } = await supabase.from("webhooks").insert({
        user_id: user!.id,
        url,
        event: event || "all",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast.success("Webhook cadastrado!");
      setShowForm(false);
      setUrl("");
      setEvent("");
      setIsAdmin(false);
      setUrlError("");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const filteredWebhooks = webhooks.filter((w: any) =>
    w.url.toLowerCase().includes(searchWebhook.toLowerCase())
  );

  const tabs = ["Webhook", "Chave de API", "Aplicativos"];

  const eventOptions = [
    { value: "all", label: "Todos os eventos" },
    { value: "transaction.update", label: "Atualização de Transações" },
    { value: "payment.approved", label: "Pagamento aprovado" },
    { value: "payment.refunded", label: "Pagamento estornado" },
    { value: "withdrawal.update", label: "Atualização de Saques" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-heading font-bold">Integrações</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie as integrações do sistema de maneira prática e eficiente.</p>
      </div>

      <div className="flex border-b border-border overflow-x-auto">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`px-4 md:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${i === activeTab ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
        ))}
      </div>

      {activeTab === 0 && (
        <>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchWebhook}
                onChange={e => setSearchWebhook(e.target.value)}
                className="w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[48px] sm:min-h-0"
                placeholder="Pesquise"
              />
            </div>
            <button onClick={() => setShowForm(true)} className="px-4 py-3 sm:py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 whitespace-nowrap min-h-[48px] sm:min-h-0">
              Cadastrar Novo
            </button>
          </div>

          <p className="text-primary text-sm font-medium">Todos os webhooks</p>

          <div className="glass-card overflow-hidden hidden sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left px-5 py-3 font-medium">URL</th>
                  <th className="text-left px-5 py-3 font-medium">STATUS</th>
                  <th className="text-left px-5 py-3 font-medium">EVENTO</th>
                  <th className="text-left px-5 py-3 font-medium">Criado em</th>
                </tr>
              </thead>
              <tbody>
                {filteredWebhooks.length === 0 ? (
                  <tr><td colSpan={4} className="py-12 text-center text-muted-foreground">Nenhum webhook cadastrado</td></tr>
                ) : filteredWebhooks.map((w: any) => (
                  <tr key={w.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="px-5 py-3 text-foreground font-mono text-xs">{w.url}</td>
                    <td className="px-5 py-3"><span className={`text-xs px-2 py-1 rounded-full ${w.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{w.status === "active" ? "Ativo" : "Inativo"}</span></td>
                    <td className="px-5 py-3 text-foreground">{w.event}</td>
                    <td className="px-5 py-3 text-foreground">{new Date(w.created_at).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden">
            {filteredWebhooks.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground text-sm glass-card">Nenhum webhook cadastrado</p>
            ) : filteredWebhooks.map((w: any) => (
              <div key={w.id} className="py-4 border-b border-border/50">
                <p className="text-foreground text-sm font-mono truncate">{w.url}</p>
                <p className="text-xs text-muted-foreground mt-1">{w.event} · {new Date(w.created_at).toLocaleDateString("pt-BR")}</p>
              </div>
            ))}
          </div>

          {/* Webhook Creation Modal */}
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-heading font-bold">Criar Webhook</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">URL</label>
                  <input
                    value={url}
                    onChange={e => { setUrl(e.target.value); if (urlError) validateUrl(e.target.value); }}
                    placeholder="Exemplo: https://suaurl.com"
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {urlError && <p className="text-xs text-primary mt-1">{urlError}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Evento recebido</label>
                  <select
                    value={event}
                    onChange={e => setEvent(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="">Selecione</option>
                    {eventOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Webhook admin</span>
                  <Switch checked={isAdmin} onCheckedChange={setIsAdmin} />
                </div>

                <button
                  onClick={() => addWebhook.mutate()}
                  disabled={!url.trim() || !event}
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                  Cadastrar webhook
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {activeTab === 1 && <ApiKeysTab userId={user?.id} />}
      {activeTab === 2 && <AppsTab />}
    </div>
  );
}

/* ─── API Keys Tab ─── */
function ApiKeysTab({ userId }: { userId?: string }) {
  const [showSecret, setShowSecret] = useState(false);
  const [showGlobalSecret, setShowGlobalSecret] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [showGlobalInfo, setShowGlobalInfo] = useState(false);
  const queryClient = useQueryClient();

  const { data: merchantConfig } = useQuery({
    queryKey: ["merchant-config-keys", userId],
    queryFn: async () => {
      const { data } = await supabase.from("merchant_configs").select("*").eq("user_id", userId!).maybeSingle();
      return data;
    },
    enabled: !!userId,
  });

  const companyId = userId || "—";

  const copyToClipboard = (text: string, label: string) => {
    if (!text) { toast.error("Nenhum valor para copiar"); return; }
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const handleRegenerate = async () => {
    if (!confirm("Tem certeza? A chave atual será invalidada.")) return;
    setRegenerating(true);
    try {
      const newKey = `sk_live_${crypto.randomUUID().replace(/-/g, "")}`;
      const { error } = await supabase.from("merchant_configs").upsert({
        user_id: userId!,
        api_key_hash: newKey,
      }, { onConflict: "user_id" });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["merchant-config-keys"] });
      toast.success("Nova chave gerada com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao gerar chave: " + err.message);
    } finally {
      setRegenerating(false);
    }
  };

  const globalApiKey = (merchantConfig as any)?.global_api_key || "";
  const globalClientId = (merchantConfig as any)?.global_client_id || "";

  const checkouts = [
    { name: "Vega Checkout", status: "disponível", url: "https://vegacheckout.com.br/" },
    { name: "Luna Checkout", status: "disponível", url: "https://lunacheckout.com/" },
    { name: "Zedy Checkout", status: "disponível", url: "https://zedy.com.br/" },
    { name: "CloudFy Checkout", status: "disponível", url: "https://www.cloudfycheckout.com/" },
    { name: "Anjo Checkout", status: "disponível", url: "https://anjocheckout.com.br/" },
    { name: "Alphazz Checkout", status: "disponível", url: "https://alphazz.com/" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-heading font-bold text-foreground">Chaves de API</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Aqui estão suas chaves de API, que permitem acesso aos recursos da nossa plataforma. Consulte nossa documentação para mais informações.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* API Normal */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Key size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">API Normal</h3>
              <p className="text-xs text-muted-foreground">Use estas credenciais para acessar os recursos padrão da plataforma.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Secret Key</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2.5 rounded-lg bg-background border border-border font-mono text-sm text-foreground overflow-hidden">
                  {showSecret ? (merchantConfig?.api_key_hash || "Nenhuma chave gerada") : "••••••••••••••••••••••••••••••••••••"}
                </div>
                <button onClick={() => setShowSecret(!showSecret)} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
                  {showSecret ? <EyeOff size={16} className="text-muted-foreground" /> : <Eye size={16} className="text-muted-foreground" />}
                </button>
                <button onClick={() => copyToClipboard(merchantConfig?.api_key_hash || "", "Secret Key")} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90">
                  <Copy size={14} /> Copiar
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Company ID</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2.5 rounded-lg bg-background border border-border font-mono text-sm text-foreground truncate">
                  {companyId}
                </div>
                <button onClick={() => copyToClipboard(companyId, "Company ID")} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90">
                  <Copy size={14} /> Copiar
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">URL Base da API</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2.5 rounded-lg bg-background border border-border font-mono text-xs text-foreground truncate">
                {`https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/api-gateway`}
              </div>
              <button onClick={() => copyToClipboard(`https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/api-gateway`, "URL Base")} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90">
                <Copy size={14} /> Copiar
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Envie os headers <code className="text-primary">X-Secret-Key</code> e <code className="text-primary">X-Company-Id</code> em todas as requisições.
            </p>
          </div>

          <button onClick={handleRegenerate} disabled={regenerating} className="flex items-center gap-2 text-sm text-warning hover:text-warning/80 transition-colors disabled:opacity-50">
            <RefreshCw size={14} className={regenerating ? "animate-spin" : ""} />
            {regenerating ? "Gerando..." : "Regenerar Secret Key"}
          </button>
        </div>

        {/* API Global */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/50 flex items-center justify-center">
                <Globe size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground">API Global Codiguz & Aviv Hub</h3>
                <p className="text-xs text-muted-foreground">Use estas credenciais para utilizar a API Global Codiguz & Aviv Hub.</p>
              </div>
            </div>
            <button onClick={() => setShowGlobalInfo(true)} className="text-xs text-primary hover:underline flex items-center gap-1 whitespace-nowrap shrink-0">
              ℹ Mais informações
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Global Secret Key</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2.5 rounded-lg bg-background border border-border font-mono text-sm text-foreground overflow-hidden">
                  {showGlobalSecret ? (globalApiKey || "Nenhuma chave gerada") : "••••••••••••••••••••••••••••••••••••"}
                </div>
                <button onClick={() => setShowGlobalSecret(!showGlobalSecret)} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
                  {showGlobalSecret ? <EyeOff size={16} className="text-muted-foreground" /> : <Eye size={16} className="text-muted-foreground" />}
                </button>
                <button onClick={() => copyToClipboard(globalApiKey, "Global Secret Key")} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90">
                  <Copy size={14} /> Copiar
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Global Client ID</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2.5 rounded-lg bg-background border border-border font-mono text-sm text-foreground truncate">
                  {globalClientId || "—"}
                </div>
                <button onClick={() => copyToClipboard(globalClientId, "Global Client ID")} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90">
                  <Copy size={14} /> Copiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global API Info Modal */}
      <Dialog open={showGlobalInfo} onOpenChange={setShowGlobalInfo}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading font-bold">API Global Codiguz & Aviv Hub</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A API Global Codiguz & Aviv Hub permite integração avançada com múltiplos checkouts e sistemas de pagamento. Confira abaixo a lista de checkouts compatíveis:
            </p>

            <div>
              <p className="text-sm font-semibold text-success mb-3">Checkouts Compatíveis</p>
              <div className="grid grid-cols-2 gap-3">
                {checkouts.map(c => (
                  <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-sm text-foreground font-medium">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-success bg-success/10 px-2 py-0.5 rounded-full">{c.status}</span>
                      <ExternalLink size={14} className="text-muted-foreground" />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-success/30 bg-success/5 p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-success mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">API Global Ativa!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    A API Global Codiguz & Aviv Hub já está disponível e funcionando em todos os checkouts listados acima. Use suas credenciais globais para integrar com múltiplos checkouts e melhore sua conversão!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGlobalInfo(false)}
              className="w-full py-2.5 rounded-lg bg-card border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Entendido
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─── Apps Tab ─── */
function AppsTab() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const apps = [
    { name: "Slack", description: "Integre notificações diretamente no Slack.", logo: slackLogo, active: false, route: null },
    { name: "UtmiFy", description: "Sincronize arquivos e documentos do Drive.", logo: utmifyLogo, active: true, route: "/apps/utmify" },
    { name: "Trello", description: "Gerencie tarefas e projetos facilmente.", logo: trelloLogo, active: false, route: null },
    { name: "Google Sheets", description: "Sincronize dados com planilhas.", logo: googleSheetsLogo, active: false, route: null },
    { name: "Telegram", description: "Receba alertas no Telegram.", logo: telegramLogo, active: false, route: null },
    { name: "Discord", description: "Notificações no seu servidor Discord.", logo: discordLogo, active: false, route: null },
  ];

  const filtered = apps.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-heading font-bold text-foreground">Aplicativos</h2>
        <p className="text-sm text-muted-foreground mt-1">Conecte aplicativos externos para expandir as funcionalidades.</p>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Pesquise"
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(app => (
          <div
            key={app.name}
            className={`glass-card p-5 flex flex-col justify-between ${app.route ? "cursor-pointer hover:border-primary/50 transition-colors" : ""}`}
            onClick={() => app.route && navigate(app.route)}
          >
            <div className="flex items-start gap-3 mb-3">
              <img src={app.logo} alt={app.name} className="w-8 h-8 rounded-lg object-contain shrink-0" />
              <div>
                <h3 className="font-heading font-semibold text-foreground">{app.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{app.description}</p>
              </div>
            </div>
            <span className={`self-start text-xs px-2.5 py-1 rounded-full ${app.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
              {app.active ? "Ativo" : "Inativo"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
