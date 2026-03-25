import { Zap, CreditCard, FileText, Banknote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function Taxas() {
  const { data: feeConfig = [] } = useQuery({
    queryKey: ["fee-config-taxas"],
    queryFn: async () => {
      const { data } = await supabase.from("fee_config").select("*");
      return data || [];
    },
  });

  const getConfig = (method: string) => feeConfig.find((f: any) => f.method === method);

  const pixCfg = getConfig("pix");
  const cardCfg = getConfig("credit_card");
  const boletoCfg = getConfig("boleto");

  const fees = [
    {
      name: "PIX",
      icon: <Zap size={20} />,
      accent: "border-l-primary",
      rate: pixCfg ? `R$ ${Number(pixCfg.fixed_fee).toFixed(2).replace(".", ",")} + ${Number(pixCfg.percentage_fee).toFixed(2).replace(".", ",")}%` : "Carregando...",
      reserve: pixCfg ? `${Number(pixCfg.reserve_percentage)}%` : "0%",
    },
    {
      name: "Cartão de crédito",
      icon: <CreditCard size={20} />,
      accent: "border-l-secondary",
      rate: cardCfg ? `R$ ${Number(cardCfg.fixed_fee).toFixed(2).replace(".", ",")} + ${Number(cardCfg.percentage_fee).toFixed(2).replace(".", ",")}%` : "Carregando...",
      reserve: cardCfg ? `${Number(cardCfg.reserve_percentage)}%` : "25%",
      extra: "Ver taxas por parcela →",
    },
    {
      name: "Tarifa Boleto",
      icon: <FileText size={20} />,
      accent: "border-l-warning",
      rate: boletoCfg ? `R$ ${Number(boletoCfg.fixed_fee).toFixed(2).replace(".", ",")} + ${Number(boletoCfg.percentage_fee).toFixed(2).replace(".", ",")}%` : "Carregando...",
      reserve: boletoCfg ? `${Number(boletoCfg.reserve_percentage)}%` : "8%",
    },
    {
      name: "Tarifa Saque",
      icon: <Banknote size={20} />,
      accent: "border-l-muted-foreground",
      rate: "R$ 10,00",
      reserve: null,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Taxas de Pagamento</h1>
        <p className="text-muted-foreground text-sm md:text-base mt-2">Faça uma simulação em tempo real de transações para obter todas as suas taxas de forma clara.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fees.map((f) => (
          <div key={f.name} className={`glass-card p-6 md:p-7 border-l-4 ${f.accent}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-foreground text-xl md:text-2xl">{f.name}</h3>
              </div>
              <span className="text-muted-foreground">{f.icon}</span>
            </div>
            <div className="space-y-3 text-sm md:text-base">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">VALOR DA TAXA</span>
                <span className="text-foreground font-semibold text-base md:text-lg">{f.rate}</span>
              </div>
              {f.reserve !== null && (
                <>
                  <div className="border-t border-border/50" />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">RESERVA</span>
                    <span className="text-foreground font-semibold text-base md:text-lg">{f.reserve}</span>
                  </div>
                </>
              )}
            </div>
            {f.extra && (
              <button className="mt-4 text-primary text-sm font-medium flex items-center gap-1 hover:underline">{f.extra}</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
