import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Zap, CreditCard, FileText, Plus, Settings, Activity, Server,
  CheckCircle, XCircle, AlertTriangle, Pause, Trash2, Save, X,
  Globe, Shield, RefreshCw, ArrowUpDown, Wifi, WifiOff
} from "lucide-react";

const typeIcons: Record<string, any> = { pix: Zap, card: CreditCard, boleto: FileText, multi: Globe };
const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  active: { label: "Ativo", color: "bg-success/10 text-success", icon: CheckCircle },
  inactive: { label: "Inativo", color: "bg-muted text-muted-foreground", icon: XCircle },
  maintenance: { label: "Manutenção", color: "bg-warning/10 text-warning", icon: Pause },
  degraded: { label: "Degradado", color: "bg-destructive/10 text-destructive", icon: AlertTriangle },
};

const emptyAcquirer = {
  name: "", type: "pix", provider: "", status: "inactive", priority: 1,
  api_endpoint: "", api_version: "v1", credential_key: "",
  settlement_type: "D+1", max_amount: 50000, min_amount: 1,
  daily_limit: 1000000, monthly_limit: 30000000,
  supports_refund: true, supports_partial_refund: false,
  supports_recurring: false, supports_split: false,
  webhook_url: "", notes: "",
};

export function AdminProviders() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({ ...emptyAcquirer });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: acquirers = [] } = useQuery({
    queryKey: ["admin-acquirers"],
    queryFn: async () => {
      const { data } = await supabase.from("acquirers").select("*").order("priority");
      return data || [];
    },
  });

  const fmt = (v: number) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  const save = async () => {
    if (!form.name || !form.provider) { toast.error("Nome e provedor são obrigatórios"); return; }
    const payload = { ...form, updated_at: new Date().toISOString() };
    if (editId) {
      await supabase.from("acquirers").update(payload).eq("id", editId);
      await supabase.from("admin_audit_log").insert({ admin_id: user!.id, action: "update_acquirer", target_type: "acquirer", target_id: editId, details: { name: form.name } });
      toast.success("Provedor atualizado");
    } else {
      const { data } = await supabase.from("acquirers").insert(payload).select("id").single();
      await supabase.from("admin_audit_log").insert({ admin_id: user!.id, action: "create_acquirer", target_type: "acquirer", target_id: data?.id || "", details: { name: form.name } });
      toast.success("Provedor criado");
    }
    setShowForm(false); setEditId(null); setForm({ ...emptyAcquirer });
    qc.invalidateQueries({ queryKey: ["admin-acquirers"] });
  };

  const del = async (id: string, name: string) => {
    if (!confirm(`Remover provedor "${name}"?`)) return;
    await supabase.from("acquirers").delete().eq("id", id);
    await supabase.from("admin_audit_log").insert({ admin_id: user!.id, action: "delete_acquirer", target_type: "acquirer", target_id: id });
    qc.invalidateQueries({ queryKey: ["admin-acquirers"] });
    toast.success("Provedor removido");
  };

  const toggleStatus = async (acq: any) => {
    const next = acq.status === "active" ? "inactive" : "active";
    await supabase.from("acquirers").update({ status: next, updated_at: new Date().toISOString() }).eq("id", acq.id);
    await supabase.from("admin_audit_log").insert({ admin_id: user!.id, action: `acquirer_${next}`, target_type: "acquirer", target_id: acq.id });
    qc.invalidateQueries({ queryKey: ["admin-acquirers"] });
    toast.success(next === "active" ? "Provedor ativado" : "Provedor desativado");
  };

  const edit = (acq: any) => {
    setForm({ ...acq });
    setEditId(acq.id);
    setShowForm(true);
  };

  const uf = (field: string, value: any) => setForm((p: any) => ({ ...p, [field]: value }));

  const providers = [
    { label: "Celcoin", value: "celcoin" }, { label: "EFÍ (Gerencianet)", value: "efi" },
    { label: "Stark Bank", value: "stark_bank" }, { label: "Banco Inter", value: "banco_inter" },
    { label: "Mercado Pago", value: "mercado_pago" }, { label: "PagSeguro", value: "pagseguro" },
    { label: "Cielo", value: "cielo" }, { label: "Rede", value: "rede" },
    { label: "Stone", value: "stone" }, { label: "Adyen", value: "adyen" },
    { label: "Stripe", value: "stripe" }, { label: "Pagar.me", value: "pagarme" },
    { label: "Zoop", value: "zoop" }, { label: "Juno", value: "juno" },
    { label: "Asaas", value: "asaas" }, { label: "Outro", value: "custom" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-semibold text-foreground text-lg">Provedores & Adquirentes</h3>
          <p className="text-xs text-muted-foreground">Configure PSPs, adquirentes de cartão, provedores PIX e boleto</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ ...emptyAcquirer }); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={16} /> Novo Provedor
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Provedores", value: acquirers.length, icon: Server },
          { label: "Ativos", value: acquirers.filter((a: any) => a.status === "active").length, icon: Wifi },
          { label: "Inativos", value: acquirers.filter((a: any) => a.status !== "active").length, icon: WifiOff },
          { label: "Volume Processado", value: fmt(acquirers.reduce((s: number, a: any) => s + Number(a.total_processed || 0), 0)), icon: Activity },
        ].map(k => (
          <div key={k.label} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1"><k.icon size={14} className="text-muted-foreground" /><span className="text-xs text-muted-foreground">{k.label}</span></div>
            <p className="text-lg font-heading font-bold text-foreground">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="glass-card p-6 border-2 border-primary/20">
          <div className="flex items-center justify-between mb-5">
            <h4 className="font-heading font-semibold text-foreground">{editId ? "Editar Provedor" : "Novo Provedor"}</h4>
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="p-1 rounded hover:bg-muted text-muted-foreground"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Basic */}
            <div><label className="text-xs text-muted-foreground font-medium">Nome *</label><input value={form.name} onChange={e => uf("name", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Ex: PIX Celcoin" /></div>
            <div><label className="text-xs text-muted-foreground font-medium">Provedor *</label>
              <select value={form.provider} onChange={e => uf("provider", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Selecione...</option>
                {providers.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground font-medium">Tipo</label>
              <select value={form.type} onChange={e => uf("type", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="pix">PIX</option><option value="card">Cartão</option><option value="boleto">Boleto</option><option value="multi">Multi</option>
              </select>
            </div>
            {/* API */}
            <div><label className="text-xs text-muted-foreground font-medium">API Endpoint</label><input value={form.api_endpoint} onChange={e => uf("api_endpoint", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="https://api.provedor.com" /></div>
            <div><label className="text-xs text-muted-foreground font-medium">Versão da API</label><input value={form.api_version} onChange={e => uf("api_version", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="v1" /></div>
            <div><label className="text-xs text-muted-foreground font-medium">Credential Key (referência)</label><input value={form.credential_key} onChange={e => uf("credential_key", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="CELCOIN_API_KEY" /></div>
            {/* Limits */}
            <div><label className="text-xs text-muted-foreground font-medium">Liquidação</label>
              <select value={form.settlement_type} onChange={e => uf("settlement_type", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="D+0">D+0 (Instantâneo)</option><option value="D+1">D+1</option><option value="D+2">D+2</option><option value="D+14">D+14</option><option value="D+30">D+30</option>
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground font-medium">Valor Mínimo (R$)</label><input type="number" value={form.min_amount} onChange={e => uf("min_amount", Number(e.target.value))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" /></div>
            <div><label className="text-xs text-muted-foreground font-medium">Valor Máximo (R$)</label><input type="number" value={form.max_amount} onChange={e => uf("max_amount", Number(e.target.value))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" /></div>
            <div><label className="text-xs text-muted-foreground font-medium">Limite Diário (R$)</label><input type="number" value={form.daily_limit} onChange={e => uf("daily_limit", Number(e.target.value))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" /></div>
            <div><label className="text-xs text-muted-foreground font-medium">Limite Mensal (R$)</label><input type="number" value={form.monthly_limit} onChange={e => uf("monthly_limit", Number(e.target.value))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" /></div>
            <div><label className="text-xs text-muted-foreground font-medium">Prioridade</label><input type="number" value={form.priority} onChange={e => uf("priority", Number(e.target.value))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" min={1} /></div>
            {/* Webhook */}
            <div className="md:col-span-2"><label className="text-xs text-muted-foreground font-medium">Webhook URL</label><input value={form.webhook_url} onChange={e => uf("webhook_url", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="https://seudominio.com/webhook/provedor" /></div>
            {/* Features */}
            <div className="md:col-span-3 flex flex-wrap gap-4">
              {[
                { key: "supports_refund", label: "Estorno" }, { key: "supports_partial_refund", label: "Estorno parcial" },
                { key: "supports_recurring", label: "Recorrência" }, { key: "supports_split", label: "Split" },
              ].map(f => (
                <label key={f.key} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input type="checkbox" checked={form[f.key]} onChange={e => uf(f.key, e.target.checked)} className="rounded border-border" /> {f.label}
                </label>
              ))}
            </div>
            {/* Notes */}
            <div className="md:col-span-3"><label className="text-xs text-muted-foreground font-medium">Observações</label><textarea value={form.notes} onChange={e => uf("notes", e.target.value)} rows={2} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" /></div>
          </div>
          <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-border">
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
            <button onClick={save} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"><Save size={15} /> {editId ? "Atualizar" : "Criar Provedor"}</button>
          </div>
        </div>
      )}

      {/* Acquirers list */}
      {acquirers.length === 0 && !showForm ? (
        <div className="glass-card p-16 text-center">
          <Server size={40} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-2">Nenhum provedor configurado</p>
          <p className="text-xs text-muted-foreground">Adicione um PSP, adquirente ou provedor de pagamento para começar a processar transações</p>
        </div>
      ) : (
        <div className="space-y-3">
          {acquirers.map((acq: any) => {
            const TypeIcon = typeIcons[acq.type] || Globe;
            const st = statusConfig[acq.status] || statusConfig.inactive;
            const StIcon = st.icon;
            const isExpanded = expandedId === acq.id;
            return (
              <div key={acq.id} className="glass-card overflow-hidden">
                <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : acq.id)}>
                  <div className="p-2.5 rounded-lg bg-muted"><TypeIcon size={20} className="text-foreground" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-heading font-semibold text-foreground">{acq.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${st.color} flex items-center gap-1`}><StIcon size={10} />{st.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{acq.provider} · {acq.type.toUpperCase()} · Prioridade: {acq.priority} · Liquidação: {acq.settlement_type}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-6 text-sm">
                    <div className="text-right"><p className="text-xs text-muted-foreground">Taxa Sucesso</p><p className="font-medium text-foreground">{Number(acq.success_rate).toFixed(1)}%</p></div>
                    <div className="text-right"><p className="text-xs text-muted-foreground">Latência</p><p className="font-medium text-foreground">{acq.avg_response_ms}ms</p></div>
                    <div className="text-right"><p className="text-xs text-muted-foreground">Processado</p><p className="font-medium text-foreground">{fmt(acq.total_processed)}</p></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); toggleStatus(acq); }} className={`p-2 rounded-lg transition-colors ${acq.status === "active" ? "hover:bg-destructive/10 text-destructive" : "hover:bg-success/10 text-success"}`} title={acq.status === "active" ? "Desativar" : "Ativar"}>
                      {acq.status === "active" ? <Pause size={15} /> : <CheckCircle size={15} />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); edit(acq); }} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><Settings size={15} /></button>
                    <button onClick={(e) => { e.stopPropagation(); del(acq.id, acq.name); }} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"><Trash2 size={15} /></button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><span className="text-xs text-muted-foreground block">API Endpoint</span><span className="text-foreground font-mono text-xs break-all">{acq.api_endpoint || "—"}</span></div>
                      <div><span className="text-xs text-muted-foreground block">API Version</span><span className="text-foreground">{acq.api_version}</span></div>
                      <div><span className="text-xs text-muted-foreground block">Credential Key</span><span className="text-foreground font-mono text-xs">{acq.credential_key || "—"}</span></div>
                      <div><span className="text-xs text-muted-foreground block">Webhook</span><span className="text-foreground font-mono text-xs break-all">{acq.webhook_url || "—"}</span></div>
                      <div><span className="text-xs text-muted-foreground block">Valor Mín / Máx</span><span className="text-foreground">{fmt(acq.min_amount)} — {fmt(acq.max_amount)}</span></div>
                      <div><span className="text-xs text-muted-foreground block">Limite Diário</span><span className="text-foreground">{fmt(acq.daily_limit)}</span></div>
                      <div><span className="text-xs text-muted-foreground block">Limite Mensal</span><span className="text-foreground">{fmt(acq.monthly_limit)}</span></div>
                      <div><span className="text-xs text-muted-foreground block">Último Health Check</span><span className="text-foreground">{acq.last_health_check ? new Date(acq.last_health_check).toLocaleString("pt-BR") : "Nunca"}</span></div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {acq.supports_refund && <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success">Estorno</span>}
                      {acq.supports_partial_refund && <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success">Estorno Parcial</span>}
                      {acq.supports_recurring && <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Recorrência</span>}
                      {acq.supports_split && <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Split</span>}
                    </div>
                    {acq.notes && <p className="mt-3 text-xs text-muted-foreground italic">{acq.notes}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
