import { Mail, Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import zordeonWhite from "@/assets/logos/zordeon-white.png";

const productLinks = [
  { label: "Integrações", href: "#features" },
  { label: "Taxas", href: "#pricing" },
  { label: "Benefícios", href: "#tech" },
  { label: "API Docs", href: "#" },
];

const companyLinks = [
  { label: "Sobre", href: "#" },
  { label: "Carreiras", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Contato", href: "#" },
];

export default function LandingFooter() {
  return (
    <footer className="relative bg-[hsl(230,20%,5%)] pt-20 pb-8 px-4 overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-[hsl(243,100%,68%)]/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[80px] bg-[hsl(243,100%,68%)]/5 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand column */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-block mb-5">
              <img src={zordeonWhite} alt="Zordeon" className="h-7 w-auto" />
            </Link>
            <p className="text-[hsl(0,0%,50%)] text-sm leading-relaxed max-w-xs mb-6">
              Infraestrutura de pagamentos inteligente para empresas que querem escalar com segurança e performance.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-[hsl(0,0%,100%)]/[0.04] border border-[hsl(0,0%,100%)]/[0.06] flex items-center justify-center text-[hsl(0,0%,45%)] hover:text-[hsl(243,100%,68%)] hover:border-[hsl(243,100%,68%)]/25 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-[hsl(0,0%,100%)]/[0.04] border border-[hsl(0,0%,100%)]/[0.06] flex items-center justify-center text-[hsl(0,0%,45%)] hover:text-[hsl(243,100%,68%)] hover:border-[hsl(243,100%,68%)]/25 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" aria-label="X (Twitter)" className="w-9 h-9 rounded-lg bg-[hsl(0,0%,100%)]/[0.04] border border-[hsl(0,0%,100%)]/[0.06] flex items-center justify-center text-[hsl(0,0%,45%)] hover:text-[hsl(243,100%,68%)] hover:border-[hsl(243,100%,68%)]/25 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="md:col-span-2">
            <h4 className="font-heading font-semibold text-sm mb-5 text-[hsl(0,0%,85%)]">Produto</h4>
            <div className="space-y-3">
              {productLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-[hsl(0,0%,50%)] hover:text-[hsl(0,0%,80%)] transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h4 className="font-heading font-semibold text-sm mb-5 text-[hsl(0,0%,85%)]">Empresa</h4>
            <div className="space-y-3">
              {companyLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-[hsl(0,0%,50%)] hover:text-[hsl(0,0%,80%)] transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="font-heading font-semibold text-sm mb-5 text-[hsl(0,0%,85%)]">Contato</h4>
            <div className="space-y-4">
              <a href="mailto:contato@zordeon.com" className="flex items-center gap-3 text-sm text-[hsl(0,0%,50%)] hover:text-[hsl(243,100%,68%)] transition-colors duration-300 group">
                <div className="w-9 h-9 rounded-lg bg-[hsl(243,100%,68%)]/8 border border-[hsl(243,100%,68%)]/15 flex items-center justify-center group-hover:border-[hsl(243,100%,68%)]/30 transition-all duration-300">
                  <Mail className="w-4 h-4 text-[hsl(243,100%,68%)]" />
                </div>
                contato@zordeon.com
              </a>
              <a href="tel:+5511999999999" className="flex items-center gap-3 text-sm text-[hsl(0,0%,50%)] hover:text-[hsl(243,100%,68%)] transition-colors duration-300 group">
                <div className="w-9 h-9 rounded-lg bg-[hsl(243,100%,68%)]/8 border border-[hsl(243,100%,68%)]/15 flex items-center justify-center group-hover:border-[hsl(243,100%,68%)]/30 transition-all duration-300">
                  <Phone className="w-4 h-4 text-[hsl(243,100%,68%)]" />
                </div>
                (11) 99999-9999
              </a>
              <a href="#" className="flex items-center gap-3 text-sm text-[hsl(0,0%,50%)] hover:text-[hsl(243,100%,68%)] transition-colors duration-300 group">
                <div className="w-9 h-9 rounded-lg bg-[hsl(243,100%,68%)]/8 border border-[hsl(243,100%,68%)]/15 flex items-center justify-center group-hover:border-[hsl(243,100%,68%)]/30 transition-all duration-300">
                  <MessageCircle className="w-4 h-4 text-[hsl(243,100%,68%)]" />
                </div>
                Chat ao vivo
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[hsl(0,0%,100%)]/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[hsl(0,0%,40%)] text-xs">
            © {new Date().getFullYear()} Zordeon Payments. Todos os direitos reservados.
          </p>
          <div className="flex gap-8 text-xs text-[hsl(0,0%,40%)]">
            <a href="#" className="hover:text-[hsl(0,0%,70%)] transition-colors duration-300">Termos de Uso</a>
            <a href="#" className="hover:text-[hsl(0,0%,70%)] transition-colors duration-300">Política de Privacidade</a>
            <a href="#" className="hover:text-[hsl(0,0%,70%)] transition-colors duration-300">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
