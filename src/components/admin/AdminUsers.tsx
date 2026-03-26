import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminUsers } from "@/hooks/useAdminData";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, Shield, ShieldOff, CheckCircle, XCircle, Ban, UserCheck, Eye, MoreVertical } from "lucide-react";
import { useState } from "react";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import { useNavigate } from "react-router-dom";

export function AdminUsers() {
  const { user } = useAuth();
  const { data: users = [], isLoading } = useAdminUsers();
  const queryClient = useQueryClient();
  const { startImpersonation } = useImpersonation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const viewAsUser = (userId: string) => {
    startImpersonation(userId);
    navigate("/dashboard");
    toast.success("Visualizando como usuário");
  };

  const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

  const logAction = async (action: string, targetType: string, targetId: string, details: any = {}) => {
    await supabase.from("admin_audit_log").insert({
      admin_id: user!.id, action, target_type: targetType, target_id: targetId, details,
    });
  };

  const updateKyc = async (userId: string, status: string) => {
    const updates: any = { kyc_status: status };
    if (status === "approved") updates.approved_at = new Date().toISOString();
    await supabase.from("profiles").update(updates).eq("id", userId);
    await logAction(`kyc_${status}`, "user", userId);
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    toast.success(`KYC ${status === "approved" ? "aprovado" : status === "rejected" ? "rejeitado" : "atualizado"}`);
  };

  const toggleBlock = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "blocked" ? "active" : "blocked";
    const updates: any = { account_status: newStatus };
    if (newStatus === "blocked") updates.blocked_at = new Date().toISOString();
    await supabase.from("profiles").update(updates).eq("id", userId);
    await logAction(newStatus === "blocked" ? "block_user" : "unblock_user", "user", userId);
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    toast.success(newStatus === "blocked" ? "Usuário bloqueado" : "Usuário desbloqueado");
  };

  const toggleAdmin = async (userId: string, isCurrentlyAdmin: boolean) => {
    if (isCurrentlyAdmin) {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      await logAction("remove_admin", "user", userId);
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role: "admin" as any });
      await logAction("grant_admin", "user", userId);
    }
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    toast.success(isCurrentlyAdmin ? "Admin removido" : "Admin concedido");
  };

  const filtered = users.filter((u: any) => {
    const matchSearch = u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all"
      || (filterStatus === "active" && u.account_status === "active")
      || (filterStatus === "blocked" && u.account_status === "blocked")
      || (filterStatus === "kyc_pending" && u.kyc_status === "pending")
      || (filterStatus === "kyc_approved" && u.kyc_status === "approved");
    return matchSearch && matchStatus;
  });

  const kycBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-warning/10 text-warning",
      approved: "bg-success/10 text-success",
      rejected: "bg-destructive/10 text-destructive",
    };
    const labels: Record<string, string> = { pending: "Pendente", approved: "Aprovado", rejected: "Rejeitado" };
    return <span className={`text-xs px-2 py-1 rounded-full ${styles[status] || "bg-muted text-muted-foreground"}`}>{labels[status] || status}</span>;
  };

  const statusBadge = (status: string) => {
    return status === "blocked"
      ? <span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">Bloqueado</span>
      : <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success">Ativo</span>;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou email..." className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "Todos" },
            { key: "active", label: "Ativos" },
            { key: "blocked", label: "Bloqueados" },
            { key: "kyc_pending", label: "KYC Pendente" },
            { key: "kyc_approved", label: "KYC Aprovado" },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilterStatus(f.key)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterStatus === f.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} usuário(s) encontrado(s)</p>

      {/* Users table */}
      <div className="glass-card overflow-hidden">
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-4 py-3 font-medium">USUÁRIO</th>
                <th className="text-left px-4 py-3 font-medium">STATUS</th>
                <th className="text-left px-4 py-3 font-medium">KYC</th>
                <th className="text-left px-4 py-3 font-medium">ROLE</th>
                <th className="text-right px-4 py-3 font-medium">VOLUME</th>
                <th className="text-right px-4 py-3 font-medium">TXS</th>
                <th className="text-left px-4 py-3 font-medium">CRIADO EM</th>
                <th className="text-center px-4 py-3 font-medium">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u: any) => {
                const isAdmin = u.roles?.includes("admin");
                const isSelf = u.id === user?.id;
                return (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-foreground font-medium">{u.full_name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">{statusBadge(u.account_status)}</td>
                    <td className="px-4 py-3">{kycBadge(u.kyc_status)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${isAdmin ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {isAdmin ? "Admin" : "Usuário"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-foreground font-medium">{fmt(u.volume)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{u.transactionCount}</td>
                    <td className="px-4 py-3 text-foreground text-xs">{new Date(u.created_at).toLocaleDateString("pt-BR")}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {u.kyc_status === "pending" && (
                          <>
                            <button onClick={() => updateKyc(u.id, "approved")} title="Aprovar KYC" className="p-1.5 rounded hover:bg-success/10 text-success transition-colors"><CheckCircle size={15} /></button>
                            <button onClick={() => updateKyc(u.id, "rejected")} title="Rejeitar KYC" className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"><XCircle size={15} /></button>
                          </>
                        )}
                        {!isSelf && (
                          <>
                            <button onClick={() => viewAsUser(u.id)} title="Ver como usuário" className="p-1.5 rounded hover:bg-primary/10 text-primary transition-colors"><Eye size={15} /></button>
                            <button onClick={() => toggleBlock(u.id, u.account_status)} title={u.account_status === "blocked" ? "Desbloquear" : "Bloquear"} className={`p-1.5 rounded transition-colors ${u.account_status === "blocked" ? "hover:bg-success/10 text-success" : "hover:bg-destructive/10 text-destructive"}`}>
                              {u.account_status === "blocked" ? <UserCheck size={15} /> : <Ban size={15} />}
                            </button>
                            <button onClick={() => toggleAdmin(u.id, isAdmin)} title={isAdmin ? "Remover Admin" : "Tornar Admin"} className={`p-1.5 rounded transition-colors ${isAdmin ? "hover:bg-warning/10 text-warning" : "hover:bg-primary/10 text-primary"}`}>
                              {isAdmin ? <ShieldOff size={15} /> : <Shield size={15} />}
                            </button>
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

        {/* Mobile cards */}
        <div className="sm:hidden">
          {filtered.map((u: any) => {
            const isAdmin = u.roles?.includes("admin");
            const isSelf = u.id === user?.id;
            return (
              <div key={u.id} className="p-4 border-b border-border/50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{u.full_name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="flex gap-1">
                    {statusBadge(u.account_status)}
                    {kycBadge(u.kyc_status)}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Volume: {fmt(u.volume)} · {u.transactionCount} txs</span>
                  <div className="flex gap-1">
                    {u.kyc_status === "pending" && (
                      <button onClick={() => updateKyc(u.id, "approved")} className="p-1 text-success"><CheckCircle size={14} /></button>
                    )}
                    {!isSelf && (
                      <button onClick={() => toggleBlock(u.id, u.account_status)} className={u.account_status === "blocked" ? "p-1 text-success" : "p-1 text-destructive"}>
                        {u.account_status === "blocked" ? <UserCheck size={14} /> : <Ban size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
