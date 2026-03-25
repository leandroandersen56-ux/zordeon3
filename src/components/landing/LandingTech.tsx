import { motion } from "framer-motion";
import { MechaCheckCircle, MechaShield, MechaZap, MechaArrowUpRight, MechaRepeat, MechaMonitor } from "./MechaIcons";
import StarfieldBackground from "./StarfieldBackground";
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const cards = [
  {
    icon: MechaZap,
    iconSize: 24,
    title: "Processamento rápido e estável",
    desc: "Garantia de alta performance em transações, mesmo em volumes elevados.",
    span: "md:col-span-1",
  },
  {
    icon: MechaShield,
    iconSize: 28,
    title: "Segurança robusta",
    desc: "Mecanismos antifraude em tempo real, com inteligência adaptativa e cobertura para disputas.",
    span: "md:col-span-1",
  },
  {
    icon: MechaRepeat,
    iconSize: 22,
    title: "Flexibilidade operacional",
    desc: "Pagamentos com Pix e Cartões, com APIs que se adaptam à sua lógica de operação.",
    span: "md:col-span-1",
  },
  {
    icon: MechaArrowUpRight,
    iconSize: 24,
    title: "Taxas competitivas",
    desc: "Mais margem para o seu negócio e previsibilidade financeira.",
    span: "md:col-span-1",
  },
  {
    icon: MechaMonitor,
    iconSize: 22,
    title: "Interface intuitiva e fluída",
    desc: "Experiência simples e eficiente para sua equipe e seus clientes.",
    span: "md:col-span-1",
  },
];

export default function LandingTech() {
  return (
    <section id="tech" className="section-dark py-24 sm:py-32 px-4 relative overflow-hidden">
      <StarfieldBackground />
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-[hsl(243,100%,68%)]/4 rounded-full blur-[200px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(243,100%,68%)]/20 bg-[hsl(243,100%,68%)]/5 text-[hsl(0,0%,85%)] text-xs font-medium mb-6">
            <MechaCheckCircle size={14} className="text-[hsl(243,100%,68%)]" /> Por que escolher a Zordeon?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight heading-fade-dark" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
            Tecnologia que{" "}
            <span className="gradient-text font-medium">entrega resultado.</span>
          </h2>
          <p className="text-[hsl(0,0%,60%)] text-base mt-4 max-w-3xl leading-relaxed">
            A Zordeon foi criada para atender empresas que exigem mais do que o básico. Nossa plataforma
            vai além do processamento de pagamentos — entregamos uma solução completa, segura e
            escalável, com a agilidade que o seu negócio digital precisa.
          </p>
        </motion.div>

        {/* Top row: 2 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {cards.slice(0, 2).map((c, i) => (
            <motion.div
              key={c.title}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="group relative rounded-2xl p-8 border border-[hsl(0,0%,100%)]/[0.06] hover:border-[hsl(243,100%,68%)]/25 transition-all duration-500 bg-gradient-to-b from-[hsl(230,20%,10%)] to-[hsl(230,20%,7%)]"
            >
              <div className="w-14 h-14 rounded-2xl bg-[hsl(243,100%,68%)]/8 border border-[hsl(243,100%,68%)]/15 flex items-center justify-center mb-6 group-hover:border-[hsl(243,100%,68%)]/30 group-hover:shadow-[0_0_25px_-5px_hsl(243,100%,68%,0.3)] transition-all duration-500">
                <c.icon size={c.iconSize} className="text-[hsl(243,100%,68%)]" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3 text-[hsl(0,0%,92%)]">{c.title}</h3>
              <p className="text-[hsl(0,0%,55%)] text-sm leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom row: 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.slice(2).map((c, i) => (
            <motion.div
              key={c.title}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 2}
              className="group relative rounded-2xl p-7 border border-[hsl(0,0%,100%)]/[0.06] hover:border-[hsl(243,100%,68%)]/25 transition-all duration-500 bg-gradient-to-b from-[hsl(230,20%,10%)] to-[hsl(230,20%,7%)]"
            >
              <div className="w-12 h-12 rounded-xl bg-[hsl(243,100%,68%)]/8 border border-[hsl(243,100%,68%)]/15 flex items-center justify-center mb-5 group-hover:border-[hsl(243,100%,68%)]/30 group-hover:shadow-[0_0_20px_-5px_hsl(243,100%,68%,0.3)] transition-all duration-500">
                <c.icon size={c.iconSize} className="text-[hsl(243,100%,68%)]" />
              </div>
              <h3 className="font-heading font-bold text-lg mb-2 text-[hsl(0,0%,92%)]">{c.title}</h3>
              <p className="text-[hsl(0,0%,55%)] text-sm leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
