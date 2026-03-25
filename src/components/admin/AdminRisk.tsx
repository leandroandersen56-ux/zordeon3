import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Shield, Plus, Save, X, Trash2, AlertTriangle, Ban, Eye,
  Activity, Zap, Globe, Fingerprint, Search, CheckCircle, XCircle
} from "lucide-react";

const typeLabels: Record<string, { label: string; icon: any }> = {
  velocity: { label: "Velocidade", icon: Zap },
  amount: { label: "Valor", icon: Activity },
  geo: { label: "Geolocalização", icon: Globe },
  device: { label: "Dispositivo", icon: Fingerprint },
  pattern: { label: "Padrão", icon: Eye },
  blacklist: { label: "Blacklist", icon: Ban },
  whitelist: { label: "Whitelist", icon: CheckCircle },
};

const actionLabels: Record<string, { label: string; color: string }> = {
  flag: { label: "Sinalizar", color: "bg-warning/10 text-warning" },
  block: { label: "Bloquear", color: "bg-destructive/10 text-destructive" },
  review: { label: "Revisão Manual", color: "bg-primary/10 text-primary" },
  allow: { label: "Permitir", color: "bg-success/10 text-success" },
};

const severityLabels: Record<string, { label: string; color: string }> = {
  low: { label: "Baixa", color: "bg-muted text-muted-foreground" },
  medium: { label: "Média", color: "bg-warning/10 text-warning" },
  high: { label: "Alta", color: "bg-destructive/10 text-destructive" },
  critical: { label: "Crítica", color: "bg-destructive/20 text-destructive" },
};

export function AdminRisk() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showBlacklistForm, setShowBlacklistForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"rules" | "blacklist">("rules");
  const [ruleForm, setRuleForm] = useState({ name: "", description: "", type: "velocity", action: "flag", severity: "medium", applies_to: "all", is_active: true, priority: 50, conditions: "{}" });
  const [blForm, setBlForm] = useState({ type: "cpf", value: "", reason: "" });

  const { data: rules = [] } = useQuery({
    queryKey: ["admin-risk-rules"],
    queryFn: async () => { const { data } = await supabase.from("risk_rules").select("*").order("priority"); return data || []; },
  });

  const { data: blacklist = [] } = useQuery({
    queryKey: ["admin-blacklist"],
    queryFn: async () => { const { data } = await supabase.from("blacklist").select("*").order("created_at", { ascending: false }); return data || []; },
  });

  const saveRule = async () => {
    if (!ruleForm.name) { toast.error("Nome é obrigatório"); return; }
    let conditions;
    try { conditions = JSON.parse(ruleForm.conditions); } catch { toast.error("Condições JSON inválido"); return; }
    await supabase.from("risk_rules").insert({ ...ruleForm, conditions, created_by: user!.id });
    await supabase.from("admin_audit_log").insert({ admin_id: user!.id, action: "create_risk_rule", target_type: "risk_rule", details: { name: ruleForm.name } });
    setShowRuleForm(false);
    setRuleForm({ name: "", description: "", type: "velocity", action: "flag", severity: "medium", applies_to: "all", is_active: true, priority: 50, conditions: "{}" });
    qc.invalidateQueries({ queryKey: ["admin-risk-rules"] });
    toast.success("Regra criada");
  };

  const toggleRule = async (id: string, isActive: boolean) => {
    await supabase.from("risk_rules").update({ is_active: !isActive }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-risk-rules"] });
    toast.success(isActive ? "Regra desativada" : "Regra ativada");
  };

  const deleteRule = async (id: string) => {
    if (!confirm("Remover regra?")) return;
    await supabase.from("risk_rules").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-risk-rules"] });
    toast.success("Regra removida");
  };

  const addToBlacklist = async () => {
    if (!blForm.value) { toast.error("Valor obrigatório"); return; }
    await supabase.from("blacklist").insert({ ...blForm, added_by: user!.id });
    await supabase.from("admin_audit_log").insert({ admin_id: user!.id, action: "add_blacklist", target_type: "blacklist", details: blForm });
    setShowBlacklistForm(false);
    setBlForm({ type: "cpf", value: "", reason: "" });
    qc.invalidateQueries({ queryKey: ["admin-blacklist"] });
    toast.success("Adicionado à blacklist");
  };

  const removeFromBlacklist = async (id: string) => {
    await supabase.from("blacklist").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-blacklist"] });
    toast.success("Removido da blacklist");
  };

  const blTypeLabels: Record<string, string> = { cpf: "CPF", email: "Email", phone: "Telefone", card_bin: "Card BIN", ip: "IP", device_id: "Device ID" };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-semibold text-foreground text-lg">Risco & Antifraude</h3>
          <p className="text-xs text-muted-foreground">Regras de prevenção, velocity checks e blacklists</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-4"><div className="flex items-center gap-2 mb-1"><Shield size={14} className="text-primary" /><span className="text-xs text-muted-foreground">Regras Ativas</span></div><p className="text-lg font-heading font-bold text-foreground">{rules.filter((r: any) => r.is_active).length}</p></div>
        <div className="glass-card p-4"><div className="flex items-center gap-2 mb-1"><Ban size={14} className="text-destructive" /><span className="text-xs text-muted-foreground">Blacklist</span></div><p className="text-lg font-heading font-bold text-foreground">{blacklist.filter((b: any) => b.is_active).length}</p></div>
        <div className="glass-card p-4"><div className="flex items-center gap-2 mb-1"><AlertTriangle size={14} className="text-warning" /><span className="text-xs text-muted-foreground">Triggers (total)</span></div><p className="text-lg font-heading font-bold text-foreground">{rules.reduce((s: number, r: any) => s + (r.triggers_count || 0), 0)}</p></div>
        <div className="glass-card p-4"><div className="flex items-center gap-2 mb-1"><Activity size={14} className="text-success" /><span className="text-xs text-muted-foreground">Regras Bloqueio</span></div><p className="text-lg font-heading font-bold text-foreground">{rules.filter((r: any) => r.action === "block" && r.is_active).length}</p></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setActiveTab("rules")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "rules" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>Regras Antifraude</button>
        <button onClick={() => setActiveTab("blacklist")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "blacklist" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>Blacklist</button>
      </div>

      {activeTab === "rules" && (
        <div className="space-y-4">
          <button onClick={() => setShowRuleForm(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"><Plus size={16} /> Nova Regra</button>

          {showRuleForm && (
            <div className="glass-card p-5 border-2 border-primary/20 space-y-4">
              <div className="flex items-center justify-between"><h4 className="font-heading font-semibold text-foreground">Nova Regra Antifraude</h4><button onClick={() => setShowRuleForm(false)} className="p-1 rounded hover:bg-muted text-muted-foreground"><X size={18} /></button></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="text-xs text-muted-foreground font-medium">Nome *</label><input value={ruleForm.name} onChange={e => setRuleForm(p => ({ ...p, name: e.target.value }))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Ex: Max 5 txs/min por CPF" /></div>
                <div><label className="text-xs text-muted-foreground font-medium">Tipo</label><select value={ruleForm.type} onChange={e => setRuleForm(p => ({ ...p, type: e.target.value }))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                  {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select></div>
                <div><label className="text-xs text-muted-foreground font-medium">Ação</label><select value={ruleForm.action} onChange={e => setRuleForm(p => ({ ...p, action: e.target.value }))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                  {Object.entries(actionLabels).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select></div>
                <div><label className="text-xs text-muted-foreground font-medium">Severidade</label><select value={ruleForm.severity} onChange={e => setRuleForm(p => ({ ...p, severity: e.target.value }))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                  {Object.entries(severityLabels).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select></div>
                <div><label className="text-xs text-muted-foreground font-medium">Aplica-se a</label><select value={ruleForm.applies_to} onChange={e => setRuleForm(p => ({ ...p, applies_to: e.target.value }))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                  <option value="all">Todos</option><option value="pix">PIX</option><option value="card">Cartão</option><option value="boleto">Boleto</option>
                </select></div>
                <div><label className="text-xs text-muted-foreground font-medium">Prioridade</label><input type="number" value={ruleForm.priority} onChange={e => setRuleForm(p => ({ ...p, priority: Number(e.target.value) }))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" /></div>
              </div>
              <div><label className="text-xs text-muted-foreground font-medium">Descrição</label><input value={ruleForm.description} onChange={e => setRuleForm(p => ({ ...p, description: e.target.value }))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Descreva a regra..." /></div>
              <div><label className="text-xs text-muted-foreground font-medium">Condições (JSON)</label><textarea value={ruleForm.conditions} onChange={e => setRuleForm(p => ({ ...p, conditions: e.target.value }))} rows={3} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring resize-none" placeholder='{"max_per_minute": 5, "field": "cpf"}' /></div>
              <div className="flex justify-end gap-3"><button onClick={() => setShowRuleForm(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground">Cancelar</button><button onClick={saveRule} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"><Save size={14} /> Criar Regra</button></div>
            </div>
          )}

          {rules.length === 0 ? (
            <div className="glass-card p-12 text-center"><Shield size={40} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">Nenhuma regra antifraude configurada</p></div>
          ) : (
            <div className="space-y-2">
              {rules.map((r: any) => {
                const tp = typeLabels[r.type] || typeLabels.velocity;
                const ac = actionLabels[r.action] || actionLabels.flag;
                const sv = severityLabels[r.severity] || severityLabels.medium;
                const TIcon = tp.icon;
                return (
                  <div key={r.id} className={`glass-card p-4 flex items-center gap-4 ${!r.is_active ? "opacity-50" : ""}`}>
                    <div className="p-2 rounded-lg bg-muted"><TIcon size={16} className="text-foreground" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground text-sm">{r.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${ac.color}`}>{ac.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${sv.color}`}>{sv.label}</span>
                        {r.applies_to !== "all" && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{r.applies_to.toUpperCase()}</span>}
                      </div>
                      {r.description && <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>}
                      <p className="text-xs text-muted-foreground mt-0.5">Triggers: {r.triggers_count || 0} · Prioridade: {r.priority}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleRule(r.id, r.is_active)} className={`p-2 rounded-lg transition-colors ${r.is_active ? "hover:bg-warning/10 text-warning" : "hover:bg-success/10 text-success"}`} title={r.is_active ? "Desativar" : "Ativar"}>{r.is_active ? <XCircle size={15} /> : <CheckCircle size={15} />}</button>
                      <button onClick={() => deleteRule(r.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "blacklist" && (
        <div className="space-y-4">
          <button onClick={() => setShowBlacklistForm(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium"><Plus size={16} /> Adicionar à Blacklist</button>

          {showBlacklistForm && (
            <div className="glass-card p-5 border-2 border-destructive/20 space-y-4">
              <div className="flex items-center justify-between"><h4 className="font-heading font-semibold text-foreground">Nova Entrada Blacklist</h4><button onClick={() => setShowBlacklistForm(false)} className="p-1 rounded hover:bg-muted text-muted-foreground"><X size={18} /></button></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="text-xs text-muted-foreground font-medium">Tipo</label><select value={blForm.type} onChange={e => setBlForm(p => ({ ...p, type: e.target.value }))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                  {Object.entries(blTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select></div>
                <div><label className="text-xs text-muted-foreground font-medium">Valor *</label><input value={blForm.value} onChange={e => setBlForm(p => ({ ...p, value: e.target.value }))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Ex: 123.456.789-00" /></div>
                <div><label className="text-xs text-muted-foreground font-medium">Motivo</label><input value={blForm.reason} onChange={e => setBlForm(p => ({ ...p, reason: e.target.value }))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Fraude confirmada" /></div>
              </div>
              <div className="flex justify-end gap-3"><button onClick={() => setShowBlacklistForm(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground">Cancelar</button><button onClick={addToBlacklist} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium"><Ban size={14} /> Bloquear</button></div>
            </div>
          )}

          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground"><th className="text-left px-4 py-3 font-medium">TIPO</th><th className="text-left px-4 py-3 font-medium">VALOR</th><th className="text-left px-4 py-3 font-medium">MOTIVO</th><th className="text-left px-4 py-3 font-medium">DATA</th><th className="text-center px-4 py-3 font-medium">AÇÃO</th></tr></thead>
              <tbody>
                {blacklist.length === 0 ? (
                  <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Blacklist vazia</td></tr>
                ) : blacklist.map((b: any) => (
                  <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">{blTypeLabels[b.type] || b.type}</span></td>
                    <td className="px-4 py-3 text-foreground font-mono text-xs">{b.value}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{b.reason || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(b.created_at).toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3 text-center"><button onClick={() => removeFromBlacklist(b.id)} className="p-1.5 rounded hover:bg-success/10 text-success text-xs">Remover</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
