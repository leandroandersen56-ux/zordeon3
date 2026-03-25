import { useAdminAuditLog } from "@/hooks/useAdminData";
import { Clock } from "lucide-react";

export function AdminAuditLog() {
  const { data: logs = [] } = useAdminAuditLog();

  const actionLabels: Record<string, string> = {
    kyc_approved: "KYC aprovado",
    kyc_rejected: "KYC rejeitado",
    block_user: "Usuário bloqueado",
    unblock_user: "Usuário desbloqueado",
    grant_admin: "Admin concedido",
    remove_admin: "Admin removido",
    refund_transaction: "Transação estornada",
    approve_transaction: "Transação aprovada",
    update_fee: "Taxa atualizada",
    withdrawal_completed: "Saque aprovado",
    withdrawal_rejected: "Saque rejeitado",
  };

  const actionColors: Record<string, string> = {
    kyc_approved: "text-success",
    kyc_rejected: "text-destructive",
    block_user: "text-destructive",
    unblock_user: "text-success",
    grant_admin: "text-primary",
    remove_admin: "text-warning",
    refund_transaction: "text-destructive",
    approve_transaction: "text-success",
    update_fee: "text-primary",
    withdrawal_completed: "text-success",
    withdrawal_rejected: "text-destructive",
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading font-semibold text-foreground">Log de Auditoria</h3>
        <p className="text-xs text-muted-foreground">Histórico de ações administrativas</p>
      </div>

      <div className="glass-card">
        {logs.length === 0 ? (
          <div className="p-12 text-center">
            <Clock size={32} className="mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground text-sm">Nenhuma ação registrada</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {logs.map((log: any) => (
              <div key={log.id} className="px-4 py-3 flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full shrink-0 ${actionColors[log.action]?.replace("text-", "bg-") || "bg-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${actionColors[log.action] || "text-foreground"}`}>
                    {actionLabels[log.action] || log.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {log.target_type} · {log.target_id?.slice(0, 8)}...
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(log.created_at).toLocaleString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
