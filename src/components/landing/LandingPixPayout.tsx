import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import pixPayoutWoman from "@/assets/landing/pix-payout-woman.jpg";

export default function LandingPixPayout() {
  return (
    <section className="bg-white py-24 lg:py-32 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(243,100%,68%)]/5 rounded-full blur-[250px] pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-[hsl(280,80%,60%)]/3 rounded-full blur-[200px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Woman image — left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[hsl(243,100%,68%)]/15 rounded-full blur-[100px] pointer-events-none" />
            <img
              src={pixPayoutWoman}
              alt="Zordeon — Saque Pix para qualquer titularidade"
              className="relative w-full max-w-[500px] rounded-2xl shadow-[0_0_60px_-10px_hsl(243,100%,68%,0.3)] object-cover"
              loading="lazy"
            />
          </motion.div>

          {/* Text — right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="px-4 lg:px-0"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(243,100%,68%)]/20 bg-[hsl(243,100%,68%)]/5 text-[hsl(230,10%,45%)] text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[hsl(243,100%,68%)]" /> Flexibilidade total
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight mb-6 text-[hsl(230,20%,15%)]" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
              Saque para qualquer
              <br />
              <span className="gradient-text font-medium">titularidade Pix</span>
            </h2>
            <p className="text-[hsl(230,10%,45%)] text-base sm:text-lg leading-relaxed max-w-lg mb-8">
              Pague usuários, afiliados ou terceiros via Pix, sem depender de
              titularidade da conta. Uma API flexível que resolve a burocracia
              dos repasses com velocidade e segurança.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "D+0", label: "Liquidação instantânea" },
                { value: "24/7", label: "Disponibilidade" },
                { value: "API", label: "Integração simples" },
                { value: "Multi", label: "Qualquer titularidade" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-heading font-semibold text-[hsl(230,20%,15%)]">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[hsl(230,10%,50%)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
