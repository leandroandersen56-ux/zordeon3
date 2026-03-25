import { motion } from "framer-motion";
import neonMech from "@/assets/landing/neon-mech.png";

export default function LandingRobot() {
  return (
    <section className="section-dark py-0 px-0 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(243,100%,68%)]/8 rounded-full blur-[250px] pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-[hsl(280,80%,60%)]/4 rounded-full blur-[200px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image — left side, mirroring QRCode layout */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center order-2 lg:order-1"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[hsl(243,100%,68%)]/15 rounded-full blur-[100px] pointer-events-none" />
            <img
              src={neonMech}
              alt="Zordeon — Infraestrutura de segurança avançada"
              className="relative w-full max-w-[520px] drop-shadow-[0_0_80px_hsl(243,100%,68%,0.25)] float-animate"
              loading="lazy"
            />
          </motion.div>

          {/* Text — right side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2 px-4 lg:px-0"
          >
            <span className="inline-block px-3 py-1 rounded-full border border-[hsl(243,100%,68%)]/20 bg-[hsl(243,100%,68%)]/5 text-xs font-medium text-[hsl(243,100%,68%)] mb-6">
              Tecnologia de ponta
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight mb-6 heading-fade-dark" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
              <span className="gradient-text font-medium">Blindagem</span> para o seu negócio
            </h2>
            <p className="text-[hsl(0,0%,70%)] text-base sm:text-lg leading-relaxed max-w-lg mb-8">
              Nossa plataforma opera com inteligência artificial e monitoramento
              contínuo para garantir máxima segurança, velocidade e disponibilidade
              em cada transação processada.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "99.9%", label: "Uptime garantido" },
                { value: "<200ms", label: "Latência média" },
                { value: "24/7", label: "Monitoramento ativo" },
                { value: "PCI-DSS", label: "Certificação" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-heading font-semibold text-[hsl(0,0%,95%)]">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[hsl(0,0%,50%)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
