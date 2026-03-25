import { TrendingUp, TrendingDown, Users, ShoppingCart, Wallet, Activity, AlertTriangle, CheckCircle, Clock, Ban } from "lucide-react";

interface AdminOverviewProps {
  stats: any;
}

export function AdminOverview({ stats }: AdminOverviewProps) {
  const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

  const mainKpis = [
    { label: "VOLUME TOTAL", value: fmt(stats?.totalRevenue || 0), icon: Wallet, color: "text-primary", bg: "bg-primary/10", sub: `Hoje: ${fmt(stats?.todayRevenue || 0)}` },
    { label: "TRANSAÇÕES", value: String(stats?.totalTransactions || 0), icon: ShoppingCart, color: "text-violet-400", bg: "bg-violet-500/10", sub: `Hoje: ${stats?.todayTransactions || 0}` },
    { label: "TAXA CONVERSÃO", value: `${stats?.conversionRate || 0}%`, icon: TrendingUp, color: "text-success", bg: "bg-success/10", sub: `${stats?.approvedTransactions || 0} aprovadas` },
    { label: "USUÁRIOS", value: String(stats?.totalUsers || 0), icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10", sub: `${stats?.activeUsers || 0} ativos` },
  ];

  const secondaryKpis = [
    { label: "Pendentes", value: fmt(stats?.pendingRevenue || 0), count: stats?.pendingTransactions || 0, icon: Clock, color: "text-warning" },
    { label: "Estornos", value: fmt(stats?.refundedTotal || 0), count: stats?.refundedTransactions || 0, icon: TrendingDown, color: "text-destructive" },
    { label: "KYC Pendente", value: String(stats?.pendingKyc || 0), count: null, icon: AlertTriangle, color: "text-warning" },
    { label: "Bloqueados", value: String(stats?.blockedUsers || 0), count: null, icon: Ban, color: "text-destructive" },
    { label: "Saques Pendentes", value: fmt(stats?.pendingWithdrawalAmount || 0), count: stats?.pendingWithdrawals || 0, icon: Wallet, color: "text-warning" },
    { label: "KYC Aprovado", value: String(stats?.approvedKyc || 0), count: null, icon: CheckCircle, color: "text-success" },
  ];

  const grandTotal = (stats?.pixVolume || 0) + (stats?.cardVolume || 0) + (stats?.boletoVolume || 0) || 1;
  const methods = [
    { label: "PIX", value: stats?.pixVolume || 0, pct: Math.round(((stats?.pixVolume || 0) / grandTotal) * 100), color: "bg-primary" },
    { label: "Cartão", value: stats?.cardVolume || 0, pct: Math.round(((stats?.cardVolume || 0) / grandTotal) * 100), color: "bg-violet-500" },
    { label: "Boleto", value: stats?.boletoVolume || 0, pct: Math.round(((stats?.boletoVolume || 0) / grandTotal) * 100), color: "bg-cyan-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Main KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainKpis.map((k) => (
          <div key={k.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{k.label}</span>
              <div className={`p-2 rounded-lg ${k.bg}`}>
                <k.icon size={18} className={k.color} />
              </div>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {secondaryKpis.map((k) => (
          <div key={k.label} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <k.icon size={14} className={k.color} />
              <span className="text-xs text-muted-foreground">{k.label}</span>
            </div>
            <p className="text-lg font-heading font-bold text-foreground">{k.value}</p>
            {k.count !== null && <p className="text-xs text-muted-foreground">{k.count} transações</p>}
          </div>
        ))}
      </div>

      {/* Volume by Method */}
      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-foreground mb-4">Volume por Método de Pagamento</h3>
        <div className="space-y-4">
          {methods.map((m) => (
            <div key={m.label} className="flex items-center gap-4">
              <span className="text-sm text-foreground w-16">{m.label}</span>
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${m.color} transition-all`} style={{ width: `${m.pct}%` }} />
              </div>
              <span className="text-sm font-medium text-foreground w-28 text-right">{fmt(m.value)}</span>
              <span className="text-xs text-muted-foreground w-12 text-right">{m.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
