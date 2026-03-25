import { motion } from "framer-motion";
import { Zap, Sparkles } from "lucide-react";
import qrPhone from "@/assets/landing/qr-phone.png";

export default function LandingQRCode() {
  return (
    <section className="section-dark py-0 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(243,100%,68%)]/8 rounded-full blur-[250px] pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-[hsl(280,80%,60%)]/4 rounded-full blur-[200px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(243,100%,68%)]/20 bg-[hsl(243,100%,68%)]/5 text-[hsl(0,0%,85%)] text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[hsl(243,100%,68%)]" /> Novidade Zordeon
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-normal leading-tight mb-6 heading-fade-dark" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
              Pague via{" "}
              <span className="gradient-text font-medium">QR Code</span>
            </h2>
            <p className="text-[hsl(0,0%,80%)] text-base leading-relaxed mb-8 max-w-md">
              Agora você também pode usar o saldo da sua conta no gateway para pagar por QR Code
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-[hsl(0,0%,100%)]/[0.04] border border-[hsl(243,100%,68%)]/15 backdrop-blur-sm neon-border">
              <Zap className="w-5 h-5 text-[hsl(243,100%,68%)]" />
              <span className="text-sm text-[hsl(0,0%,80%)] font-medium">
                Rápido, direto e sem precisar sair da plataforma.
              </span>
            </div>
          </motion.div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[hsl(243,100%,68%)]/15 rounded-full blur-[100px] pointer-events-none" />
            <img
              src={qrPhone}
              alt="QR Code Payment - Zordeon"
              className="relative w-full max-w-[620px] drop-shadow-[0_0_80px_hsl(243,100%,68%,0.25)] float-animate"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
