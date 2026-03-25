import { Link, useLocation } from "react-router-dom";
import zordeonIcon from "@/assets/logos/zordeon-icon.png";
import { useLayout } from "@/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Home, Wallet, ShoppingCart, Users, Percent,
  Plug, Link as LinkIcon, Settings, Building2, X, Shield, QrCode, CreditCard, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { title: "Início", path: "/dashboard", icon: Home },
  { title: "Carteira", path: "/carteira", icon: Wallet },
  { title: "Gerar PIX", path: "/pix", icon: QrCode },
  { title: "Vendas", path: "/vendas", icon: ShoppingCart },
  { title: "Clientes", path: "/clientes", icon: Users },
  { title: "Taxas", path: "/taxas", icon: Percent },
  { title: "Integrações", path: "/integracoes", icon: Plug },
  { title: "Link de Pagamento", path: "/links", icon: LinkIcon },
  { title: "Pagamentos", path: "/configuracoes-pagamento", icon: CreditCard },
  { title: "Configurações", path: "/configuracoes", icon: Settings },
  { title: "Sua Empresa", path: "/empresa", icon: Building2 },
];

export function MobileDrawer() {
  const { mobileDrawerOpen, setMobileDrawerOpen } = useLayout();
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const { data: balance = 0 } = useQuery({
    queryKey: ["mobile-balance", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("transactions").select("amount").eq("status", "approved");
      return (data || []).reduce((s: number, t: any) => s + Number(t.amount), 0);
    },
    enabled: !!user,
  });

  const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

  return (
    <AnimatePresence>
      {mobileDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <motion.aside
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 bottom-0 w-[220px] bg-sidebar border-r border-sidebar-border z-50 flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between p-4 h-14">
              <Link to="/" onClick={() => setMobileDrawerOpen(false)} className="flex items-center gap-2">
                <img src={zordeonIcon} alt="Zordeon" className="w-8 h-8 rounded-lg" />
                <span className="font-heading font-bold text-lg text-sidebar-foreground">Zordeon</span>
              </Link>
              <button onClick={() => setMobileDrawerOpen(false)} className="p-1 rounded-md hover:bg-muted text-muted-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="mx-4 mb-4 p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Minha carteira</p>
              <p className="font-heading font-bold text-foreground">{fmt(balance)}</p>
            </div>

            <p className="px-4 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Recursos</p>

            <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-muted/60 hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon size={18} className={cn(active && "text-primary")} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}

              {/* Docs link */}
              <Link
                to="/dashboard/docs"
                onClick={() => setMobileDrawerOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  location.pathname === "/dashboard/docs"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-muted/60 hover:text-sidebar-foreground"
                )}
              >
                <BookOpen size={18} className={cn(location.pathname === "/dashboard/docs" && "text-primary")} />
                <span>Documentação</span>
              </Link>

              {isAdmin && (
                <>
                  <p className="px-1 pt-4 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Admin</p>
                  <Link
                    to="/admin"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-all"
                  >
                    <Shield size={18} />
                    <span>Painel Admin</span>
                  </Link>
                </>
              )}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
