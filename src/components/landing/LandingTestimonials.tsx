import { motion } from "framer-motion";
import { Star } from "lucide-react";
import avatarRafael from "@/assets/landing/avatar-rafael.png";
import avatarAna from "@/assets/landing/avatar-ana.png";
import avatarLucas from "@/assets/landing/avatar-lucas.png";

const testimonials = [
  { name: "Rafael Costa", role: "CEO, TechStore", avatar: avatarRafael, text: "Depois de migrar para o Zordeon, nossa taxa de aprovação subiu 23%. O suporte é excepcional e a integração foi feita em menos de 1 dia." },
  { name: "Ana Beatriz", role: "COO, ModaFit", avatar: avatarAna, text: "O roteamento inteligente fez toda diferença. Processamos milhões por mês com estabilidade total e taxas competitivas." },
  { name: "Lucas Mendes", role: "CTO, GameHub", avatar: avatarLucas, text: "A API é extremamente bem documentada. Integramos em poucas horas e o dashboard nos dá visibilidade completa das operações." },
];

export default function LandingTestimonials() {
  return (
    <section className="section-dark py-24 sm:py-32 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[hsl(243,100%,68%)]/4 rounded-full blur-[200px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[hsl(243,100%,68%)] text-xs font-semibold uppercase tracking-[0.2em]">Depoimentos</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal mt-4 heading-fade-dark" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
            Players que cresceram
            <br />
            <span className="gradient-text font-medium">com a nossa solução</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group bg-gradient-to-b from-[hsl(230,20%,10%)] to-[hsl(230,20%,8%)] border border-[hsl(0,0%,100%)]/[0.06] rounded-2xl p-7 flex flex-col hover:border-[hsl(243,100%,68%)]/25 transition-all duration-500 hover:glow-neon-soft"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[hsl(243,100%,68%)] text-[hsl(243,100%,68%)]" />
                ))}
              </div>
              <p className="text-[hsl(0,0%,80%)] text-sm leading-relaxed mb-6 flex-1">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[hsl(0,0%,100%)]/[0.05]">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-[hsl(243,100%,68%)]/20"
                />
                <div>
                  <div className="font-semibold text-sm text-[hsl(0,0%,90%)]">{t.name}</div>
                  <div className="text-[hsl(0,0%,70%)] text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
