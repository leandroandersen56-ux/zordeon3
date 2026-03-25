import { useState } from "react";
import { Globe, ChevronDown, ChevronUp, AlertCircle, Copy, ExternalLink, Trash2, RefreshCw, Loader2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function CheckoutDomainSection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [domain, setDomain] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: domainConfig } = useQuery({
    queryKey: ["checkout_domain", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("checkout_domains" as any)
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data as any;
    },
    enabled: !!user,
  });

  const handleConfigure = async () => {
    if (!domain.trim()) { toast.error("Informe o domínio."); return; }
    setSaving(true);
    try {
      if (domainConfig) {
        const { error } = await supabase
          .from("checkout_domains" as any)
          .update({ domain: domain.trim(), status: "pending", configured_at: new Date().toISOString() } as any)
          .eq("id", domainConfig.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("checkout_domains" as any)
          .insert({ user_id: user!.id, domain: domain.trim() } as any);
        if (error) throw error;
      }
      toast.success("Domínio configurado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["checkout_domain"] });
      setDomain("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("Tem certeza que deseja remover o domínio?")) return;
    const { error } = await supabase
      .from("checkout_domains" as any)
      .delete()
      .eq("id", domainConfig.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Domínio removido!");
    queryClient.invalidateQueries({ queryKey: ["checkout_domain"] });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  };

  const statusLabel = domainConfig?.status === "verified" ? "Verificado" : "Aguardando DNS";
  const statusColor = domainConfig?.status === "verified" ? "text-success" : "text-amber-500";

  // Extract subdomain part from full domain for CNAME Host
  const getHostPart = (d: string) => {
    const parts = d.split(".");
    return parts.length > 2 ? parts[0] : "@";
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Globe size={20} className="text-muted-foreground" />
          </div>
          <div className="text-left">
            <h3 className="font-heading font-semibold text-foreground">Domínio de Checkout</h3>
            <p className="text-xs text-muted-foreground">Configure seu domínio customizado</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {domainConfig && (
            <span className={`text-xs px-2.5 py-1 rounded-full border border-border flex items-center gap-1.5 ${statusColor}`}>
              <Clock size={12} />
              {statusLabel}
            </span>
          )}
          {expanded ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="px-5 pb-5 space-y-5 border-t border-border pt-5">
          {domainConfig ? (
            <>
              {/* Configured domain */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{domainConfig.domain}</p>
                    <p className="text-xs text-muted-foreground">
                      Configurado em {new Date(domainConfig.configured_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => copyToClipboard(domainConfig.domain)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Copiar">
                    <Copy size={15} />
                  </button>
                  <button onClick={() => window.open(`https://${domainConfig.domain}`, "_blank")} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Abrir">
                    <ExternalLink size={15} />
                  </button>
                </div>
              </div>

              {/* DNS Instructions */}
              <div className="rounded-lg border border-border p-4 space-y-4">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                  <h4 className="text-sm font-semibold text-foreground">Instruções de Configuração DNS:</h4>
                </div>

                <ol className="text-sm text-muted-foreground space-y-1.5 ml-6 list-decimal">
                  <li>Acesse o painel do seu provedor de DNS</li>
                  <li>Adicione um registro CNAME:</li>
                </ol>

                <div className="space-y-3 ml-6">
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Host:</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm font-mono text-foreground">
                        {getHostPart(domainConfig.domain)}
                      </div>
                      <button onClick={() => copyToClipboard(getHostPart(domainConfig.domain))} className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Target:</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm font-mono text-foreground">
                        {window.location.host}
                      </div>
                      <button onClick={() => copyToClipboard(window.location.host)} className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <ol className="text-sm text-muted-foreground space-y-1.5 ml-6 list-decimal" start={3}>
                  <li>Aguarde a propagação DNS (pode levar até 48h)</li>
                  <li>Clique em "Verificar Domínio" abaixo</li>
                </ol>
              </div>

              {/* DNS & SSL Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase">DNS</p>
                  <p className={`text-sm font-medium mt-1 flex items-center gap-1.5 ${domainConfig.status === "verified" ? "text-success" : "text-amber-500"}`}>
                    <Clock size={14} />
                    {domainConfig.status === "verified" ? "Verificado" : "Pendente"}
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase">CERTIFICADO SSL</p>
                  <p className="text-sm font-medium mt-1 flex items-center gap-1.5 text-muted-foreground">
                    <Clock size={14} />
                    {domainConfig.status === "verified" ? "Ativo" : "Aguardando"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">
                  <RefreshCw size={14} />
                  Verificar Domínio
                </button>
                <button onClick={handleRemove} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  <Trash2 size={14} />
                  Remover
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Setup form */}
              <div className="rounded-lg border border-border bg-amber-500/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Configure um domínio customizado</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Configure um subdomínio customizado para seus links de pagamento terem uma URL profissional.
                    </p>
                    <p className="text-sm text-primary font-medium mt-1">Exemplo: checkout.meudominio.com</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Domínio Completo</label>
                <div className="flex items-center gap-3">
                  <input
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    placeholder="subdominio.meudominio.com"
                    className="flex-1 px-4 py-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                  />
                  <button
                    onClick={handleConfigure}
                    disabled={saving}
                    className="px-5 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2 shrink-0"
                  >
                    {saving && <Loader2 size={14} className="animate-spin" />}
                    Configurar
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">Após configurar, você receberá instruções para configurar o DNS</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
