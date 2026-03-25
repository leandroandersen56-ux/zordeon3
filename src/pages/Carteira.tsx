import { useState } from "react";
import { Key, X, Loader2, ArrowUpRight, Plus, Trash2, Eye, Diamond, CreditCard, Clock, Hourglass } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Carteira() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [withdrawModal, setWithdrawModal] = useState<{ open: boolean; type: "pix" | "card" | "anticipation" }>({ open: false, type: "pix" });
  const [withdrawForm, setWithdrawForm] = useState({ amount: "", selectedKeyId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // PIX Keys modal
  const [pixKeysModal, setPixKeysModal] = useState(false);
  const [addKeyForm, setAddKeyForm] = useState({ label: "", keyType: "cpf", keyValue: "" });
  const [showAddKey, setShowAddKey] = useState(false);

  const { data: withdrawals = [] } = useQuery({
    queryKey: ["withdrawals", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("withdrawals").select("*").order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const { data: pixKeys = [] } = useQuery({
    queryKey: ["pix-keys", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("pix_keys").select("*").eq("is_active", true).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile-balance", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("balance_pix, balance_card, balance_pending").eq("id", user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  const toAmountFromGateway = (value: unknown) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return null;
    return Number.isInteger(num) ? num / 100 : num;
  };

  const { data: gatewayPixBalance, refetch: refetchGatewayPixBalance } = useQuery({
    queryKey: ["gateway-pix-balance", user?.id],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error("Sessão indisponível para sincronizar saldo PIX.");

      const res = await fetch(`https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/pluggou-proxy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ action: "get-balance" }),
      });

      if (!res.ok) throw new Error("Falha ao consultar saldo do gateway.");

      const data = await res.json();
      const parsed = toAmountFromGateway(
        data?.data?.available_balance ??
        data?.available_balance ??
        data?.data?.balance ??
        data?.balance
      );

      if (parsed === null) throw new Error("Resposta de saldo inválida.");
      return parsed;
    },
    enabled: !!user,
    staleTime: 20_000,
    refetchInterval: 30_000,
    retry: 2,
  });

  const { data: feeConfig = [] } = useQuery({
    queryKey: ["fee-config"],
    queryFn: async () => {
      const { data } = await supabase.from("fee_config").select("*");
      return data || [];
    },
  });

  const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;
  const pixBalance = typeof gatewayPixBalance === "number" ? gatewayPixBalance : 0;
  const cardBalance = Number(profile?.balance_card || 0);

  const getWithdrawFee = (type: string, amount: number) => {
    const config = feeConfig.find((f: any) => f.method === (type === "card" ? "credit_card" : "pix"));
    if (!config) return 0;
    return Number(config.fixed_fee) + (amount * Number(config.percentage_fee) / 100);
  };

  const getAvailableBalance = (type: string) => {
    if (type === "pix") return pixBalance;
    if (type === "card") return cardBalance;
    return 0;
  };

  const handleOpenWithdraw = async (type: "pix" | "card" | "anticipation") => {
    let currentBalance = getAvailableBalance(type);

    if (type === "pix") {
      const latestGatewayBalance = await refetchGatewayPixBalance();
      if (typeof latestGatewayBalance.data === "number") {
        currentBalance = latestGatewayBalance.data;
      }
    }

    if (currentBalance <= 0 && type !== "anticipation") {
      toast.error("Saldo insuficiente para realizar saque.");
      return;
    }

    setWithdrawForm({ amount: "", selectedKeyId: "" });
    setWithdrawModal({ open: true, type });
  };

  const handleSubmitWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amount = parseFloat(withdrawForm.amount.replace(",", "."));
      if (isNaN(amount) || amount <= 0) {
        toast.error("Informe um valor válido.");
        setIsSubmitting(false);
        return;
      }

      if (amount < 10) {
        toast.error("O valor mínimo para saque é R$ 10,00.");
        setIsSubmitting(false);
        return;
      }

      const fee = getWithdrawFee(withdrawModal.type, amount);
      const totalDebit = amount + fee;
      let balance = getAvailableBalance(withdrawModal.type);

      if (withdrawModal.type === "pix") {
        const latestGatewayBalance = await refetchGatewayPixBalance();
        if (typeof latestGatewayBalance.data === "number") {
          balance = latestGatewayBalance.data;
        } else {
          toast.error("Não foi possível sincronizar o saldo real agora. Tente novamente em instantes.");
          setIsSubmitting(false);
          return;
        }
      }

      if (totalDebit > balance && withdrawModal.type !== "anticipation") {
        toast.error(`Saldo insuficiente. Total (valor + taxa): ${fmt(totalDebit)}.`);
        setIsSubmitting(false);
        return;
      }

      if (!withdrawForm.selectedKeyId) {
        toast.error("Selecione uma chave PIX.");
        setIsSubmitting(false);
        return;
      }

      const selectedKey = pixKeys.find((k: any) => k.id === withdrawForm.selectedKeyId);
      if (!selectedKey) {
        toast.error("Chave PIX não encontrada.");
        setIsSubmitting(false);
        return;
      }

      const amountCents = Math.round(amount * 100);
      const recipient = `${selectedKey.label} ${selectedKey.key_value}`;

      // Call the real gateway to process the withdrawal
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const res = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/pluggou-proxy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            action: "create-withdrawal",
            payload: {
              amount: amountCents,
              key_type: selectedKey.key_type,
              key_value: selectedKey.key_value,
            },
          }),
        }
      );

      const resData = await res.json();

      if (!res.ok || resData?.success === false) {
        let errorMsg = resData?.message || resData?.error || "Erro ao processar saque no gateway.";
        if (resData?.data?.errors) {
          const errorDetails = Object.values(resData.data.errors).flat().join(". ");
          if (errorDetails) errorMsg = errorDetails;
        }

        const gatewayAvailable = toAmountFromGateway(resData?.data?.available_balance);
        if (gatewayAvailable !== null) {
          errorMsg = `${errorMsg} Saldo real no gateway: ${fmt(gatewayAvailable)}.`;
        }

        toast.error(errorMsg);
        setIsSubmitting(false);
        return;
      }

      // Also save in the legacy withdrawals table for dashboard visibility
      await supabase.from("withdrawals").insert({
        user_id: user!.id,
        amount,
        fee,
        recipient,
        status: "pending",
      });

      toast.success("Saque enviado para processamento!");
      setWithdrawModal({ open: false, type: "pix" });
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["profile-balance"] });
      queryClient.invalidateQueries({ queryKey: ["gateway-pix-balance"] });
    } catch (err) {
      console.error("Withdrawal failed:", err);
      toast.error("Erro inesperado ao solicitar saque.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPixKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addKeyForm.label.trim() || !addKeyForm.keyValue.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const { error } = await supabase.from("pix_keys").insert({
      user_id: user!.id,
      label: addKeyForm.label.trim(),
      key_type: addKeyForm.keyType,
      key_value: addKeyForm.keyValue.trim(),
    });

    if (error) {
      toast.error("Erro ao salvar chave: " + error.message);
      return;
    }

    toast.success("Chave PIX salva com sucesso!");
    setAddKeyForm({ label: "", keyType: "cpf", keyValue: "" });
    setShowAddKey(false);
    queryClient.invalidateQueries({ queryKey: ["pix-keys"] });
  };

  const handleDeletePixKey = async (id: string) => {
    const { error } = await supabase.from("pix_keys").update({ is_active: false }).eq("id", id);
    if (error) {
      toast.error("Erro ao remover chave.");
      return;
    }
    toast.success("Chave removida.");
    queryClient.invalidateQueries({ queryKey: ["pix-keys"] });
  };

  const parsedAmount = parseFloat(withdrawForm.amount.replace(",", ".")) || 0;
  const currentFee = getWithdrawFee(withdrawModal.type, parsedAmount);

  const tabs = ["Transferência", "Antecipações", "Extrato"];

  const filteredWithdrawals = withdrawals.filter((w: any) => {
    if (activeTab === 0) return true;
    if (activeTab === 1) return false;
    return true;
  });

  const statusMap: Record<string, { label: string; class: string }> = {
    pending: { label: "Pendente", class: "bg-warning/10 text-warning" },
    completed: { label: "Transferido", class: "bg-success/10 text-success" },
    rejected: { label: "Rejeitado", class: "bg-destructive/10 text-destructive" },
  };

  const keyTypeLabels: Record<string, string> = {
    cpf: "CPF",
    cnpj: "CNPJ",
    email: "E-mail",
    phone: "Telefone",
    random: "Aleatória",
  };

  const balanceCards = [
    {
      label: "SALDO PIX",
      value: fmt(pixBalance),
      subLabel: "Saldo total disponível",
      subValue: fmt(pixBalance),
      icon: Diamond,
      accent: "border-l-primary",
      subAccent: "text-primary",
      iconBg: "bg-primary/10 text-primary",
      btn: "Realizar Saque",
      btnClass: "bg-primary text-primary-foreground hover:bg-primary/90",
      onClick: () => handleOpenWithdraw("pix"),
    },
    {
      label: "SALDO CARTÃO",
      value: fmt(cardBalance),
      subLabel: "Saldo total disponível",
      subValue: fmt(cardBalance),
      icon: CreditCard,
      accent: "border-l-secondary",
      subAccent: "text-secondary",
      iconBg: "bg-secondary/10 text-secondary",
      btn: "Realizar Saque",
      btnClass: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      onClick: () => handleOpenWithdraw("card"),
    },
    {
      label: "A RECEBER",
      value: "R$ 0,00",
      subLabel: "Disponível para antecipação",
      subValue: "R$ 0,00",
      icon: Clock,
      accent: "border-l-warning",
      subAccent: "text-warning",
      iconBg: "bg-warning/10 text-warning",
      btn: "Antecipar Saque",
      btnClass: "bg-warning text-warning-foreground hover:bg-warning/90",
      onClick: () => handleOpenWithdraw("anticipation"),
    },
    {
      label: "AGUARDANDO",
      value: "R$ 0,00",
      subLabel: "Valor em reserva",
      subValue: "R$ 0,00",
      icon: Hourglass,
      accent: "border-l-muted-foreground/30",
      subAccent: "text-muted-foreground",
      iconBg: "bg-muted text-muted-foreground",
      btn: null,
      btnClass: "",
      onClick: () => {},
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-heading font-bold">Minha Carteira</h1>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {balanceCards.map((c) => (
          <div key={c.label} className={`glass-card p-5 md:p-6 border-l-4 ${c.accent} flex flex-col`}>
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{c.label}</p>
                </div>
                <p className="text-2xl md:text-3xl font-heading font-bold text-foreground">{c.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.iconBg}`}>
                <c.icon size={20} />
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">{c.subLabel}</p>
              <p className={`text-sm font-semibold ${c.subAccent}`}>{c.subValue}</p>
            </div>

            {c.btn && (
              <button
                onClick={c.onClick}
                className={`mt-4 w-full py-3 rounded-lg text-sm font-medium transition-all min-h-[44px] flex items-center justify-center gap-2 ${c.btnClass}`}
              >
                <ArrowUpRight size={16} />
                {c.btn}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Tabs Section */}
      <div className="glass-card">
        <div className="flex border-b border-border overflow-x-auto">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-5 md:px-6 py-3.5 text-sm font-medium transition-colors whitespace-nowrap ${i === activeTab ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-5">
          <button
            onClick={() => setPixKeysModal(true)}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-lg border border-primary/30 bg-primary/5 text-primary text-sm font-medium hover:bg-primary/10 transition-colors mb-5"
          >
            <Key size={16} /> Ver minhas chaves PIX
          </button>

          {activeTab === 1 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              Nenhuma antecipação disponível no momento.
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left py-3 font-medium text-xs uppercase tracking-wider">Valor</th>
                      <th className="text-left py-3 font-medium text-xs uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 font-medium text-xs uppercase tracking-wider">Destinatário</th>
                      <th className="text-left py-3 font-medium text-xs uppercase tracking-wider">Taxa</th>
                      <th className="text-left py-3 font-medium text-xs uppercase tracking-wider">Enviado em</th>
                      <th className="text-right py-3 font-medium text-xs uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWithdrawals.length === 0 ? (
                      <tr><td colSpan={6} className="py-16 text-center text-muted-foreground">Sem dados no período</td></tr>
                    ) : filteredWithdrawals.map((w: any) => {
                      const st = statusMap[w.status] || statusMap.pending;
                      return (
                        <tr key={w.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="py-3.5 text-foreground font-medium">{fmt(Number(w.amount))}</td>
                          <td className="py-3.5"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.class}`}>{st.label}</span></td>
                          <td className="py-3.5 text-foreground">{w.recipient || "—"}</td>
                          <td className="py-3.5 text-foreground">{fmt(Number(w.fee))}</td>
                          <td className="py-3.5 text-foreground">{new Date(w.created_at).toLocaleDateString("pt-BR")} {new Date(w.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</td>
                          <td className="py-3.5 text-right">
                            <Eye size={16} className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Mobile Cards */}
              <div className="sm:hidden space-y-3">
                {filteredWithdrawals.length === 0 ? (
                  <p className="py-16 text-center text-muted-foreground text-sm">Sem dados no período</p>
                ) : filteredWithdrawals.map((w: any) => {
                  const st = statusMap[w.status] || statusMap.pending;
                  return (
                    <div key={w.id} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground text-base">{fmt(Number(w.amount))}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.class}`}>{st.label}</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>{w.recipient || "—"}</p>
                        <p>Taxa: {fmt(Number(w.fee))} · {new Date(w.created_at).toLocaleDateString("pt-BR")}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Withdraw Modal (Criar Transferência) ── */}
      {withdrawModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setWithdrawModal({ open: false, type: "pix" })}>
          <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border p-6 space-y-5 animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-foreground">Criar Transferência</h2>
              <button onClick={() => setWithdrawModal({ open: false, type: "pix" })} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            {withdrawModal.type !== "anticipation" && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Saldo disponível</span>
                <span className="text-base font-bold text-foreground">{fmt(getAvailableBalance(withdrawModal.type))}</span>
              </div>
            )}

            <form onSubmit={handleSubmitWithdraw} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Valor da transferência</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">R$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={withdrawForm.amount}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
                  />
                </div>
                {parsedAmount > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Taxa de transferência: {fmt(currentFee)}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Chave Pix</label>
                <select
                  value={withdrawForm.selectedKeyId}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, selectedKeyId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm appearance-none cursor-pointer"
                >
                  <option value="">Selecione</option>
                  {pixKeys.map((k: any) => (
                    <option key={k.id} value={k.id}>
                      {k.label} {k.key_value}
                    </option>
                  ))}
                </select>
                {pixKeys.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Nenhuma chave PIX cadastrada.{" "}
                    <button type="button" onClick={() => { setWithdrawModal({ open: false, type: "pix" }); setPixKeysModal(true); }} className="text-primary hover:underline">
                      Cadastrar agora
                    </button>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !withdrawForm.selectedKeyId}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Processando...</> : "Confirmar Transferência"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── PIX Keys Modal (Chaves PIX) ── */}
      {pixKeysModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => { setPixKeysModal(false); setShowAddKey(false); }}>
          <div className="w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border p-6 space-y-5 animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-foreground">Chaves PIX</h2>
              <button onClick={() => { setPixKeysModal(false); setShowAddKey(false); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground">
              {pixKeys.length} chave{pixKeys.length !== 1 ? "s" : ""} PIX cadastrada{pixKeys.length !== 1 ? "s" : ""}. Você pode desabilitar e adicionar novas.
            </p>

            {/* Existing Keys */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {pixKeys.map((k: any) => (
                <div key={k.id} className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Key size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-sm">{k.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success font-bold uppercase tracking-wider">Ativa</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{k.key_value}</p>
                  </div>
                  <button
                    onClick={() => handleDeletePixKey(k.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-destructive/60 hover:text-destructive transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {pixKeys.length === 0 && !showAddKey && (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  Nenhuma chave PIX cadastrada.
                </div>
              )}
            </div>

            {/* Add Key Form */}
            {showAddKey ? (
              <form onSubmit={handleAddPixKey} className="space-y-4 pt-3 border-t border-border">
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1.5">Apelido</label>
                  <input
                    type="text"
                    placeholder="Ex: Empresa, Pessoal..."
                    value={addKeyForm.label}
                    onChange={(e) => setAddKeyForm({ ...addKeyForm, label: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1.5">Tipo de chave</label>
                  <select
                    value={addKeyForm.keyType}
                    onChange={(e) => setAddKeyForm({ ...addKeyForm, keyType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  >
                    {Object.entries(keyTypeLabels).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1.5">Chave PIX</label>
                  <input
                    type="text"
                    placeholder="Informe a chave PIX"
                    value={addKeyForm.keyValue}
                    onChange={(e) => setAddKeyForm({ ...addKeyForm, keyValue: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowAddKey(false)} className="flex-1 py-3 rounded-xl border border-border text-muted-foreground font-medium text-sm hover:bg-muted transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all">
                    Salvar Chave
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowAddKey(true)}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Adicionar nova chave PIX
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
