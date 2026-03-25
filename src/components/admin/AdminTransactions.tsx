import { useAdminTransactions } from "@/hooks/useAdminData";
import { Search, Eye, RefreshCw } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function AdminTransactions() {
  const { user } = useAuth();
  const { data: transactions = [] } = useAdminTransactions();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");

  const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;
  const methodLabels: Record<string, string> = { pix: "PIX", credit_card: "Cartão", boleto: "Boleto" };
  const statusLabels: Record<string, string> = { approved: "Aprovado", pending: "Pendente", cancelled: "Cancelado", expired: "Expirado", refunded: "Estornado" };
  const statusStyles: Record<string, string> = {
    approved: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    cancelled: "bg-destructive/10 text-destructive",
    expired: "bg-muted text-muted-foreground",
    refunded: "bg-violet-500/10 text-violet-400",
  };

  const refundTransaction = async (txId: string) => {
    await supabase.from("transactions").update({ status: "refunded" }).eq("id", txId);
    await supabase.from("admin_audit_log").insert({
      admin_id: user!.id, action: "refund_transaction", target_type: "transaction", target_id: txId,
    });
    queryClient.invalidateQueries({ queryKey: ["admin-all-transactions"] });
    queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    toast.success("Transação estornada");
  };

  const approveTransaction = async (txId: string) => {
    await supabase.from("transactions").update({ status: "approved" }).eq("id", txId);
    await supabase.from("admin_audit_log").insert({
      admin_id: user!.id, action: "approve_transaction", target_type: "transaction", target_id: txId,
    });
    queryClient.invalidateQueries({ queryKey: ["admin-all-transactions"] });
    queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    toast.success("Transação aprovada");
  };

  const filtered = transactions.filter((t: any) => {
    const matchSearch = t.customers?.name?.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search);
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    const matchMethod = filterMethod === "all" || t.method === filterMethod;
    return matchSearch && matchStatus && matchMethod;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por cliente ou ID..." className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "approved", "pending", "refunded", "cancelled"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterStatus === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {s === "all" ? "Todos" : statusLabels[s] || s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {["all", "pix", "credit_card", "boleto"].map((m) => (
            <button key={m} onClick={() => setFilterMethod(m)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterMethod === m ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {m === "all" ? "Todos" : methodLabels[m] || m}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} transação(ões)</p>

      <div className="glass-card overflow-hidden">
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-4 py-3 font-medium">DATA</th>
                <th className="text-left px-4 py-3 font-medium">CLIENTE</th>
                <th className="text-left px-4 py-3 font-medium">MÉTODO</th>
                <th className="text-right px-4 py-3 font-medium">VALOR</th>
                <th className="text-left px-4 py-3 font-medium">STATUS</th>
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-center px-4 py-3 font-medium">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">Nenhuma transação encontrada</td></tr>
              ) : filtered.map((t: any) => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground text-xs">{new Date(t.created_at).toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3 text-foreground">{t.customers?.name || "—"}</td>
                  <td className="px-4 py-3 text-foreground">{methodLabels[t.method] || t.method}</td>
                  <td className="px-4 py-3 text-right text-foreground font-medium">{fmt(Number(t.amount))}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusStyles[t.status] || "bg-muted text-muted-foreground"}`}>{statusLabels[t.status] || t.status}</span></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{t.id.slice(0, 8)}...</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {t.status === "pending" && (
                        <button onClick={() => approveTransaction(t.id)} title="Aprovar" className="p-1.5 rounded hover:bg-success/10 text-success transition-colors text-xs font-medium">Aprovar</button>
                      )}
                      {t.status === "approved" && (
                        <button onClick={() => refundTransaction(t.id)} title="Estornar" className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors flex items-center gap-1 text-xs">
                          <RefreshCw size={13} /> Estornar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground text-sm">Nenhuma transação</p>
          ) : filtered.map((t: any) => (
            <div key={t.id} className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-foreground text-sm">{t.customers?.name || "—"}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[t.status]}`}>{statusLabels[t.status]}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{new Date(t.created_at).toLocaleString("pt-BR")}</span>
                <span className="font-medium text-foreground">{fmt(Number(t.amount))} · {methodLabels[t.method]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
