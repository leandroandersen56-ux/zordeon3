import { useState } from "react";
import { Loader2, QrCode, Copy, CheckCircle2, Link as LinkIcon, Image, Type, Palette, ArrowRight, Sparkles } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

function formatCurrency(cents: number) {
  return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}

function validateCPF(cpf: string) {
  const digits = cpf.replace(/\D/g, "");
  return digits.length === 11 || digits.length === 14;
}

function validatePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

export default function PixCheckout() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerDocument, setBuyerDocument] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    emv: string;
    amount: number;
    platformTax: number;
    liquidAmount: number;
    transactionId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const amountCents = Math.round(parseFloat(amount.replace(",", ".") || "0") * 100);

  const createCharge = async () => {
    if (!user) return;

    // Validations
    if (amountCents < 10) {
      toast.error("Valor mínimo: R$ 0,10");
      return;
    }
    if (amountCents > 300000) {
      toast.error("Valor máximo: R$ 3.000,00");
      return;
    }
    if (!buyerName.trim()) {
      toast.error("Nome do comprador é obrigatório");
      return;
    }
    if (!validateCPF(buyerDocument)) {
      toast.error("CPF ou CNPJ inválido");
      return;
    }
    if (!validatePhone(buyerPhone)) {
      toast.error("Telefone inválido");
      return;
    }

    setLoading(true);
    try {
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
            action: "create-transaction",
            payload: {
              payment_method: "pix",
              amount: amountCents,
              buyer: {
                buyer_name: buyerName,
                buyer_document: buyerDocument.replace(/\D/g, ""),
                buyer_phone: buyerPhone.replace(/\D/g, ""),
              },
            },
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Erro ao gerar cobrança");
      }

      setResult({
        emv: data.data.pix.emv,
        amount: data.data.amount,
        platformTax: data.data.platform_tax,
        liquidAmount: data.data.liquid_amount,
        transactionId: data.data.id,
      });
      toast.success("Cobrança PIX gerada com sucesso!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyEMV = () => {
    if (result?.emv) {
      navigator.clipboard.writeText(result.emv);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-heading font-bold">Cobrança PIX Gerada</h1>
            <p className="text-muted-foreground text-sm">Compartilhe o QR Code ou o código copia e cola.</p>
          </div>
        </div>

        <div className="glass-card p-5 md:p-8 max-w-lg space-y-6">
          {/* QR Code placeholder - using EMV text */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center p-3">
              <QRCodeSVG value={result.emv} size={168} level="M" />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Use um leitor de QR Code ou copie o código abaixo
            </p>
          </div>

          {/* EMV Code */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Código PIX (Copia e Cola)</label>
            <div className="flex gap-2">
              <input value={result.emv} readOnly className={inputClass + " bg-muted text-xs font-mono"} />
              <button
                onClick={copyEMV}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm shrink-0 flex items-center gap-2"
              >
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card p-3 text-center">
              <p className="text-xs text-muted-foreground">Valor</p>
              <p className="font-semibold text-foreground">{formatCurrency(result.amount)}</p>
            </div>
            <div className="glass-card p-3 text-center">
              <p className="text-xs text-muted-foreground">Taxa</p>
              <p className="font-semibold text-foreground">{formatCurrency(result.platformTax)}</p>
            </div>
            <div className="glass-card p-3 text-center">
              <p className="text-xs text-muted-foreground">Líquido</p>
              <p className="font-semibold text-emerald-400">{formatCurrency(result.liquidAmount)}</p>
            </div>
          </div>

          <button
            onClick={() => { setResult(null); setAmount(""); setBuyerName(""); setBuyerDocument(""); setBuyerPhone(""); }}
            className="w-full py-3 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors"
          >
            Nova cobrança
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <QrCode size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-bold">Gerar PIX Rápido</h1>
          <p className="text-muted-foreground text-sm">Crie uma cobrança PIX instantânea ou um link de pagamento personalizado.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: PIX Rápido Form */}
        <div className="glass-card p-5 md:p-8 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <QrCode size={18} className="text-primary" />
            <h2 className="text-base font-semibold text-foreground">PIX Rápido</h2>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Simples</span>
          </div>
          <p className="text-xs text-muted-foreground -mt-3">Gere um QR Code na hora, sem personalização.</p>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Valor (R$)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9,\.]/g, ""))}
              placeholder="0,00"
              className={inputClass + " text-lg font-semibold"}
            />
            <p className="text-xs text-muted-foreground mt-1">Mínimo R$ 0,10 · Máximo R$ 3.000,00</p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Nome do comprador</label>
            <input
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="Nome completo"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">CPF / CNPJ</label>
            <input
              value={buyerDocument}
              onChange={(e) => setBuyerDocument(e.target.value)}
              placeholder="000.000.000-00"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Telefone</label>
            <input
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
              placeholder="(00) 00000-0000"
              className={inputClass}
            />
          </div>

          <button
            onClick={createCharge}
            disabled={loading || !amount || !buyerName || !buyerDocument || !buyerPhone}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />}
            Gerar Cobrança PIX
          </button>
        </div>

        {/* Right: Link de Pagamento Promo Card */}
        <div className="glass-card p-5 md:p-8 space-y-5 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <LinkIcon size={18} className="text-primary" />
            <h2 className="text-base font-semibold text-foreground">Link de Pagamento</h2>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium flex items-center gap-1">
              <Sparkles size={10} /> Avançado
            </span>
          </div>
          <p className="text-xs text-muted-foreground -mt-3">Crie um checkout completo e personalizado para compartilhar.</p>

          {/* Mock Preview */}
          <div className="rounded-xl border border-border bg-muted/30 overflow-hidden flex-1">
            <div className="flex flex-col h-full">
              {/* Mock browser bar */}
              <div className="bg-primary/5 border-b border-border px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-destructive/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                <span className="text-[10px] text-muted-foreground ml-2 font-mono">seusite.com/pay/produto</span>
              </div>

              {/* Mock checkout content */}
              <div className="p-4 space-y-3 flex-1">
                {/* Mock banner */}
                <div className="w-full h-24 rounded-lg bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                  <Image size={28} className="text-primary/40" />
                </div>

                {/* Mock product info */}
                <div className="space-y-1.5">
                  <div className="h-4 w-3/4 rounded bg-foreground/10" />
                  <div className="h-3 w-full rounded bg-foreground/5" />
                  <div className="h-3 w-2/3 rounded bg-foreground/5" />
                </div>

                {/* Mock price */}
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-lg font-bold text-primary">R$ 197,00</span>
                  <span className="text-xs text-muted-foreground line-through">R$ 297,00</span>
                </div>

                {/* Mock fields */}
                <div className="space-y-2 pt-1">
                  <div className="h-8 rounded-md border border-border bg-background/50 px-3 flex items-center">
                    <span className="text-[10px] text-muted-foreground/50">Nome completo</span>
                  </div>
                  <div className="h-8 rounded-md border border-border bg-background/50 px-3 flex items-center">
                    <span className="text-[10px] text-muted-foreground/50">CPF</span>
                  </div>
                </div>

                {/* Mock pay button */}
                <div className="h-9 rounded-lg bg-primary/80 flex items-center justify-center mt-1">
                  <span className="text-[11px] font-medium text-primary-foreground">Pagar com PIX</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features list */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Image size={12} className="text-primary shrink-0" />
              Imagem e banner
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Type size={12} className="text-primary shrink-0" />
              Título e descrição
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Palette size={12} className="text-primary shrink-0" />
              Tema personalizável
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Sparkles size={12} className="text-primary shrink-0" />
              Pixels e rastreio
            </div>
          </div>

          <a
            href="/links"
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Criar Link de Pagamento
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
