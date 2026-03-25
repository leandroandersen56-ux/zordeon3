import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MechaCreditCard, MechaQrCode, MechaClock, MechaPercent, MechaDollar } from "./MechaIcons";

export default function LandingStats() {
  return (
    <section id="pricing" className="bg-white py-24 sm:py-32 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(243,100%,68%)]/5 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-[hsl(230,20%,15%)]" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
            Custo sob controle,
            <br />
            <span className="gradient-text font-medium">performance sem limite</span>
          </h2>
          <p className="text-[hsl(230,10%,45%)] text-base mt-4 max-w-xl mx-auto">
            Tenha acesso a taxas justas e adaptadas ao seu volume. Sem complicações, apenas resultados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cartão de Crédito */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group rounded-2xl overflow-hidden border border-[hsl(230,20%,90%)] hover:border-[hsl(243,100%,68%)]/40 transition-all duration-500 bg-[hsl(230,25%,97%)]"
          >
            <div className="p-5 border-b border-[hsl(230,20%,90%)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(243,100%,68%)]/10 border border-[hsl(243,100%,68%)]/20 flex items-center justify-center group-hover:shadow-[0_0_20px_-5px_hsl(243,100%,68%,0.3)] transition-all duration-500">
                <MechaCreditCard size={20} className="text-[hsl(243,100%,68%)]" />
              </div>
              <span className="font-heading font-bold text-[hsl(230,20%,15%)]">Cartão de Crédito</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-heading font-bold text-[hsl(230,20%,15%)]">D+2</span>
                <MechaClock size={18} className="text-[hsl(230,10%,70%)]" />
              </div>
              <div className="flex items-center justify-between border-t border-[hsl(230,20%,90%)] pt-4">
                <span className="text-2xl font-heading font-bold text-[hsl(230,20%,15%)]">7,99%</span>
                <MechaPercent size={18} className="text-[hsl(230,10%,70%)]" />
              </div>
              <div className="flex items-center justify-between border-t border-[hsl(230,20%,90%)] pt-4">
                <div>
                  <span className="text-2xl font-heading font-bold text-[hsl(230,20%,15%)]">+6,99</span>
                  <span className="text-[hsl(230,10%,55%)] text-xs ml-2">Fixo</span>
                </div>
                <MechaDollar size={18} className="text-[hsl(230,10%,70%)]" />
              </div>
            </div>
          </motion.div>

          {/* CTA Center */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative rounded-2xl p-8 flex flex-col items-center justify-center text-center overflow-hidden border border-[hsl(243,100%,68%)]/30 bg-gradient-to-br from-[hsl(243,100%,68%)]/10 via-[hsl(247,100%,64%)]/5 to-[hsl(280,80%,55%)]/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(243,100%,68%)]/5 to-transparent" />
            <div className="relative">
              <h3 className="font-heading font-bold text-xl text-[hsl(230,20%,15%)] mb-3">
                Condições especiais para volumes elevados.
              </h3>
              <p className="text-[hsl(230,10%,45%)] text-sm mb-6">
                Fale com nossa equipe para taxas personalizadas.
              </p>
              <a
                href="#"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[hsl(243,100%,68%)] text-[hsl(0,0%,100%)] font-semibold text-sm hover:bg-[hsl(243,100%,64%)] transition-all duration-300 glow-primary"
              >
                Fale com nossa equipe
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </motion.div>

          {/* Pix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group rounded-2xl overflow-hidden border border-[hsl(230,20%,90%)] hover:border-[hsl(243,100%,68%)]/40 transition-all duration-500 bg-[hsl(230,25%,97%)]"
          >
            <div className="p-5 border-b border-[hsl(230,20%,90%)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(243,100%,68%)]/10 border border-[hsl(243,100%,68%)]/20 flex items-center justify-center group-hover:shadow-[0_0_20px_-5px_hsl(243,100%,68%,0.3)] transition-all duration-500">
                <MechaQrCode size={20} className="text-[hsl(243,100%,68%)]" />
              </div>
              <span className="font-heading font-bold text-[hsl(230,20%,15%)]">Pix</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-heading font-bold text-[hsl(230,20%,15%)]">D+0</span>
                <MechaClock size={18} className="text-[hsl(230,10%,70%)]" />
              </div>
              <div className="flex items-center justify-between border-t border-[hsl(230,20%,90%)] pt-4">
                <span className="text-2xl font-heading font-bold text-[hsl(230,20%,15%)]">2,99%</span>
                <MechaPercent size={18} className="text-[hsl(230,10%,70%)]" />
              </div>
              <div className="flex items-center justify-between border-t border-[hsl(230,20%,90%)] pt-4">
                <div>
                  <span className="text-2xl font-heading font-bold text-[hsl(230,20%,15%)]">+1,50</span>
                  <span className="text-[hsl(230,10%,55%)] text-xs ml-2">Fixo</span>
                </div>
                <MechaDollar size={18} className="text-[hsl(230,10%,70%)]" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
