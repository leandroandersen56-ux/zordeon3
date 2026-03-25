import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, LogIn, ArrowRight } from "lucide-react";
import zordeonWhite from "@/assets/logos/zordeon-white.png";

const navLinks = [
  { label: "Integrações", href: "#features" },
  { label: "Taxas", href: "#pricing" },
  { label: "Por que nos escolher", href: "#tech" },
  { label: "FAQ", href: "#faq" },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top announcement banner */}
      <div className="section-dark border-b border-[hsl(243,100%,68%)]/10 text-center py-2.5 px-4 text-sm text-[hsl(0,0%,80%)]">
        Você fatura acima de 100k por mês?{" "}
        <Link to="/auth" className="text-[hsl(243,100%,68%)] font-semibold hover:underline inline-flex items-center gap-1 ml-1">
          Converse com nosso time para migrar! <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[hsl(230,25%,5%)]/95 backdrop-blur-xl border-b border-[hsl(0,0%,100%)]/5 shadow-[0_4px_30px_-5px_hsl(0,0%,0%,0.5)]"
            : "bg-[hsl(230,25%,5%)]/50 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={zordeonWhite} alt="Zordeon" className="h-[22px] sm:h-[30px] w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 text-sm text-[hsl(0,0%,80%)]">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3.5 py-2 rounded-lg hover:text-[hsl(0,0%,100%)] hover:bg-[hsl(0,0%,100%)]/[0.04] transition-all duration-300"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="text-sm text-[hsl(0,0%,80%)] hover:text-[hsl(0,0%,100%)] transition-colors duration-300 hidden sm:flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Fazer login
            </Link>
            <Link
              to="/auth"
              className="btn-primary-animated glow-primary flex items-center gap-2 group !px-5 !py-2.5 !text-sm"
            >
              Criar conta
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
            <button
              className="lg:hidden text-[hsl(0,0%,60%)]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-[hsl(230,25%,5%)]/98 backdrop-blur-xl border-b border-[hsl(0,0%,100%)]/5 px-4 pb-4 space-y-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-[hsl(0,0%,80%)] hover:text-[hsl(0,0%,100%)] hover:bg-[hsl(0,0%,100%)]/[0.04] rounded-lg px-3 py-2.5 transition-colors duration-300"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
