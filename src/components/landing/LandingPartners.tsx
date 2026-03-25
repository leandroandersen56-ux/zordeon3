import { motion } from "framer-motion";
import vtexLogo from "@/assets/logos/vtex.svg";
import magentoLogo from "@/assets/logos/magento.svg";
import partner1 from "@/assets/logos/partner-1.png";
import partner2 from "@/assets/logos/partner-2.png";
import partner3 from "@/assets/logos/partner-3.png";
import partner4 from "@/assets/logos/partner-4.png";

const partners = [
  { name: "VTEX", logo: vtexLogo },
  { name: "Magento", logo: magentoLogo },
  { name: "Partner", logo: partner1 },
  { name: "Partner 2", logo: partner2 },
  { name: "Partner 3", logo: partner3 },
  { name: "Partner 4", logo: partner4 },
];

export default function LandingPartners() {
  const doubled = [...partners, ...partners];

  return (
    <section className="section-dark py-10 border-y border-[hsl(0,0%,100%)]/5 overflow-hidden">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[hsl(230,25%,5%)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[hsl(230,25%,5%)] to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-20 whitespace-nowrap"
        >
          {doubled.map((p, i) => (
            <img
              key={`${p.name}-${i}`}
              src={p.logo}
              alt={p.name}
              className="h-6 sm:h-7 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 select-none"
              style={{ filter: "brightness(0) invert(1)" }}
              draggable={false}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
