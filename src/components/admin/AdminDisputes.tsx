import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertTriangle, Plus, Save, X, CheckCircle, XCircle, Clock,
  FileText, CreditCard, Search, Eye
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
  open: { label: "Aberto", color: "bg-warning/10 text-warning" },
  under_review: { label: "Em Análise", color: "bg-primary/10 text-primary" },
  won: { label: "Ganho", color: "bg-success/10 text-success" },
  lost: { label: "Perdido", color: "bg-destructive/10 text-destructive" },
  accepted: { label: "Aceito", color: "bg-muted text-muted-foreground" },
  expired: { label: "Expirado", color: "bg-muted text-muted-foreground" },
};

const typeLabels: Record<string, string> = {
  chargeback: "Chargeback",
  inquiry: "Inquérito",
  retrieval: "Retrieval",
  pre_arbitration: "Pré-Arbitração",
};

export function AdminDisputes() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: disputes = [] } = useQuery({
    queryKey: ["admin-disputes"],
    queryFn: async () => { const { data } = await supabase.from("disputes").select("*").order("created_at", { ascending: false }); return data || []; },
  });

  const fmt = (v: number) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  const updateDisputeStatus = async (id: string, status: string) => {
    const updates: any = { status, updated_at: new Date().toISOString() };
    if (["won", "lost", "accepted"].includes(status)) {
      updates.resolved_at = new Date().toISOString();
      updates.resolved_by = user!.id;
    }
    await supabase.from("disputes").update(updates).eq("id", id);
    await supabase.from("admin_audit_log").insert({ admin_id: user!.id, action: `dispute_${status}`, target_type: "dispute", target_id: id });
    qc.invalidateQueries({ queryKey: ["admin-disputes"] });
    toast.success("Disputa atualizada");
  };

  const filtered = disputes.filter((d: any) => {
    const matchStatus = filterStatus === "all" || d.status === filterStatus;
    const matchSearch = !search || d.id.includes(search) || d.reason_description?.toLowerCase().includes(search.toLowerCase()) || d.acquirer_reference?.includes(search);
    return matchStatus && matchSearch;
  });

  const openCount = disputes.filter((d: any) => d.status === "open").length;
  const reviewCount = disputes.filter((d: any) => d.status === "under_review").length;
  const totalAmount = disputes.filter((d: any) => ["open", "under_review"].includes(d.status)).reduce((s: number, d: any) => s + Number(d.amount), 0);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-heading font-semibold text-foreground text-lg">Disputas & Chargebacks</h3>
        <p className="text-xs text-muted-foreground">Gerencie chargebacks, inquéritos e pré-arbitrações das bandeiras</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-4"><div className="flex items-center gap-2 mb-1"><AlertTriangle size={14} className="text-warning" /><span className="text-xs text-muted-foreground">Abertas</span></div><p className="text-lg font-heading font-bold text-foreground">{openCount}</p></div>
        <div className="glass-card p-4"><div className="flex items-center gap-2 mb-1"><Eye size={14} className="text-primary" /><span className="text-xs text-muted-foreground">Em Análise</span></div><p className="text-lg font-heading font-bold text-foreground">{reviewCount}</p></div>
        <div className="glass-card p-4"><div className="flex items-center gap-2 mb-1"><CreditCard size={14} className="text-destructive" /><span className="text-xs text-muted-foreground">Valor em Risco</span></div><p className="text-lg font-heading font-bold text-foreground">{fmt(totalAmount)}</p></div>
        <div className="glass-card p-4"><div className="flex items-center gap-2 mb-1"><FileText size={14} className="text-muted-foreground" /><span className="text-xs text-muted-foreground">Total Disputas</span></div><p className="text-lg font-heading font-bold text-foreground">{disputes.length}</p></div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por ID, referência ou descrição..." className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "open", "under_review", "won", "lost", "accepted"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterStatus === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {s === "all" ? "Todos" : statusConfig[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left px-4 py-3 font-medium">DATA</th>
              <th className="text-left px-4 py-3 font-medium">TIPO</th>
              <th className="text-left px-4 py-3 font-medium">BANDEIRA</th>
              <th className="text-right px-4 py-3 font-medium">VALOR</th>
              <th className="text-left px-4 py-3 font-medium">MOTIVO</th>
              <th className="text-left px-4 py-3 font-medium">STATUS</th>
              <th className="text-left px-4 py-3 font-medium">EVIDÊNCIA</th>
              <th className="text-center px-4 py-3 font-medium">AÇÕES</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-muted-foreground">Nenhuma disputa encontrada</td></tr>
              ) : filtered.map((d: any) => {
                const st = statusConfig[d.status] || statusConfig.open;
                return (
                  <tr key={d.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="px-4 py-3 text-foreground text-xs">{new Date(d.created_at).toLocaleDateString("pt-BR")}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-muted text-foreground">{typeLabels[d.type] || d.type}</span></td>
                    <td className="px-4 py-3 text-foreground text-xs uppercase">{d.card_brand || "—"}</td>
                    <td className="px-4 py-3 text-right text-foreground font-medium">{fmt(d.amount)}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate">{d.reason_description || d.reason_code || "—"}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${st.color}`}>{st.label}</span></td>
                    <td className="px-4 py-3">
                      {d.evidence_submitted
                        ? <span className="text-xs text-success">Enviada</span>
                        : d.evidence_due_date
                          ? <span className="text-xs text-warning">Até {new Date(d.evidence_due_date).toLocaleDateString("pt-BR")}</span>
                          : <span className="text-xs text-muted-foreground">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {d.status === "open" && (
                          <button onClick={() => updateDisputeStatus(d.id, "under_review")} className="p-1.5 rounded hover:bg-primary/10 text-primary text-xs font-medium">Analisar</button>
                        )}
                        {d.status === "under_review" && (
                          <>
                            <button onClick={() => updateDisputeStatus(d.id, "won")} className="p-1.5 rounded hover:bg-success/10 text-success text-xs">Ganho</button>
                            <button onClick={() => updateDisputeStatus(d.id, "lost")} className="p-1.5 rounded hover:bg-destructive/10 text-destructive text-xs">Perdido</button>
                            <button onClick={() => updateDisputeStatus(d.id, "accepted")} className="p-1.5 rounded hover:bg-muted text-muted-foreground text-xs">Aceitar</button>
                          </>
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
