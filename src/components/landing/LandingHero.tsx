import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowRight, MessageCircle } from "lucide-react";
import heroDashboard from "@/assets/landing/hero-dashboard.png";
import StarfieldBackground from "./StarfieldBackground";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: "easeOut" as const },
  }),
};

export default function LandingHero() {
  return (
    <section className="section-dark relative pt-20 sm:pt-28 pb-16 sm:pb-24 px-4 overflow-hidden">
      {/* Starfield canvas */}
      <StarfieldBackground />

      {/* Animated mesh background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="mesh-animate absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-[hsl(243,100%,68%)]/10 rounded-full blur-[250px]" />
        <div className="mesh-animate absolute top-0 left-1/4 w-[500px] h-[500px] bg-[hsl(280,80%,60%)]/6 rounded-full blur-[200px]" style={{ animationDelay: '-5s' }} />
        <div className="mesh-animate absolute bottom-0 right-1/4 w-[600px] h-[500px] bg-[hsl(247,100%,74%)]/6 rounded-full blur-[200px]" style={{ animationDelay: '-10s' }} />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(243 100% 68% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(243 100% 68% / 0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
        {/* Badge */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(243,100%,68%)]/20 bg-[hsl(243,100%,68%)]/5 text-[hsl(0,0%,85%)] text-xs font-medium mb-8 backdrop-blur-sm">
            <Shield className="w-3.5 h-3.5 text-[hsl(243,100%,68%)]" /> Segurança, visão e controle em cada transação.
          </span>
        </motion.div>

        {/* Heading with center-to-edge gradient */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-[1.15] tracking-tight mb-6"
          style={{ fontFamily: "'Monument Extended', sans-serif" }}
        >
          <span className="text-[hsl(0,0%,92%)]">Pagamentos inteligentes</span>
          <br />
          <span className="gradient-text">com controle <br className="sm:hidden" />total.</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="text-[hsl(0,0%,80%)] text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Desenvolvida para negócios que não podem parar, nossa tecnologia combina automação inteligente,
          checkout otimizado e performance contínua para maximizar conversões com total segurança.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
        >
          <Link
            to="/auth"
            className="btn-primary-animated glow-primary flex items-center justify-center gap-2 group"
          >
            Criar minha conta
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <a
            href="#features"
            className="btn-outline-animated text-[hsl(0,0%,85%)] hover:text-[hsl(0,0%,100%)] flex items-center justify-center gap-2 bg-[hsl(0,0%,100%)]/3"
          >
            <MessageCircle className="w-4 h-4" />
            Falar com um especialista
          </a>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={4}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute -inset-8 bg-gradient-to-b from-[hsl(243,100%,68%)]/15 via-[hsl(247,100%,74%)]/8 to-transparent rounded-3xl blur-3xl" />
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[hsl(243,100%,68%)]/30 via-[hsl(243,100%,68%)]/10 to-transparent" />
          <div className="relative rounded-2xl overflow-hidden glow-neon-soft m-[1px]">
            <div className="h-9 bg-[hsl(230,20%,8%)] border-b border-[hsl(0,0%,100%)]/5 flex items-center gap-2 px-4">
              <div className="w-3 h-3 rounded-full bg-[hsl(243,100%,68%)]/50" />
              <div className="w-3 h-3 rounded-full bg-[hsl(243,100%,68%)]/30" />
              <div className="w-3 h-3 rounded-full bg-[hsl(243,100%,68%)]/15" />
              <span className="ml-3 text-[10px] text-[hsl(0,0%,35%)] font-mono">dashboard.zordeon.com</span>
            </div>
            <img
              src={heroDashboard}
              alt="Zordeon Dashboard — Painel de controle de pagamentos"
              className="w-full"
              loading="eager"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
