import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search, ChevronDown, ChevronUp, Save, Store, AlertTriangle,
  Shield, Gauge, Ban, CheckCircle, Settings, CreditCard, Zap
} from "lucide-react";

const riskColors: Record<string, string> = {
  low: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
  critical: "bg-destructive/20 text-destructive",
};

export function AdminMerchants() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, any>>({});

  const { data: merchants = [] } = useQuery({
    queryKey: ["admin-merchants"],
    queryFn: async () => {
      const { data: profiles } = await supabase.from("profiles").select("id, full_name, email, account_status, kyc_status, created_at");
      const { data: configs } = await supabase.from("merchant_configs").select("*");
      const { data: txs } = await supabase.from("transactions").select("user_id, amount, status");
      
      return (profiles || []).map((p: any) => {
        const config = (configs || []).find((c: any) => c.user_id === p.id);
        const userTxs = (txs || []).filter((t: any) => t.user_id === p.id);
        const volume = userTxs.filter((t: any) => t.status === "approved").reduce((s: number, t: any) => s + Number(t.amount), 0);
        const txCount = userTxs.length;
        return { ...p, config, volume, txCount };
      });
    },
  });

  const fmt = (v: number) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  const startEdit = (m: any) => {
    const c = m.config || {};
    setEditing(prev => ({
      ...prev, [m.id]: {
        pix_fee_pct: c.pix_fee_pct ?? "", pix_fee_fixed: c.pix_fee_fixed ?? "",
        card_fee_pct: c.card_fee_pct ?? "", card_fee_fixed: c.card_fee_fixed ?? "",
        boleto_fee_pct: c.boleto_fee_pct ?? "", boleto_fee_fixed: c.boleto_fee_fixed ?? "",
        daily_transaction_limit: c.daily_transaction_limit ?? 50000,
        monthly_transaction_limit: c.monthly_transaction_limit ?? 1500000,
        single_transaction_limit: c.single_transaction_limit ?? 10000,
        min_transaction_amount: c.min_transaction_amount ?? 1,
        settlement_cycle: c.settlement_cycle ?? "D+1",
        auto_settlement: c.auto_settlement ?? true,
        settlement_pix_key: c.settlement_pix_key ?? "",
        settlement_bank_code: c.settlement_bank_code ?? "",
        settlement_agency: c.settlement_agency ?? "",
        settlement_account: c.settlement_account ?? "",
        settlement_account_type: c.settlement_account_type ?? "checking",
        risk_level: c.risk_level ?? "medium",
        max_chargeback_rate: c.max_chargeback_rate ?? 1.0,
        velocity_check_enabled: c.velocity_check_enabled ?? true,
        max_transactions_per_hour: c.max_transactions_per_hour ?? 100,
        max_transactions_per_day: c.max_transactions_per_day ?? 1000,
        require_3ds: c.require_3ds ?? false,
        require_avs: c.require_avs ?? false,
        block_international: c.block_international ?? false,
        block_prepaid_cards: c.block_prepaid_cards ?? false,
        is_sandbox: c.is_sandbox ?? false,
        notes: c.notes ?? "",
      }
    }));
  };

  const saveConfig = async (userId: string) => {
    const edit = editing[userId];
    if (!edit) return;
    const merchant = merchants.find((m: any) => m.id === userId);
    const payload = { ...edit, user_id: userId, updated_at: new Date().toISOString() };
    
    // Convert empty strings to null for numeric fields
    ["pix_fee_pct","pix_fee_fixed","card_fee_pct","card_fee_fixed","boleto_fee_pct","boleto_fee_fixed"].forEach(k => {
      if (payload[k] === "") payload[k] = null;
      else payload[k] = Number(payload[k]);
    });
    ["daily_transaction_limit","monthly_transaction_limit","single_transaction_limit","min_transaction_amount","max_chargeback_rate","max_transactions_per_hour","max_transactions_per_day"].forEach(k => {
      payload[k] = Number(payload[k]);
    });

    if (merchant?.config) {
      await supabase.from("merchant_configs").update(payload).eq("id", merchant.config.id);
    } else {
      await supabase.from("merchant_configs").insert(payload);
    }
    await supabase.from("admin_audit_log").insert({ admin_id: user!.id, action: "update_merchant_config", target_type: "merchant", target_id: userId });
    setEditing(prev => { const n = { ...prev }; delete n[userId]; return n; });
    qc.invalidateQueries({ queryKey: ["admin-merchants"] });
    toast.success("Configuração do merchant atualizada");
  };

  const uf = (userId: string, field: string, value: any) =>
    setEditing(prev => ({ ...prev, [userId]: { ...prev[userId], [field]: value } }));

  const filtered = merchants.filter((m: any) =>
    m.full_name?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase())
  );

  const InputField = ({ label, userId, field, type = "text", placeholder = "" }: any) => (
    <div>
      <label className="text-xs text-muted-foreground font-medium">{label}</label>
      <input type={type} value={editing[userId]?.[field] ?? ""} onChange={e => uf(userId, field, e.target.value)}
        className="w-full mt-1 px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder={placeholder} />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-semibold text-foreground text-lg">Gestão de Merchants</h3>
          <p className="text-xs text-muted-foreground">Configure taxas individuais, limites, liquidação e risco por merchant</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar merchant..." className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} merchant(s)</p>

      <div className="space-y-3">
        {filtered.map((m: any) => {
          const isExpanded = expandedId === m.id;
          const isEditing = !!editing[m.id];
          const c = m.config || {};
          return (
            <div key={m.id} className="glass-card overflow-hidden">
              <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => { setExpandedId(isExpanded ? null : m.id); }}>
                <div className="p-2.5 rounded-lg bg-muted"><Store size={18} className="text-foreground" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-foreground">{m.full_name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
                <div className="hidden md:flex items-center gap-5 text-sm">
                  <div className="text-right"><p className="text-xs text-muted-foreground">Volume</p><p className="font-medium text-foreground">{fmt(m.volume)}</p></div>
                  <div className="text-right"><p className="text-xs text-muted-foreground">Txs</p><p className="font-medium text-foreground">{m.txCount}</p></div>
                  <span className={`text-xs px-2 py-1 rounded-full ${riskColors[c.risk_level || "medium"]}`}>{(c.risk_level || "medium").toUpperCase()}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${c.is_sandbox ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>{c.is_sandbox ? "Sandbox" : "Produção"}</span>
                </div>
                {isExpanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
              </div>

              {isExpanded && (
                <div className="border-t border-border p-4">
                  {!isEditing ? (
                    <div className="space-y-4">
                      {/* Current config summary */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="glass-card p-3"><div className="flex items-center gap-1 mb-1"><Zap size={12} className="text-primary" /><span className="text-xs text-muted-foreground">PIX Fee</span></div><p className="text-sm font-medium text-foreground">{c.pix_fee_pct != null ? `${c.pix_fee_pct}% + R$${c.pix_fee_fixed || 0}` : "Global"}</p></div>
                        <div className="glass-card p-3"><div className="flex items-center gap-1 mb-1"><CreditCard size={12} className="text-violet-400" /><span className="text-xs text-muted-foreground">Card Fee</span></div><p className="text-sm font-medium text-foreground">{c.card_fee_pct != null ? `${c.card_fee_pct}% + R$${c.card_fee_fixed || 0}` : "Global"}</p></div>
                        <div className="glass-card p-3"><div className="flex items-center gap-1 mb-1"><Gauge size={12} className="text-warning" /><span className="text-xs text-muted-foreground">Limite Diário</span></div><p className="text-sm font-medium text-foreground">{fmt(c.daily_transaction_limit || 50000)}</p></div>
                        <div className="glass-card p-3"><div className="flex items-center gap-1 mb-1"><Shield size={12} className="text-cyan-400" /><span className="text-xs text-muted-foreground">Liquidação</span></div><p className="text-sm font-medium text-foreground">{c.settlement_cycle || "D+1"}</p></div>
                      </div>
                      <button onClick={() => startEdit(m)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <Settings size={14} /> Configurar Merchant
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {/* Fees */}
                      <div>
                        <h5 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center gap-2"><CreditCard size={14} /> Taxas Individuais <span className="text-xs text-muted-foreground font-normal">(vazio = usar taxa global)</span></h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <InputField label="PIX %" userId={m.id} field="pix_fee_pct" type="number" placeholder="Global" />
                          <InputField label="PIX Fixo (R$)" userId={m.id} field="pix_fee_fixed" type="number" placeholder="Global" />
                          <InputField label="Cartão %" userId={m.id} field="card_fee_pct" type="number" placeholder="Global" />
                          <InputField label="Cartão Fixo (R$)" userId={m.id} field="card_fee_fixed" type="number" placeholder="Global" />
                          <InputField label="Boleto %" userId={m.id} field="boleto_fee_pct" type="number" placeholder="Global" />
                          <InputField label="Boleto Fixo (R$)" userId={m.id} field="boleto_fee_fixed" type="number" placeholder="Global" />
                        </div>
                      </div>
                      {/* Limits */}
                      <div>
                        <h5 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center gap-2"><Gauge size={14} /> Limites Operacionais</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <InputField label="Tx Única Máx (R$)" userId={m.id} field="single_transaction_limit" type="number" />
                          <InputField label="Mín por Tx (R$)" userId={m.id} field="min_transaction_amount" type="number" />
                          <InputField label="Limite Diário (R$)" userId={m.id} field="daily_transaction_limit" type="number" />
                          <InputField label="Limite Mensal (R$)" userId={m.id} field="monthly_transaction_limit" type="number" />
                        </div>
                      </div>
                      {/* Settlement */}
                      <div>
                        <h5 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center gap-2"><Store size={14} /> Liquidação / Settlement</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="text-xs text-muted-foreground font-medium">Ciclo</label>
                            <select value={editing[m.id]?.settlement_cycle} onChange={e => uf(m.id, "settlement_cycle", e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                              <option value="D+0">D+0</option><option value="D+1">D+1</option><option value="D+2">D+2</option><option value="D+14">D+14</option><option value="D+30">D+30</option>
                            </select>
                          </div>
                          <InputField label="Chave PIX" userId={m.id} field="settlement_pix_key" />
                          <InputField label="Banco" userId={m.id} field="settlement_bank_code" placeholder="341" />
                          <InputField label="Agência" userId={m.id} field="settlement_agency" />
                          <InputField label="Conta" userId={m.id} field="settlement_account" />
                          <div>
                            <label className="text-xs text-muted-foreground font-medium">Tipo Conta</label>
                            <select value={editing[m.id]?.settlement_account_type} onChange={e => uf(m.id, "settlement_account_type", e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                              <option value="checking">Corrente</option><option value="savings">Poupança</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      {/* Risk */}
                      <div>
                        <h5 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center gap-2"><Shield size={14} /> Risco & Antifraude</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="text-xs text-muted-foreground font-medium">Nível de Risco</label>
                            <select value={editing[m.id]?.risk_level} onChange={e => uf(m.id, "risk_level", e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                              <option value="low">Baixo</option><option value="medium">Médio</option><option value="high">Alto</option><option value="critical">Crítico</option>
                            </select>
                          </div>
                          <InputField label="Max Chargeback (%)" userId={m.id} field="max_chargeback_rate" type="number" />
                          <InputField label="Max Txs/Hora" userId={m.id} field="max_transactions_per_hour" type="number" />
                          <InputField label="Max Txs/Dia" userId={m.id} field="max_transactions_per_day" type="number" />
                        </div>
                        <div className="flex flex-wrap gap-4 mt-3">
                          {[
                            { key: "velocity_check_enabled", label: "Velocity Check" },
                            { key: "require_3ds", label: "Exigir 3DS" },
                            { key: "require_avs", label: "Exigir AVS" },
                            { key: "block_international", label: "Bloquear Internacional" },
                            { key: "block_prepaid_cards", label: "Bloquear Pré-pago" },
                            { key: "is_sandbox", label: "Modo Sandbox" },
                          ].map(f => (
                            <label key={f.key} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                              <input type="checkbox" checked={editing[m.id]?.[f.key] ?? false} onChange={e => uf(m.id, f.key, e.target.checked)} className="rounded border-border" /> {f.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      {/* Notes */}
                      <div>
                        <label className="text-xs text-muted-foreground font-medium">Observações internas</label>
                        <textarea value={editing[m.id]?.notes ?? ""} onChange={e => uf(m.id, "notes", e.target.value)} rows={2} className="w-full mt-1 px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                      </div>
                      <div className="flex justify-end gap-3 pt-3 border-t border-border">
                        <button onClick={() => setEditing(prev => { const n = { ...prev }; delete n[m.id]; return n; })} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground">Cancelar</button>
                        <button onClick={() => saveConfig(m.id)} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"><Save size={14} /> Salvar Configuração</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
