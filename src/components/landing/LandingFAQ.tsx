import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, HelpCircle } from "lucide-react";

const faqs = [
  { num: "001", q: "O Zordeon é indicado para qual tipo de negócio?", a: "O Zordeon atende desde startups até grandes operações digitais que necessitam de um gateway robusto, com suporte a PIX, cartões e boleto." },
  { num: "004", q: "As taxas são fixas ou podem ser negociadas?", a: "Nossas taxas são competitivas e podem ser negociadas de acordo com o volume de transações da sua operação. Entre em contato para uma proposta personalizada." },
  { num: "002", q: "Por que o Zordeon retém 20% dos valores recebidos?", a: "A reserva de segurança é uma prática comum no mercado de pagamentos, servindo como proteção contra chargebacks e disputas. Os valores são liberados gradualmente." },
  { num: "005", q: "Como é o suporte técnico do Zordeon?", a: "Oferecemos suporte 24/7 com equipe técnica especializada, disponível via chat, e-mail e telefone prioritário, com SLA garantido." },
  { num: "003", q: "Como funciona a liquidação dos valores recebidos?", a: "Oferecemos liquidação em D+0 para PIX e D+2 para cartão. Você pode configurar a frequência de repasse diretamente no dashboard." },
  { num: "006", q: "A integração da plataforma é complexa?", a: "Não! Nossa API REST é simples e bem documentada. A integração pode ser feita em menos de 1 dia com SDKs para as principais linguagens." },
];

function FAQItem({ num, q, a }: { num: string; q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[hsl(0,0%,100%)] border border-[hsl(230,15%,90%)] rounded-2xl overflow-hidden hover:border-[hsl(243,100%,68%)]/20 transition-all duration-500 hover:shadow-[0_0_30px_-10px_hsl(243,100%,68%,0.08)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between p-6 text-left group"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-mono text-[hsl(230,10%,70%)] bg-[hsl(240,10%,96%)] px-3 py-1 rounded-full border border-[hsl(230,15%,90%)]">{num}</span>
            <Plus
              className={`w-5 h-5 text-[hsl(243,100%,68%)] shrink-0 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
            />
          </div>
          <span className="font-heading font-bold text-sm sm:text-base text-[hsl(230,25%,15%)] group-hover:text-[hsl(243,100%,60%)] transition-colors duration-300">{q}</span>
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-[hsl(230,10%,50%)] text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LandingFAQ() {
  return (
    <section id="faq" className="section-light py-24 sm:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(243,100%,68%)]/15 bg-[hsl(243,100%,68%)]/5 text-[hsl(230,25%,40%)] text-xs font-medium mb-6">
            <HelpCircle className="w-3.5 h-3.5 text-[hsl(243,100%,60%)]" /> FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal heading-fade-light" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
            Dúvidas <span className="gradient-text font-medium">Frequentes</span>
          </h2>
          <p className="text-[hsl(230,10%,50%)] text-base mt-2">Tire suas dúvidas sobre nosso Gateway!</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((f) => (
            <FAQItem key={f.num} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
