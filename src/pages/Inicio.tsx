import { useState } from "react";
import { ShoppingCart, Target, ThumbsUp, CalendarDays, CreditCard, QrCode, FileText, BarChart3, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { KpiCard } from "@/components/KpiCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// Demo data for visual preview
const DEMO_TRANSACTIONS = [
  { id: "1", amount: 350, status: "approved", method: "pix", created_at: "2026-03-17T10:00:00Z" },
  { id: "2", amount: 120, status: "approved", method: "pix", created_at: "2026-03-16T14:30:00Z" },
  { id: "3", amount: 890, status: "approved", method: "credit_card", created_at: "2026-03-15T09:00:00Z" },
  { id: "4", amount: 45, status: "pending", method: "pix", created_at: "2026-03-15T11:00:00Z" },
  { id: "5", amount: 1200, status: "approved", method: "credit_card", created_at: "2026-03-14T16:00:00Z" },
  { id: "6", amount: 75, status: "approved", method: "boleto", created_at: "2026-03-13T08:00:00Z" },
  { id: "7", amount: 250, status: "approved", method: "pix", created_at: "2026-03-12T12:00:00Z" },
  { id: "8", amount: 680, status: "approved", method: "credit_card", created_at: "2026-03-11T15:00:00Z" },
  { id: "9", amount: 160, status: "refunded", method: "pix", created_at: "2026-03-10T10:00:00Z" },
  { id: "10", amount: 430, status: "approved", method: "pix", created_at: "2026-03-09T14:00:00Z" },
  { id: "11", amount: 95, status: "pending", method: "boleto", created_at: "2026-03-08T09:00:00Z" },
  { id: "12", amount: 1500, status: "approved", method: "credit_card", created_at: "2026-03-07T11:00:00Z" },
];

const DEMO_CHART = [
  { date: "01/03", pagos: 420, pendentes: 45, estornados: 0 },
  { date: "03/03", pagos: 680, pendentes: 30, estornados: 0 },
  { date: "05/03", pagos: 950, pendentes: 95, estornados: 0 },
  { date: "07/03", pagos: 1500, pendentes: 60, estornados: 0 },
  { date: "09/03", pagos: 1930, pendentes: 45, estornados: 160 },
  { date: "11/03", pagos: 1250, pendentes: 80, estornados: 0 },
  { date: "13/03", pagos: 825, pendentes: 35, estornados: 0 },
  { date: "15/03", pagos: 1010, pendentes: 45, estornados: 0 },
  { date: "17/03", pagos: 470, pendentes: 20, estornados: 0 },
];

export default function Inicio() {
  const { user, profile } = useAuth();

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  const { data: dbTransactions = [] } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  // Use demo data if no real transactions exist
  const allTransactions = dbTransactions.length > 0 ? dbTransactions : DEMO_TRANSACTIONS;
  const isDemo = dbTransactions.length === 0;

  // Filter by date range
  const transactions = allTransactions.filter((t: any) => {
    const date = new Date(t.created_at);
    const from = new Date(dateRange.from);
    from.setHours(0, 0, 0, 0);
    const to = new Date(dateRange.to);
    to.setHours(23, 59, 59, 999);
    return date >= from && date <= to;
  });

  const formatRange = () => `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`;

  const totalSales = transactions
    .filter((t: any) => t.status === "approved")
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

  const approvedCount = transactions.filter((t: any) => t.status === "approved").length;
  const totalCount = transactions.length;
  const approvalRate = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;
  const ticketMedio = approvedCount > 0 ? totalSales / approvedCount : 0;

  const pixTotal = transactions.filter((t: any) => t.method === "pix").reduce((s: number, t: any) => s + Number(t.amount), 0);
  const cardTotal = transactions.filter((t: any) => t.method === "credit_card").reduce((s: number, t: any) => s + Number(t.amount), 0);
  const boletoTotal = transactions.filter((t: any) => t.method === "boleto").reduce((s: number, t: any) => s + Number(t.amount), 0);
  const grandTotal = pixTotal + cardTotal + boletoTotal || 1;

  const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

  const chartData = isDemo ? DEMO_CHART : [
    { date: "Seg", pagos: 0 }, { date: "Ter", pagos: 0 },
    { date: "Qua", pagos: 0 }, { date: "Qui", pagos: 0 }, { date: "Sex", pagos: 0 },
  ];

  const paymentMethods = [
    { name: "PIX", icon: QrCode, color: "bg-primary", value: fmt(pixTotal), pct: Math.round((pixTotal / grandTotal) * 100) },
    { name: "Cartão de Crédito", icon: CreditCard, color: "bg-violet-500", value: fmt(cardTotal), pct: Math.round((cardTotal / grandTotal) * 100) },
    { name: "Boleto Bancário", icon: FileText, color: "bg-cyan-500", value: fmt(boletoTotal), pct: Math.round((boletoTotal / grandTotal) * 100) },
  ];

  const refundedTotal = transactions.filter((t: any) => t.status === "refunded").reduce((s: number, t: any) => s + Number(t.amount), 0);

  const indices = [
    { label: "Cartão", pct: Math.round((cardTotal / grandTotal) * 100), value: fmt(cardTotal) },
    { label: "PIX", pct: Math.round((pixTotal / grandTotal) * 100), value: fmt(pixTotal) },
    { label: "Boleto", pct: Math.round((boletoTotal / grandTotal) * 100), value: fmt(boletoTotal) },
    { label: "Estornos", pct: Math.round((refundedTotal / grandTotal) * 100), value: fmt(refundedTotal) },
    { label: "Chargeback", pct: 0, value: "R$ 0,00" },
  ];

  const firstName = profile?.full_name?.split(" ")[0] || "Usuário";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">
          Bem-vindo, <span className="text-primary">{firstName}</span>
        </h1>
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full sm:w-auto px-5 py-3 rounded-lg border border-primary/40 text-sm text-primary hover:bg-primary/10 transition-colors flex items-center gap-2 justify-center min-h-[48px] sm:min-h-0">
              <CalendarIcon className="w-4 h-4" />
              {formatRange()}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                <button onClick={() => setDateRange({ from: new Date(new Date().setDate(new Date().getDate() - 7)), to: new Date() })} className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted transition-colors text-foreground">7 dias</button>
                <button onClick={() => setDateRange({ from: new Date(new Date().setDate(new Date().getDate() - 15)), to: new Date() })} className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted transition-colors text-foreground">15 dias</button>
                <button onClick={() => setDateRange({ from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), to: new Date() })} className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted transition-colors text-foreground">Este mês</button>
                <button onClick={() => setDateRange({ from: new Date(new Date().setDate(new Date().getDate() - 30)), to: new Date() })} className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted transition-colors text-foreground">30 dias</button>
              </div>
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  if (range?.from) {
                    setDateRange({ from: range.from, to: range.to || range.from });
                  }
                }}
                numberOfMonths={2}
                locale={ptBR}
                className={cn("p-3 pointer-events-auto")}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {isDemo && (
        <div className="px-4 py-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-primary">
          <BarChart3 className="inline w-4 h-4 mr-1 -mt-0.5" /> Exibindo dados de demonstração. As transações reais aparecerão aqui automaticamente.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KpiCard title="Minhas Vendas" value={fmt(totalSales)} icon={<ShoppingCart size={22} />} />
        <KpiCard title="Ticket médio" value={fmt(ticketMedio)} icon={<Target size={22} />} />
        <KpiCard title="Taxa de Aprovação" value={`${approvalRate}%`} icon={<ThumbsUp size={22} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass-card p-5 md:p-6">
          <h2 className="font-heading font-semibold text-foreground text-base md:text-lg mb-5">Gráfico de receitas</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(338,95%,40%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(338,95%,40%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(45,93%,47%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(45,93%,47%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,16%)" />
              <XAxis dataKey="date" tick={{ fill: "hsl(0,0%,50%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(0,0%,50%)", fontSize: 11 }} width={35} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,20%)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="pagos" stroke="hsl(338,95%,40%)" fill="url(#gradPrimary)" strokeWidth={2} name="Pagos" />
              {isDemo && <Area type="monotone" dataKey="pendentes" stroke="hsl(45,93%,47%)" fill="url(#gradPending)" strokeWidth={1.5} name="Pendentes" />}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5 md:p-6">
          <h2 className="font-heading font-semibold text-foreground mb-5 text-base md:text-lg">Índices</h2>
          <div className="space-y-4">
            {indices.map((i) => (
              <div key={i.label} className="flex items-center gap-3">
                <div className="relative w-11 h-11 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-11 h-11 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(0,0%,16%)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(338,95%,40%)" strokeWidth="3"
                      strokeDasharray={`${i.pct * 0.94} 94`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-muted-foreground">{i.pct}%</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{i.label}</p>
                  <p className="text-xs text-muted-foreground">{i.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-heading font-semibold text-foreground mb-5 text-base md:text-lg">Métodos de Pagamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {paymentMethods.map((m) => {
            const pixTxCount = transactions.filter((t: any) => t.method === "pix").length;
            const cardTxCount = transactions.filter((t: any) => t.method === "credit_card").length;
            const boletoTxCount = transactions.filter((t: any) => t.method === "boleto").length;
            const txCount = m.name === "PIX" ? pixTxCount : m.name === "Cartão de Crédito" ? cardTxCount : boletoTxCount;
            const approvedTxCount = transactions.filter((t: any) => t.method === (m.name === "PIX" ? "pix" : m.name === "Cartão de Crédito" ? "credit_card" : "boleto") && t.status === "approved").length;

            return (
              <div key={m.name} className="glass-card p-5 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl ${m.color}/15`}>
                    <m.icon size={20} className={`${m.color === "bg-primary" ? "text-primary" : m.color === "bg-violet-500" ? "text-violet-400" : "text-cyan-400"}`} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-sm">{m.name}</h3>
                    <p className="text-foreground font-heading font-bold text-lg">{m.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${m.color === "bg-primary" ? "bg-primary" : m.color === "bg-violet-500" ? "bg-violet-500" : "bg-cyan-500"}`} style={{ width: `${m.pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{m.pct}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Transações</p>
                    <p className="text-primary font-bold">{txCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Aprovadas</p>
                    <p className="text-success font-bold">{approvedTxCount}</p>
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
