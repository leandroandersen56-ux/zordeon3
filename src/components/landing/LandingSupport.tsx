import { motion } from "framer-motion";
import { MechaHeadphones, MechaMail, MechaChat, MechaPhone, MechaZap } from "./MechaIcons";
import supportTeamImg from "@/assets/landing/support-team.jpg";
import supportChatImg from "@/assets/landing/support-chat.jpg";

export default function LandingSupport() {
  return (
    <section className="section-light py-24 sm:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(243,100%,68%)]/15 bg-[hsl(243,100%,68%)]/5 text-[hsl(230,25%,40%)] text-xs font-medium mb-6">
              <MechaHeadphones size={14} className="text-[hsl(243,100%,60%)]" /> Suporte
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight heading-fade-light" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
              Suporte que{" "}
              <span className="gradient-text font-medium">nunca para.</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-end"
          >
            <p className="text-[hsl(230,10%,50%)] leading-relaxed text-base">
              Oferecemos atendimento técnico especializado 24 horas por dia, 7 dias por semana,
              com foco total na continuidade da sua operação. Equipe de suporte altamente
              capacitada para atender desde questões operacionais até integrações complexas.
            </p>
          </motion.div>
        </div>

        {/* Support cards with images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-[hsl(0,0%,100%)] border border-[hsl(230,15%,90%)] rounded-2xl overflow-hidden hover:border-[hsl(243,100%,68%)]/25 transition-all duration-500 hover:shadow-[0_0_50px_-10px_hsl(243,100%,68%,0.12)]"
          >
            <div className="h-56 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,100%)] via-transparent to-transparent z-10 opacity-30" />
              <img src={supportTeamImg} alt="Equipe de suporte Zordeon" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <MechaMail size={20} className="text-[hsl(230,10%,70%)]" />
                <MechaChat size={20} className="text-[hsl(230,10%,70%)]" />
                <MechaPhone size={20} className="text-[hsl(230,10%,70%)]" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-2 text-[hsl(230,25%,15%)]">
                Disponibilidade em múltiplos canais
              </h3>
              <p className="text-[hsl(230,10%,50%)] text-sm leading-relaxed">
                E-mail, chat e suporte prioritário via telefone
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group bg-[hsl(0,0%,100%)] border border-[hsl(230,15%,90%)] rounded-2xl overflow-hidden hover:border-[hsl(243,100%,68%)]/25 transition-all duration-500 hover:shadow-[0_0_50px_-10px_hsl(243,100%,68%,0.12)]"
          >
            <div className="h-56 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,100%)] via-transparent to-transparent z-10 opacity-30" />
              <img src={supportChatImg} alt="Suporte rápido Zordeon" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
            <div className="p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(243,100%,68%)]/10 to-[hsl(247,100%,74%)]/5 border border-[hsl(243,100%,68%)]/15 flex items-center justify-center mb-4">
                <MechaZap size={20} className="text-[hsl(243,100%,60%)]" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-2 text-[hsl(230,25%,15%)]">
                Resposta rápida com monitoramento proativo
              </h3>
              <p className="text-[hsl(230,10%,50%)] text-sm leading-relaxed">
                Estamos preparados para acompanhar sua empresa em todos os momentos.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
