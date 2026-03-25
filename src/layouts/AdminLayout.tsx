import { useState, useEffect, createContext, useContext } from "react";
import { Outlet, useLocation, Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, Users, ShoppingCart, Percent, Wallet, ScrollText,
  Shield, Server, Store, AlertTriangle, Landmark, Gavel, Settings,
  ChevronLeft, ChevronRight, Menu, X, Bell, Moon, Sun, LogOut, Home, BookOpen, CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import zordeonDark from "@/assets/logos/zordeon-dark.png";
import zordeonWhite from "@/assets/logos/zordeon-white.png";

const adminNav = [
  { key: "overview", label: "Visão Geral", icon: LayoutDashboard, path: "/admin" },
  { key: "providers", label: "Provedores", icon: Server, path: "/admin/provedores" },
  { key: "merchants", label: "Merchants", icon: Store, path: "/admin/merchants" },
  { key: "transactions", label: "Transações", icon: ShoppingCart, path: "/admin/transacoes" },
  { key: "risk", label: "Risco", icon: AlertTriangle, path: "/admin/risco" },
  { key: "disputes", label: "Disputas", icon: Gavel, path: "/admin/disputas" },
  { key: "settlements", label: "Liquidações", icon: Landmark, path: "/admin/liquidacoes" },
  { key: "withdrawals", label: "Saques", icon: Wallet, path: "/admin/saques" },
  { key: "users", label: "Usuários", icon: Users, path: "/admin/usuarios" },
  { key: "fees", label: "Taxas", icon: Percent, path: "/admin/taxas" },
  { key: "system", label: "Sistema", icon: Settings, path: "/admin/sistema" },
  { key: "payments", label: "Pagamentos", icon: CreditCard, path: "/admin/pagamentos" },
  { key: "audit", label: "Auditoria", icon: ScrollText, path: "/admin/auditoria" },
  { key: "docs", label: "Documentação", icon: BookOpen, path: "/admin/docs" },
];

export default function AdminLayout() {
  const { isAdmin, loading, profile, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem("zordeon-dark-mode");
    if (saved !== null) return saved === "true";
    return document.documentElement.classList.contains("dark");
  });
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem("zordeon-dark-mode", String(darkMode));
  }, [darkMode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  const toggleDark = () => {
    setDarkMode((prev) => !prev);
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={cn(
      "flex flex-col border-r border-sidebar-border bg-sidebar shrink-0",
      mobile ? "w-[220px]" : cn("transition-all duration-300", collapsed ? "w-16" : "w-60")
    )}>
      <div className="flex items-center justify-between p-4 h-16">
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2">
            <img src={darkMode ? zordeonWhite : zordeonDark} alt="Zordeon" className="h-7 w-auto" />
          </div>
        )}
        {(collapsed && !mobile) && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <Shield size={16} className="text-primary-foreground" />
          </div>
        )}
        {mobile ? (
          <button onClick={() => setMobileOpen(false)} className="p-1 rounded-md hover:bg-muted text-muted-foreground">
            <X size={18} />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors",
              collapsed && "absolute left-16 -ml-3 top-4 z-10 bg-card border border-border shadow-sm"
            )}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {(!collapsed || mobile) && (
        <div className="mx-4 mb-2">
          <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors">
            <Home size={14} />
            Voltar ao Dashboard
          </Link>
        </div>
      )}

      {(!collapsed || mobile) && (
        <p className="px-4 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Administração</p>
      )}

      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {adminNav.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => mobile && setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-muted/60 hover:text-sidebar-foreground"
              )}
            >
              <item.icon size={18} className={cn(active && "text-primary")} />
              {(!collapsed || mobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 left-0 bottom-0 z-50 md:hidden"
            >
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-border bg-card/60 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors text-foreground">
              <Menu size={20} />
            </button>
            <span className="font-heading font-semibold text-foreground text-base">Painel Admin</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            <span className="text-sm text-muted-foreground">Administração <span className="mx-1">/</span>
              <span className="text-foreground font-medium">
                {adminNav.find(n => n.path === location.pathname)?.label || "Visão Geral"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <span className="hidden md:flex items-center gap-1 text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
              <Shield size={12} /> Admin
            </span>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <Bell size={18} />
            </button>
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hidden md:flex">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-heading font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground leading-none">{profile?.full_name || "Admin"}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
