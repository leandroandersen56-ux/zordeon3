import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [profilesRes, txRes, customersRes, linksRes, withdrawalsRes] = await Promise.all([
        supabase.from("profiles").select("id, account_status, kyc_status, created_at", { count: "exact" }),
        supabase.from("transactions").select("id, amount, status, method, created_at"),
        supabase.from("customers").select("id", { count: "exact", head: true }),
        supabase.from("payment_links").select("id", { count: "exact", head: true }),
        supabase.from("withdrawals").select("id, amount, status"),
      ]);

      const profiles = profilesRes.data || [];
      const txs = txRes.data || [];

      const approved = txs.filter((t: any) => t.status === "approved");
      const pending = txs.filter((t: any) => t.status === "pending");
      const refunded = txs.filter((t: any) => t.status === "refunded");

      const totalRevenue = approved.reduce((s: number, t: any) => s + Number(t.amount), 0);
      const pendingRevenue = pending.reduce((s: number, t: any) => s + Number(t.amount), 0);
      const refundedTotal = refunded.reduce((s: number, t: any) => s + Number(t.amount), 0);

      const pixVolume = txs.filter((t: any) => t.method === "pix").reduce((s: number, t: any) => s + Number(t.amount), 0);
      const cardVolume = txs.filter((t: any) => t.method === "credit_card").reduce((s: number, t: any) => s + Number(t.amount), 0);
      const boletoVolume = txs.filter((t: any) => t.method === "boleto").reduce((s: number, t: any) => s + Number(t.amount), 0);

      const activeUsers = profiles.filter((p: any) => p.account_status === "active").length;
      const blockedUsers = profiles.filter((p: any) => p.account_status === "blocked").length;
      const pendingKyc = profiles.filter((p: any) => p.kyc_status === "pending").length;
      const approvedKyc = profiles.filter((p: any) => p.kyc_status === "approved").length;

      const withdrawals = withdrawalsRes.data || [];
      const pendingWithdrawals = withdrawals.filter((w: any) => w.status === "pending");
      const pendingWithdrawalAmount = pendingWithdrawals.reduce((s: number, w: any) => s + Number(w.amount), 0);

      // Today's transactions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTxs = txs.filter((t: any) => new Date(t.created_at) >= today);
      const todayRevenue = todayTxs.filter((t: any) => t.status === "approved").reduce((s: number, t: any) => s + Number(t.amount), 0);

      const conversionRate = txs.length > 0 ? Math.round((approved.length / txs.length) * 100) : 0;

      return {
        totalUsers: profiles.length,
        activeUsers,
        blockedUsers,
        pendingKyc,
        approvedKyc,
        totalTransactions: txs.length,
        approvedTransactions: approved.length,
        pendingTransactions: pending.length,
        refundedTransactions: refunded.length,
        totalRevenue,
        pendingRevenue,
        refundedTotal,
        todayRevenue,
        todayTransactions: todayTxs.length,
        conversionRate,
        totalCustomers: customersRes.count || 0,
        totalLinks: linksRes.count || 0,
        pixVolume,
        cardVolume,
        boletoVolume,
        pendingWithdrawals: pendingWithdrawals.length,
        pendingWithdrawalAmount,
      };
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      const { data: txCounts } = await supabase.from("transactions").select("user_id, amount, status");

      return (profiles || []).map((p: any) => {
        const userRoles = (roles || []).filter((r: any) => r.user_id === p.id);
        const userTxs = (txCounts || []).filter((t: any) => t.user_id === p.id);
        const volume = userTxs.filter((t: any) => t.status === "approved").reduce((s: number, t: any) => s + Number(t.amount), 0);
        return {
          ...p,
          roles: userRoles.map((r: any) => r.role),
          transactionCount: userTxs.length,
          volume,
        };
      });
    },
  });
}

export function useAdminTransactions() {
  return useQuery({
    queryKey: ["admin-all-transactions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*, customers(name)")
        .order("created_at", { ascending: false })
        .limit(100);
      return data || [];
    },
  });
}

export function useAdminFees() {
  return useQuery({
    queryKey: ["admin-fees"],
    queryFn: async () => {
      const { data } = await supabase.from("fee_config").select("*").order("method");
      return data || [];
    },
  });
}

export function useAdminAuditLog() {
  return useQuery({
    queryKey: ["admin-audit-log"],
    queryFn: async () => {
      const { data } = await supabase
        .from("admin_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      return data || [];
    },
  });
}

export function useAdminWithdrawals() {
  return useQuery({
    queryKey: ["admin-withdrawals"],
    queryFn: async () => {
      const { data } = await supabase
        .from("withdrawals")
        .select("*")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });
}
