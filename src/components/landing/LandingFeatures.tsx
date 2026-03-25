import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MechaCreditCard, MechaQrCode, MechaDownload } from "./MechaIcons";
import featurePayments from "@/assets/landing/feature-payments.jpg";
import featurePix from "@/assets/landing/feature-pix.jpg";
import featureCrypto from "@/assets/landing/feature-crypto.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  {
    num: "001",
    icon: MechaCreditCard,
    title: "Facilite Pagamentos com Agilidade e Segurança",
    desc: "Concentre todos os seus métodos de pagamento em uma única integração. Aceite Pix, cartões, crypto e muito mais com automação total, gestão centralizada e proteção antifraude em tempo real.",
    image: featurePayments,
  },
  {
    num: "002",
    icon: MechaQrCode,
    title: "Pix via API: Instantâneo e Integrado ao Seu Sistema",
    desc: "Receba pagamentos via Pix com confirmação automática, QR Code dinâmico e integração fácil. Reduza custos, elimine erros manuais e acelere seu fluxo de caixa com uma API estável.",
    image: featurePix,
  },
  {
    num: "003",
    icon: MechaDownload,
    title: "Saque em Cripto: Liberdade Para Seus Usuários",
    desc: "Permita que seus clientes ou parceiros saquem em criptomoedas com conversão automática e envio seguro para qualquer carteira. Liquidez imediata e sem fronteiras.",
    image: featureCrypto,
  },
];

export default function LandingFeatures() {
  return (
    <section id="features" className="bg-white py-24 sm:py-32 px-4 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[hsl(243,100%,68%)]/4 rounded-full blur-[200px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(243,100%,68%)]/20 bg-[hsl(243,100%,68%)]/5 text-[hsl(243,100%,68%)] text-xs font-medium mb-6">
            <MechaCreditCard size={14} className="text-[hsl(243,100%,68%)]" /> Pagamentos sem complicação
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-[hsl(230,15%,15%)]" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
            Mais eficiência para seu
            <br />
            <span className="gradient-text font-medium">negócio digital crescer</span>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.num}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="group relative rounded-2xl overflow-hidden border border-[hsl(230,20%,90%)] hover:border-[hsl(243,100%,68%)]/30 transition-all duration-500 bg-white shadow-[0_1px_3px_hsl(230,20%,90%)] flex flex-col"
            >
              {/* Image */}
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={f.image}
                  alt={f.title}
                  className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-6 lg:p-7 flex flex-col flex-1">
                <div className="w-11 h-11 rounded-xl bg-[hsl(243,100%,68%)]/10 border border-[hsl(243,100%,68%)]/15 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_-5px_hsl(243,100%,68%,0.25)] transition-all duration-500">
                  <f.icon size={20} className="text-[hsl(243,100%,68%)]" />
                </div>
                <h3 className="font-heading font-bold text-base lg:text-lg mb-2 text-[hsl(230,15%,15%)] leading-snug">{f.title}</h3>
                <p className="text-[hsl(230,10%,50%)] text-sm leading-relaxed mb-6 flex-1">{f.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-[hsl(230,10%,75%)] font-mono">{f.num}</span>
                  <ArrowRight className="w-5 h-5 text-[hsl(230,10%,75%)] group-hover:text-[hsl(243,100%,68%)] group-hover:translate-x-1.5 transition-all duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
