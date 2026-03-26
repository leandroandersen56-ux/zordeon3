import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Wallet, RefreshCw, Eye, Search, Filter, BarChart3, CalendarIcon, X, Copy, User, CreditCard, MapPin, FileText, Package, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/components/ui/popover";


export default function Vendas() {
  const { user } = useAuth();
  const { getEffectiveUserId } = useImpersonation();
  const effectiveUserId = getEffectiveUserId(user?.id);
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [selectedPreset, setSelectedPreset] = useState("30dias");
  const [presetOpen, setPresetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [selectedPaymentTx, setSelectedPaymentTx] = useState<any>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterMethod, setFilterMethod] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterClientName, setFilterClientName] = useState("");
  const [filterCpfCnpj, setFilterCpfCnpj] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterTransactionId, setFilterTransactionId] = useState("");

  const { data: dbTransactions = [] } = useQuery({
    queryKey: ["transactions-vendas", effectiveUserId],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*, customers(name)")
        .eq("user_id", effectiveUserId!)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!effectiveUserId,
  });

  // Auto-poll pending transactions on mount and every 30s
  useEffect(() => {
    if (!user) return;
    
    const checkPending = async () => {
      try {
        const hasPending = dbTransactions.some((t: any) => t.status === "pending");
        if (!hasPending) return;
        
        await supabase.functions.invoke("check-transactions");
        queryClient.invalidateQueries({ queryKey: ["transactions-vendas"] });
      } catch (e) {
        console.error("check-transactions error:", e);
      }
    };

    checkPending();
    const interval = setInterval(checkPending, 30000);
    return () => clearInterval(interval);
  }, [user, dbTransactions.length]);

  const allTransactions = dbTransactions;
  const isDemo = false;

  // Filter by date range
  const transactions = allTransactions.filter((t: any) => {
    const date = new Date(t.created_at);
    const from = new Date(dateRange.from);
    from.setHours(0, 0, 0, 0);
    const to = new Date(dateRange.to);
    to.setHours(23, 59, 59, 999);
    const inRange = date >= from && date <= to;

    const matchesSearch = !searchQuery.trim() ||
      (t.customers?.name || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMethod = !filterMethod || t.method === filterMethod;
    const matchesStatus = !filterStatus || t.status === filterStatus;
    const matchesClient = !filterClientName.trim() ||
      (t.customers?.name || "").toLowerCase().includes(filterClientName.toLowerCase());
    const matchesId = !filterTransactionId.trim() || t.id.includes(filterTransactionId.trim());

    return inRange && matchesSearch && matchesMethod && matchesStatus && matchesClient && matchesId;
  });

  const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;
  const approved = transactions.filter((t: any) => t.status === "approved").reduce((s: number, t: any) => s + Number(t.amount), 0);
  const abandoned = transactions.filter((t: any) => t.status === "expired" || t.status === "cancelled").reduce((s: number, t: any) => s + Number(t.amount), 0);
  const refunded = transactions.filter((t: any) => t.status === "refunded").reduce((s: number, t: any) => s + Number(t.amount), 0);
  const commission = approved * 0.9456;

  const methodMap: Record<string, string> = { pix: "PIX", credit_card: "Cartão", boleto: "Boleto" };
  const statusMap: Record<string, "approved" | "pending" | "cancelled"> = {
    approved: "approved", pending: "pending", cancelled: "cancelled", expired: "cancelled", refunded: "cancelled",
  };

  const formatRange = () => {
    return `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Minhas Vendas</h1>
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full sm:w-auto px-5 py-3 rounded-lg border border-primary/40 text-sm text-primary hover:bg-primary/10 transition-colors flex items-center gap-2 justify-center min-h-[48px] sm:min-h-0">
              <CalendarIcon className="w-4 h-4" />
              {formatRange()}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="p-4 space-y-3">
              {/* Preset dropdown */}
              <div className="relative">
                <button
                  onClick={() => setPresetOpen(!presetOpen)}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm text-foreground flex items-center justify-between hover:bg-muted transition-colors"
                >
                  <span>
                    {selectedPreset === "hoje" && "Hoje"}
                    {selectedPreset === "7dias" && "Últimos 7 dias"}
                    {selectedPreset === "15dias" && "Últimos 15 dias"}
                    {selectedPreset === "30dias" && "Últimos 30 dias"}
                    {selectedPreset === "mes" && "Mês atual"}
                    {selectedPreset === "custom" && "Personalizado"}
                  </span>
                  <svg className={cn("w-4 h-4 transition-transform", presetOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {presetOpen && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
                    {[
                      { key: "hoje", label: "Hoje", from: new Date(), to: new Date() },
                      { key: "7dias", label: "Últimos 7 dias", from: new Date(new Date().setDate(new Date().getDate() - 7)), to: new Date() },
                      { key: "15dias", label: "Últimos 15 dias", from: new Date(new Date().setDate(new Date().getDate() - 15)), to: new Date() },
                      { key: "30dias", label: "Últimos 30 dias", from: new Date(new Date().setDate(new Date().getDate() - 30)), to: new Date() },
                      { key: "mes", label: "Mês atual", from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), to: new Date() },
                    ].map((p) => (
                      <button
                        key={p.key}
                        onClick={() => {
                          setSelectedPreset(p.key);
                          setDateRange({ from: p.from, to: p.to });
                          setPresetOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2",
                          selectedPreset === p.key ? "text-primary font-medium" : "text-foreground"
                        )}
                      >
                        {selectedPreset === p.key && <CheckCircle size={14} className="text-primary" />}
                        {selectedPreset !== p.key && <span className="w-3.5" />}
                        {p.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  if (range?.from) {
                    setDateRange({ from: range.from, to: range.to || range.from });
                    setSelectedPreset("custom");
                  }
                }}
                numberOfMonths={1}
                locale={ptBR}
                className={cn("p-3 pointer-events-auto")}
              />

              {/* Limpar / Filtrar */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-border">
                <button
                  onClick={() => {
                    setDateRange({ from: new Date(new Date().setDate(new Date().getDate() - 30)), to: new Date() });
                    setSelectedPreset("30dias");
                  }}
                  className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors"
                >
                  Limpar
                </button>
                <PopoverClose asChild>
                  <button className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                    Filtrar
                  </button>
                </PopoverClose>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {isDemo && (
        <div className="px-4 py-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-primary">
          <BarChart3 className="inline w-4 h-4 mr-1 -mt-0.5" /> Exibindo dados de demonstração.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: <CheckCircle size={20} className="text-success" />, label: "Aprovadas", value: fmt(approved), sub: `Total de vendas: ${transactions.filter((t: any) => t.status === "approved").length}` },
          { icon: <XCircle size={20} className="text-destructive" />, label: "Abandonadas", value: fmt(abandoned), sub: `Total expirado: ${transactions.filter((t: any) => t.status === "expired" || t.status === "cancelled").length}` },
          { icon: <Wallet size={20} className="text-primary" />, label: "Comissão", value: fmt(commission), sub: `Conversão média: ${transactions.length > 0 ? ((transactions.filter((t: any) => t.status === "approved").length / transactions.length) * 100).toFixed(2) : 0}%` },
          { icon: <RefreshCw size={20} className="text-warning" />, label: "Estornos", value: fmt(refunded), sub: `Por método` },
        ].map((c) => (
          <div key={c.label} className="glass-card p-5 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">{c.icon}<span className="text-sm font-medium text-muted-foreground uppercase">{c.label}</span></div>
            </div>
            <p className="text-2xl md:text-3xl font-heading font-bold text-foreground">{c.value}</p>
            {c.sub && <p className="text-sm text-muted-foreground mt-1.5">{c.sub}</p>}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[48px] sm:min-h-0 text-base sm:text-sm"
            placeholder="Buscar pelo Nome do Cliente"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSearchQuery("");
              setDateRange({ from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), to: new Date() });
            }}
            className="flex-1 sm:flex-none px-4 py-3 sm:py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2 min-h-[48px] sm:min-h-0"
          >
            Limpar
          </button>
          <button onClick={() => setFiltersOpen(true)} className="flex-1 sm:flex-none px-5 py-3 sm:py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 min-h-[48px] sm:min-h-0">
            <Filter size={14} /> Filtros
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden hidden sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left px-5 py-3 font-medium">DATA</th>
              <th className="text-left px-5 py-3 font-medium">CLIENTE</th>
              <th className="text-left px-5 py-3 font-medium">PAGAMENTO</th>
              <th className="text-left px-5 py-3 font-medium">STATUS</th>
              <th className="text-left px-5 py-3 font-medium">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Nenhuma venda encontrada</td></tr>
            ) : transactions.map((t: any) => (
              <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 text-foreground">
                  <div>{new Date(t.created_at).toLocaleDateString("pt-BR")}</div>
                  <div className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</div>
                </td>
                <td className="px-5 py-3 text-foreground">{t.customers?.name || "—"}</td>
                <td className="px-5 py-3 text-foreground">
                  <div>{fmt(Number(t.amount))}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    {t.method === "pix" && <span className="w-2 h-2 rounded-full bg-primary inline-block" />}
                    {t.method === "credit_card" && <span className="w-2 h-2 rounded-full bg-primary/60 inline-block" />}
                    {t.method === "boleto" && <span className="w-2 h-2 rounded-full bg-accent inline-block" />}
                    {methodMap[t.method] || t.method}
                  </div>
                </td>
                <td className="px-5 py-3"><StatusBadge status={statusMap[t.status] || "pending"} /></td>
                <td className="px-5 py-3"><button onClick={async () => {
                  setSelectedTransaction(t);
                  // Try to find matching payment_transaction by description PIX_EXT:id
                  const extMatch = t.description?.match(/PIX_EXT:(.+)/);
                  if (extMatch) {
                    const { data: pt } = await supabase.from("payment_transactions").select("*").eq("external_id", extMatch[1]).maybeSingle();
                    setSelectedPaymentTx(pt);
                  } else {
                    setSelectedPaymentTx(null);
                  }
                }} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground"><Eye size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-0">
        {transactions.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground text-sm">Nenhuma venda encontrada</p>
        ) : transactions.map((t: any) => (
          <div key={t.id} onClick={async () => {
            setSelectedTransaction(t);
            const extMatch = t.description?.match(/PIX_EXT:(.+)/);
            if (extMatch) {
              const { data: pt } = await supabase.from("payment_transactions").select("*").eq("external_id", extMatch[1]).maybeSingle();
              setSelectedPaymentTx(pt);
            } else { setSelectedPaymentTx(null); }
          }} className="py-4 border-b border-border/50 cursor-pointer active:bg-muted/30">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-foreground text-sm">{t.customers?.name || "—"}</span>
              <StatusBadge status={statusMap[t.status] || "pending"} />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date(t.created_at).toLocaleString("pt-BR")}</span>
              <span>{methodMap[t.method] || t.method} · {fmt(Number(t.amount))}</span>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedTransaction} onOpenChange={(open) => { if (!open) { setSelectedTransaction(null); setSelectedPaymentTx(null); } }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <DialogTitle className="text-lg font-heading">Detalhes da Transação</DialogTitle>
              {selectedTransaction && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  selectedTransaction.status === "approved" ? "bg-success/10 text-success" :
                  selectedTransaction.status === "pending" ? "bg-warning/10 text-warning" :
                  selectedTransaction.status === "refunded" ? "bg-violet-500/10 text-violet-400" :
                  "bg-destructive/10 text-destructive"
                }`}>
                  {({ approved: "Pago", pending: "Pendente", cancelled: "Cancelado", expired: "Expirado", refunded: "Estornado" } as Record<string,string>)[selectedTransaction.status] || selectedTransaction.status}
                </span>
              )}
            </div>
          </DialogHeader>
          {selectedTransaction && (() => {
            const t = selectedTransaction;
            const pt = selectedPaymentTx;
            const copyId = () => { navigator.clipboard.writeText(t.id); toast.success("ID copiado!"); };
            const liquidAmount = pt ? (Number(pt.liquid_amount || 0) / 100) : Number(t.amount) * 0.9456;

            return (
              <div className="space-y-4 mt-2">
                {/* Row 1: Cliente + Pagamento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Informações do Cliente */}
                  <div className="rounded-lg border border-border p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <User size={15} className="text-muted-foreground" />
                      Informações do Cliente
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <p><span className="text-muted-foreground">Nome:</span> <span className="font-medium text-foreground">{pt?.buyer_name || t.customers?.name || "—"}</span></p>
                      {(pt?.buyer_document || t.customers?.cpf_cnpj) && (
                        <p><span className="text-muted-foreground">CPF/CNPJ:</span> <span className="font-medium text-foreground">{pt?.buyer_document || t.customers?.cpf_cnpj}</span></p>
                      )}
                      {t.customers?.email && (
                        <p><span className="text-muted-foreground">Email:</span> <span className="font-medium text-foreground">{t.customers.email}</span></p>
                      )}
                      {(pt?.buyer_phone || t.customers?.phone) && (
                        <p><span className="text-muted-foreground">Telefone:</span> <span className="font-medium text-foreground">{pt?.buyer_phone || t.customers?.phone}</span></p>
                      )}
                    </div>
                  </div>

                  {/* Informações de Pagamento */}
                  <div className="rounded-lg border border-border p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <CreditCard size={15} className="text-muted-foreground" />
                      Informações de Pagamento
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <p><span className="text-muted-foreground">Método:</span> <span className="font-medium text-foreground">{methodMap[t.method] || t.method}</span></p>
                      <p><span className="text-muted-foreground">Valor Bruto:</span> <span className="font-medium text-foreground">{fmt(Number(t.amount))}</span></p>
                      <p><span className="text-muted-foreground">Valor Líquido:</span> <span className="font-medium text-foreground">{fmt(liquidAmount)}</span></p>
                      <p><span className="text-muted-foreground">Parcelas:</span> <span className="font-medium text-foreground">1x</span></p>
                      <p><span className="text-muted-foreground">Data de Vencimento:</span> <span className="font-medium text-foreground">{new Date(t.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span></p>
                    </div>
                  </div>
                </div>

                {/* PIX EMV code */}
                {pt?.pix_emv && (
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground font-mono break-all leading-relaxed">{pt.pix_emv}</p>
                  </div>
                )}

                {/* Row 2: Endereço + Itens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Endereço (se disponível) */}
                  {(t.customers?.city || t.customers?.state) && (
                    <div className="rounded-lg border border-border p-4 space-y-2.5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                        <MapPin size={15} className="text-muted-foreground" />
                        Endereço do Cliente
                      </div>
                      <div className="text-sm text-foreground">
                        {t.customers?.city && <p>{t.customers.city}{t.customers?.state ? `/${t.customers.state}` : ""}</p>}
                      </div>
                    </div>
                  )}

                  {/* Itens da Transação */}
                  <div className="rounded-lg border border-border p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <Package size={15} className="text-muted-foreground" />
                      Itens da Transação
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">{t.description || "Pagamento PIX"}</p>
                      <p className="text-muted-foreground">Quantidade: 1</p>
                      <p className="font-medium text-foreground">{fmt(Number(t.amount))}</p>
                    </div>
                  </div>
                </div>

                {/* Row 3: Metadados + Info da Transação */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Metadados */}
                  <div className="rounded-lg border border-border p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <FileText size={15} className="text-muted-foreground" />
                      Metadados
                    </div>
                    <div className="space-y-1.5 text-sm">
                      {pt?.external_id && (
                        <p><span className="text-muted-foreground">External ID:</span> <span className="font-mono text-foreground">{pt.external_id}</span></p>
                      )}
                      <p><span className="text-muted-foreground">Forma de Pagamento:</span> <span className="font-medium text-foreground">{(methodMap[t.method] || t.method).toUpperCase()}</span></p>
                      {pt?.e2e_id && (
                        <p><span className="text-muted-foreground">E2E ID:</span> <span className="font-mono text-foreground text-xs">{pt.e2e_id}</span></p>
                      )}
                    </div>
                  </div>

                  {/* Informações da Transação */}
                  <div className="rounded-lg border border-border p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <Info size={15} className="text-muted-foreground" />
                      Informações da Transação
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">ID:</span>
                        <span className="font-mono text-foreground text-xs">{t.id}</span>
                        <button onClick={copyId} className="p-0.5 rounded hover:bg-muted"><Copy size={12} className="text-muted-foreground" /></button>
                      </div>
                      <p><span className="text-muted-foreground">Data de Criação:</span> <span className="font-medium text-foreground">{new Date(t.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span></p>
                      {pt?.paid_at && (
                        <p><span className="text-muted-foreground">Data de Pagamento:</span> <span className="font-medium text-foreground">{new Date(pt.paid_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span></p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Filtros Avançados */}
      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading">Filtros Avançados</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">ID da Transação</label>
              <input
                value={filterTransactionId}
                onChange={(e) => setFilterTransactionId(e.target.value)}
                placeholder="Digite o ID da transação"
                className="w-full px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Método de Pagamento</label>
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring appearance-none"
              >
                <option value="">Selecione o método</option>
                <option value="pix">PIX</option>
                <option value="credit_card">Cartão</option>
                <option value="boleto">Boleto</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring appearance-none"
              >
                <option value="">Todos</option>
                <option value="approved">Aprovado</option>
                <option value="pending">Pendente</option>
                <option value="cancelled">Cancelado</option>
                <option value="refunded">Estornado</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Nome do Cliente</label>
              <input
                value={filterClientName}
                onChange={(e) => setFilterClientName(e.target.value)}
                placeholder="Digite o nome do cliente"
                className="w-full px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">CPF/CNPJ</label>
              <input
                value={filterCpfCnpj}
                onChange={(e) => setFilterCpfCnpj(e.target.value)}
                placeholder="Digite o CPF ou CNPJ"
                className="w-full px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Nome da Empresa</label>
              <input
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                placeholder="Digite o nome da empresa"
                className="w-full px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setFilterTransactionId("");
                  setFilterMethod("");
                  setFilterStatus("");
                  setFilterClientName("");
                  setFilterCpfCnpj("");
                  setFilterCompany("");
                }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors"
              >
                Limpar Filtros
              </button>
              <button
                onClick={() => setFiltersOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}