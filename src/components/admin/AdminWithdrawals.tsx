import { useAdminWithdrawals } from "@/hooks/useAdminData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

export function AdminWithdrawals() {
  const { user } = useAuth();
  const { data: withdrawals = [] } = useAdminWithdrawals();
  const queryClient = useQueryClient();

  const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("withdrawals").update({ status }).eq("id", id);
    await supabase.from("admin_audit_log").insert({
      admin_id: user!.id, action: `withdrawal_${status}`, target_type: "withdrawal", target_id: id,
    });
    queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
    queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    toast.success(status === "completed" ? "Saque aprovado" : "Saque rejeitado");
  };

  const statusStyles: Record<string, string> = {
    pending: "bg-warning/10 text-warning",
    completed: "bg-success/10 text-success",
    rejected: "bg-destructive/10 text-destructive",
  };
  const statusLabels: Record<string, string> = { pending: "Pendente", completed: "Concluído", rejected: "Rejeitado" };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading font-semibold text-foreground">Gestão de Saques</h3>
        <p className="text-xs text-muted-foreground">Aprove ou rejeite solicitações de saque</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-4 py-3 font-medium">DATA</th>
                <th className="text-right px-4 py-3 font-medium">VALOR</th>
                <th className="text-left px-4 py-3 font-medium">DESTINATÁRIO</th>
                <th className="text-right px-4 py-3 font-medium">TAXA</th>
                <th className="text-left px-4 py-3 font-medium">STATUS</th>
                <th className="text-center px-4 py-3 font-medium">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">Nenhum saque solicitado</td></tr>
              ) : withdrawals.map((w: any) => (
                <tr key={w.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-4 py-3 text-foreground text-xs">{new Date(w.created_at).toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3 text-right text-foreground font-medium">{fmt(Number(w.amount))}</td>
                  <td className="px-4 py-3 text-foreground">{w.recipient || "—"}</td>
                  <td className="px-4 py-3 text-right text-foreground">{fmt(Number(w.fee))}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusStyles[w.status]}`}>{statusLabels[w.status]}</span></td>
                  <td className="px-4 py-3">
                    {w.status === "pending" && (
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => updateStatus(w.id, "completed")} className="p-1.5 rounded hover:bg-success/10 text-success"><CheckCircle size={15} /></button>
                        <button onClick={() => updateStatus(w.id, "rejected")} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><XCircle size={15} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden">
          {withdrawals.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground text-sm">Nenhum saque</p>
          ) : withdrawals.map((w: any) => (
            <div key={w.id} className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-foreground">{fmt(Number(w.amount))}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[w.status]}`}>{statusLabels[w.status]}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{w.recipient || "—"} · Taxa: {fmt(Number(w.fee))}</span>
                {w.status === "pending" && (
                  <div className="flex gap-1">
                    <button onClick={() => updateStatus(w.id, "completed")} className="p-1 text-success"><CheckCircle size={14} /></button>
                    <button onClick={() => updateStatus(w.id, "rejected")} className="p-1 text-destructive"><XCircle size={14} /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
