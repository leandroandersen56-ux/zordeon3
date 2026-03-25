import { Link, useLocation } from "react-router-dom";
import zordeonDark from "@/assets/logos/zordeon-dark.png";
import zordeonWhite from "@/assets/logos/zordeon-white.png";
import zordeonIcon from "@/assets/logos/zordeon-icon.png";
import { useLayout } from "@/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Home, Wallet, ShoppingCart, Users, Percent,
  Plug, Link as LinkIcon, Settings, Building2, ChevronLeft, ChevronRight, Shield, QrCode, CreditCard, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Início", path: "/dashboard", icon: Home },
  { title: "Carteira", path: "/carteira", icon: Wallet },
  { title: "Gerar PIX", path: "/pix", icon: QrCode },
  { title: "Vendas", path: "/vendas", icon: ShoppingCart },
  { title: "Clientes", path: "/clientes", icon: Users },
  { title: "Taxas", path: "/taxas", icon: Percent },
  { title: "Integrações", path: "/integracoes", icon: Plug },
  { title: "Link de Pagamento", path: "/links", icon: LinkIcon },
  
  { title: "Configurações", path: "/configuracoes", icon: Settings },
  { title: "Sua Empresa", path: "/empresa", icon: Building2 },
];

export function AppSidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, darkMode } = useLayout();
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const { data: balance = 0 } = useQuery({
    queryKey: ["sidebar-balance", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("transactions").select("amount").eq("status", "approved");
      return (data || []).reduce((s: number, t: any) => s + Number(t.amount), 0);
    },
    enabled: !!user,
  });

  const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 shrink-0",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center justify-between p-4 h-16">
        {!sidebarCollapsed && (
          <Link to="/" className="flex items-center">
            <img src={darkMode ? zordeonWhite : zordeonDark} alt="Zordeon" className="h-7 w-auto" />
          </Link>
        )}
        {sidebarCollapsed && (
          <Link to="/" className="mx-auto">
            <img src={zordeonIcon} alt="Zordeon" className="h-8 w-8 rounded-lg" />
          </Link>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={cn(
            "p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors",
            sidebarCollapsed && "absolute left-16 -ml-3 top-4 z-10 bg-card border border-border shadow-sm"
          )}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {!sidebarCollapsed && (
        <div className="mx-4 mb-4 p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground">Minha carteira</p>
          <p className="font-heading font-bold text-foreground">{fmt(balance)}</p>
        </div>
      )}

      {!sidebarCollapsed && (
        <p className="px-4 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Recursos</p>
      )}

      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-muted/60 hover:text-sidebar-foreground"
              )}
            >
              <item.icon size={18} className={cn(active && "text-primary")} />
              {!sidebarCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}

        {/* Docs link */}
        <Link
          to="/dashboard/docs"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
            location.pathname === "/dashboard/docs"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-muted/60 hover:text-sidebar-foreground"
          )}
        >
          <BookOpen size={18} className={cn(location.pathname === "/dashboard/docs" && "text-primary")} />
          {!sidebarCollapsed && <span>Documentação</span>}
        </Link>

        {/* Admin link - separate section */}
        {isAdmin && (
          <>
            {!sidebarCollapsed && (
              <p className="px-1 pt-4 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Admin</p>
            )}
            <Link
              to="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-primary hover:bg-primary/10"
            >
              <Shield size={18} />
              {!sidebarCollapsed && <span>Painel Admin</span>}
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
