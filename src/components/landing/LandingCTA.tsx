import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import StarfieldBackground from "./StarfieldBackground";

export default function LandingCTA() {
  return (
    <section className="section-dark py-24 sm:py-32 px-4 relative overflow-hidden">
      <StarfieldBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto text-center"
      >
        <div className="relative rounded-3xl p-10 sm:p-16 overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-[hsl(243,100%,68%)]/30 via-[hsl(243,100%,68%)]/10 to-transparent" />
          <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-[hsl(230,20%,9%)] via-[hsl(230,20%,7%)] to-[hsl(230,20%,6%)]" />
          
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-3xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[hsl(243,100%,68%)]/8 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-[hsl(280,80%,60%)]/5 rounded-full blur-[80px]" />
          </div>
          
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal mb-5 leading-tight heading-fade-dark" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
              Escale seus{" "}
              <span className="gradient-text font-medium">pagamentos.</span>
            </h2>
            <p className="text-[hsl(0,0%,80%)] mb-10 max-w-xl mx-auto leading-relaxed">
              Junte-se a milhares de empresas que já confiam no Zordeon para processar seus pagamentos com segurança e eficiência.
            </p>
            <Link
              to="/auth"
              className="btn-primary-animated glow-primary inline-flex items-center gap-2 group text-base"
            >
              Criar Conta Grátis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
