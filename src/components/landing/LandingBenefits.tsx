import { motion } from "framer-motion";
import { PaymentLogoGrid } from "./PaymentLogos";
import { ArrowRight } from "lucide-react";
import { MechaShield, MechaZap, MechaCreditCard, MechaMonitor } from "./MechaIcons";
import gradientDark1 from "@/assets/landing/gradient-dark-1.png";
import gradientDark2 from "@/assets/landing/gradient-dark-2.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function LandingBenefits() {
  return (
    <section className="section-dark py-24 sm:py-32 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[hsl(243,100%,68%)]/5 rounded-full blur-[200px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight heading-fade-dark" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
            Tudo que você precisa,
            <br />
            <span className="gradient-text font-medium">em uma única plataforma</span>
          </h2>
        </motion.div>

        {/* Top row — 2 large cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Proteção Total */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="group relative rounded-2xl overflow-hidden border border-[hsl(0,0%,100%)]/[0.06] hover:border-[hsl(243,100%,68%)]/30 transition-all duration-500 min-h-[280px] flex flex-col justify-end"
          >
            <img src={gradientDark1} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(230,20%,5%)] via-[hsl(230,20%,5%)]/40 to-transparent" />
            <div className="absolute top-6 right-6">
              <div className="w-14 h-14 rounded-2xl bg-[hsl(243,100%,68%)]/10 border border-[hsl(243,100%,68%)]/20 flex items-center justify-center group-hover:shadow-[0_0_25px_-5px_hsl(243,100%,68%,0.4)] transition-all duration-500">
                <MechaShield size={28} className="text-[hsl(243,100%,68%)]" />
              </div>
            </div>
            <div className="relative p-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-6 rounded-full bg-[hsl(243,100%,68%)]" />
                <h3 className="font-heading font-bold text-xl text-[hsl(0,0%,95%)]">Proteção Total</h3>
              </div>
              <p className="text-[hsl(0,0%,70%)] text-sm leading-relaxed max-w-sm">
                Cada transação é protegida com a mesma tecnologia usada pelos maiores bancos do país.
              </p>
            </div>
          </motion.div>

          {/* Pagamento Instantâneo */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="group relative rounded-2xl overflow-hidden border border-[hsl(0,0%,100%)]/[0.06] hover:border-[hsl(243,100%,68%)]/30 transition-all duration-500 min-h-[280px] flex flex-col justify-end"
          >
            <img src={gradientDark2} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(230,20%,5%)] via-[hsl(230,20%,5%)]/40 to-transparent" />
            <div className="absolute top-6 right-6">
              <div className="w-14 h-14 rounded-2xl bg-[hsl(243,100%,68%)]/15 border border-[hsl(243,100%,68%)]/25 flex items-center justify-center backdrop-blur-sm">
                <span className="font-heading font-bold text-lg text-[hsl(243,100%,68%)]">&lt;1s</span>
              </div>
            </div>
            <div className="relative p-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-6 rounded-full bg-[hsl(243,100%,68%)]" />
                <h3 className="font-heading font-bold text-xl text-[hsl(0,0%,95%)]">Pagamento Instantâneo</h3>
              </div>
              <p className="text-[hsl(0,0%,70%)] text-sm leading-relaxed max-w-sm">
                Seus clientes finalizam a compra em segundos — sem travamentos ou telas de erro.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom row — 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tudo Organizado */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="group relative rounded-2xl overflow-hidden border border-[hsl(0,0%,100%)]/[0.06] hover:border-[hsl(243,100%,68%)]/30 transition-all duration-500 bg-gradient-to-b from-[hsl(230,20%,10%)] to-[hsl(230,20%,7%)] p-7"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full bg-[hsl(243,100%,68%)]" />
              <h3 className="font-heading font-bold text-lg text-[hsl(0,0%,95%)]">Tudo Organizado</h3>
            </div>
            <p className="text-[hsl(0,0%,60%)] text-sm leading-relaxed mb-6">
              Veja quanto entrou, quanto falta receber e o extrato completo em um único painel.
            </p>
            {/* Mini financial summary */}
            <div className="rounded-xl bg-[hsl(230,20%,8%)] border border-[hsl(0,0%,100%)]/[0.06] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[hsl(0,0%,55%)] text-xs">Entradas</span>
                <span className="text-[hsl(243,100%,68%)] font-heading font-semibold text-sm">R$ 45.230</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[hsl(0,0%,55%)] text-xs">A receber</span>
                <span className="text-[hsl(0,0%,85%)] font-heading font-semibold text-sm">R$ 12.800</span>
              </div>
              <div className="h-px bg-[hsl(0,0%,100%)]/[0.06]" />
              <div className="flex items-center justify-between">
                <span className="text-[hsl(0,0%,55%)] text-xs">Saldo total</span>
                <span className="text-[hsl(0,0%,95%)] font-heading font-bold text-sm">R$ 58.030</span>
              </div>
            </div>
          </motion.div>

          {/* Todas as Formas */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
            className="group relative rounded-2xl overflow-hidden border border-[hsl(0,0%,100%)]/[0.06] hover:border-[hsl(243,100%,68%)]/30 transition-all duration-500 bg-gradient-to-b from-[hsl(230,20%,10%)] to-[hsl(230,20%,7%)] p-7"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full bg-[hsl(243,100%,68%)]" />
              <h3 className="font-heading font-bold text-lg text-[hsl(0,0%,95%)]">Todas as Formas de Pagamento</h3>
            </div>
            <p className="text-[hsl(0,0%,60%)] text-sm leading-relaxed mb-6">
              Pix, crédito, débito, boleto — seu cliente escolhe como quer pagar.
            </p>
            {/* Payment method icons grid */}
            <PaymentLogoGrid />
          </motion.div>

          {/* Pronto para começar */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}
            className="group relative rounded-2xl overflow-hidden border border-[hsl(243,100%,68%)]/20 transition-all duration-500 min-h-[280px] flex flex-col justify-between"
          >
            <img src={gradientDark2} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden />
            <div className="absolute inset-0 bg-[hsl(230,20%,5%)]/60" />
            <div className="relative p-7 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 rounded-full bg-[hsl(243,100%,68%)]" />
                  <h3 className="font-heading font-bold text-lg text-[hsl(0,0%,95%)]">Pronto para começar?</h3>
                </div>
                <p className="text-[hsl(0,0%,70%)] text-sm leading-relaxed">
                  Fale com um especialista e tenha seu sistema de pagamento funcionando em minutos.
                </p>
              </div>
              <a
                href="/auth"
                className="mt-6 inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-[hsl(243,100%,68%)] text-[hsl(0,0%,100%)] font-semibold text-sm hover:bg-[hsl(243,100%,64%)] transition-all duration-300 group/btn glow-primary"
              >
                Falar com Especialista
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
