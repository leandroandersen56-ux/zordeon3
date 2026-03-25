import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminStats } from "@/hooks/useAdminData";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminTransactions } from "@/components/admin/AdminTransactions";
import { AdminFees } from "@/components/admin/AdminFees";
import { AdminWithdrawals } from "@/components/admin/AdminWithdrawals";
import { AdminAuditLog } from "@/components/admin/AdminAuditLog";
import { AdminProviders } from "@/components/admin/AdminProviders";
import { AdminMerchants } from "@/components/admin/AdminMerchants";
import { AdminRisk } from "@/components/admin/AdminRisk";
import { AdminSettlements } from "@/components/admin/AdminSettlements";
import { AdminDisputes } from "@/components/admin/AdminDisputes";
import { AdminSystemConfig } from "@/components/admin/AdminSystemConfig";
import {
  LayoutDashboard, Users, ShoppingCart, Percent, Wallet, ScrollText,
  Shield, Server, Store, AlertTriangle, Landmark, Gavel, Settings
} from "lucide-react";

const tabs = [
  { key: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { key: "providers", label: "Provedores", icon: Server },
  { key: "merchants", label: "Merchants", icon: Store },
  { key: "transactions", label: "Transações", icon: ShoppingCart },
  { key: "risk", label: "Risco", icon: AlertTriangle },
  { key: "disputes", label: "Disputas", icon: Gavel },
  { key: "settlements", label: "Liquidações", icon: Landmark },
  { key: "withdrawals", label: "Saques", icon: Wallet },
  { key: "users", label: "Usuários", icon: Users },
  { key: "fees", label: "Taxas", icon: Percent },
  { key: "system", label: "Sistema", icon: Settings },
  { key: "audit", label: "Auditoria", icon: ScrollText },
];

export default function Admin() {
  const { isAdmin, loading } = useAuth();
  const { data: stats } = useAdminStats();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <Shield size={22} className="text-primary" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">Painel Administrativo</h1>
          <p className="text-sm text-muted-foreground">Gateway de Pagamentos · Gestão completa do ecossistema</p>
        </div>
      </div>

      {/* Desktop tabs */}
      <div className="hidden lg:flex border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
              activeTab === tab.key
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mobile/Tablet tabs */}
      <div className="flex lg:hidden gap-1.5 overflow-x-auto pb-1 -mx-4 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "overview" && <AdminOverview stats={stats} />}
      {activeTab === "providers" && <AdminProviders />}
      {activeTab === "merchants" && <AdminMerchants />}
      {activeTab === "transactions" && <AdminTransactions />}
      {activeTab === "risk" && <AdminRisk />}
      {activeTab === "disputes" && <AdminDisputes />}
      {activeTab === "settlements" && <AdminSettlements />}
      {activeTab === "withdrawals" && <AdminWithdrawals />}
      {activeTab === "users" && <AdminUsers />}
      {activeTab === "fees" && <AdminFees />}
      {activeTab === "system" && <AdminSystemConfig />}
      {activeTab === "audit" && <AdminAuditLog />}
    </div>
  );
}
