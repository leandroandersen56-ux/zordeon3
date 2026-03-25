import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Wallet, Plus, CheckCircle, XCircle, Clock, Ban, FileText,
  ArrowRight, Save, X, DollarSign
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendente", color: "bg-warning/10 text-warning" },
  processing: { label: "Processando", color: "bg-primary/10 text-primary" },
  completed: { label: "Concluído", color: "bg-success/10 text-success" },
  failed: { label: "Falhou", color: "bg-destructive/10 text-destructive" },
  partial: { label: "Parcial", color: "bg-warning/10 text-warning" },
};

export function AdminSettlements() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    batch_number: "", settlement_date: new Date().toISOString().split("T")[0],
    total_amount: 0, total_fees: 0, net_amount: 0, transaction_count: 0,
    pix_amount: 0, card_amount: 0, boleto_amount: 0,
    refund_amount: 0, chargeback_amount: 0, notes: "",
  });

  const { data: batches = [] } = useQuery({
    queryKey: ["admin-settlements"],
    queryFn: async () => { const { data } = await supabase.from("settlement_batches").select("*").order("settlement_date", { ascending: false }); return data || []; },
  });

  const fmt = (v: number) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  const createBatch = async () => {
    if (!form.batch_number) { toast.error("Número do lote obrigatório"); return; }
    await supabase.from("settlement_batches").insert(form);
    await supabase.from("admin_audit_log").insert({ admin_id: user!.id, action: "create_settlement", target_type: "settlement", details: { batch: form.batch_number } });
    setShowForm(false);
    qc.invalidateQueries({ queryKey: ["admin-settlements"] });
    toast.success("Lote de liquidação criado");
  };

  const updateStatus = async (id: string, status: string) => {
    const updates: any = { status };
    if (status === "completed") updates.paid_at = new Date().toISOString();
    await supabase.from("settlement_batches").update(updates).eq("id", id);
    await supabase.from("admin_audit_log").insert({ admin_id: user!.id, action: `settlement_${status}`, target_type: "settlement", target_id: id });
    qc.invalidateQueries({ queryKey: ["admin-settlements"] });
    toast.success("Status atualizado");
  };

  const uf = (field: string, value: any) => setForm(p => ({ ...p, [field]: value }));

  // Summary
  const totalPending = batches.filter((b: any) => b.status === "pending").reduce((s: number, b: any) => s + Number(b.net_amount), 0);
  const totalCompleted = batches.filter((b: any) => b.status === "completed").reduce((s: number, b: any) => s + Number(b.net_amount), 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-semibold text-foreground text-lg">Liquidações / Settlement</h3>
          <p className="text-xs text-muted-foreground">Gerencie lotes de liquidação, ciclos D+0 a D+30 e pagamentos</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"><Plus size={16} /> Novo Lote</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-4"><div className="flex items-center gap-2 mb-1"><DollarSign size={14} className="text-success" /><span className="text-xs text-muted-foreground">Total Liquidado</span></div><p className="text-lg font-heading font-bold text-foreground">{fmt(totalCompleted)}</p></div>
        <div className="glass-card p-4"><div className="flex items-center gap-2 mb-1"><Clock size={14} className="text-warning" /><span className="text-xs text-muted-foreground">Pendente</span></div><p className="text-lg font-heading font-bold text-foreground">{fmt(totalPending)}</p></div>
        <div className="glass-card p-4"><div className="flex items-center gap-2 mb-1"><FileText size={14} className="text-primary" /><span className="text-xs text-muted-foreground">Total Lotes</span></div><p className="text-lg font-heading font-bold text-foreground">{batches.length}</p></div>
        <div className="glass-card p-4"><div className="flex items-center gap-2 mb-1"><Wallet size={14} className="text-cyan-400" /><span className="text-xs text-muted-foreground">Lotes Pendentes</span></div><p className="text-lg font-heading font-bold text-foreground">{batches.filter((b: any) => b.status === "pending").length}</p></div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card p-6 border-2 border-primary/20 space-y-4">
          <div className="flex items-center justify-between"><h4 className="font-heading font-semibold text-foreground">Novo Lote de Liquidação</h4><button onClick={() => setShowForm(false)} className="p-1 rounded hover:bg-muted text-muted-foreground"><X size={18} /></button></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><label className="text-xs text-muted-foreground font-medium">Nº do Lote *</label><input value={form.batch_number} onChange={e => uf("batch_number", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="BATCH-2026-001" /></div>
            <div><label className="text-xs text-muted-foreground font-medium">Data Liquidação</label><input type="date" value={form.settlement_date} onChange={e => uf("settlement_date", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" /></div>
            <div><label className="text-xs text-muted-foreground font-medium">Valor Bruto (R$)</label><input type="number" value={form.total_amount} onChange={e => { const v = Number(e.target.value); uf("total_amount", v); uf("net_amount", v - form.total_fees); }} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" /></div>
            <div><label className="text-xs text-muted-foreground font-medium">Taxas (R$)</label><input type="number" value={form.total_fees} onChange={e => { const v = Number(e.target.value); uf("total_fees", v); uf("net_amount", form.total_amount - v); }} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" /></div>
            <div><label className="text-xs text-muted-foreground font-medium">Nº Transações</label><input type="number" value={form.transaction_count} onChange={e => uf("transaction_count", Number(e.target.value))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" /></div>
            <div><label className="text-xs text-muted-foreground font-medium">Vol PIX (R$)</label><input type="number" value={form.pix_amount} onChange={e => uf("pix_amount", Number(e.target.value))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" /></div>
            <div><label className="text-xs text-muted-foreground font-medium">Vol Cartão (R$)</label><input type="number" value={form.card_amount} onChange={e => uf("card_amount", Number(e.target.value))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" /></div>
            <div><label className="text-xs text-muted-foreground font-medium">Vol Boleto (R$)</label><input type="number" value={form.boleto_amount} onChange={e => uf("boleto_amount", Number(e.target.value))} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" /></div>
          </div>
          <div className="glass-card p-3 bg-muted/30"><p className="text-sm text-foreground">Valor Líquido: <span className="font-heading font-bold text-primary">{fmt(form.net_amount)}</span></p></div>
          <div><label className="text-xs text-muted-foreground font-medium">Observações</label><textarea value={form.notes} onChange={e => uf("notes", e.target.value)} rows={2} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" /></div>
          <div className="flex justify-end gap-3"><button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground">Cancelar</button><button onClick={createBatch} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"><Save size={14} /> Criar Lote</button></div>
        </div>
      )}

      {/* Batches */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left px-4 py-3 font-medium">LOTE</th>
              <th className="text-left px-4 py-3 font-medium">DATA</th>
              <th className="text-right px-4 py-3 font-medium">BRUTO</th>
              <th className="text-right px-4 py-3 font-medium">TAXAS</th>
              <th className="text-right px-4 py-3 font-medium">LÍQUIDO</th>
              <th className="text-right px-4 py-3 font-medium">TXS</th>
              <th className="text-left px-4 py-3 font-medium">STATUS</th>
              <th className="text-center px-4 py-3 font-medium">AÇÕES</th>
            </tr></thead>
            <tbody>
              {batches.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-muted-foreground">Nenhum lote de liquidação</td></tr>
              ) : batches.map((b: any) => {
                const st = statusConfig[b.status] || statusConfig.pending;
                return (
                  <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs text-foreground font-medium">{b.batch_number}</td>
                    <td className="px-4 py-3 text-foreground text-xs">{new Date(b.settlement_date).toLocaleDateString("pt-BR")}</td>
                    <td className="px-4 py-3 text-right text-foreground">{fmt(b.total_amount)}</td>
                    <td className="px-4 py-3 text-right text-destructive text-xs">{fmt(b.total_fees)}</td>
                    <td className="px-4 py-3 text-right text-foreground font-medium">{fmt(b.net_amount)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{b.transaction_count}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${st.color}`}>{st.label}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {b.status === "pending" && (
                          <>
                            <button onClick={() => updateStatus(b.id, "processing")} className="p-1.5 rounded hover:bg-primary/10 text-primary text-xs font-medium">Processar</button>
                            <button onClick={() => updateStatus(b.id, "failed")} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><XCircle size={14} /></button>
                          </>
                        )}
                        {b.status === "processing" && (
                          <button onClick={() => updateStatus(b.id, "completed")} className="p-1.5 rounded hover:bg-success/10 text-success text-xs font-medium flex items-center gap-1"><CheckCircle size={13} /> Confirmar</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
