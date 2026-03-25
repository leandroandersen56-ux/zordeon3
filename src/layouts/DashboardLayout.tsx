import { useState, useEffect, createContext, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { MobileDrawer } from "@/components/MobileDrawer";
import { AnimatePresence, motion } from "framer-motion";

interface LayoutContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (v: boolean) => void;
}

export const LayoutContext = createContext<LayoutContextType>({
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
  darkMode: true,
  setDarkMode: () => {},
  mobileDrawerOpen: false,
  setMobileDrawerOpen: () => {},
});

export const useLayout = () => useContext(LayoutContext);

const pageTitles: Record<string, string> = {
  "/dashboard": "Início",
  "/carteira": "Carteira",
  "/vendas": "Minhas Vendas",
  "/clientes": "Clientes",
  "/taxas": "Taxas",
  "/integracoes": "Integrações",
  "/links": "Links de Pagamento",
  "/configuracoes": "Configurações",
  
  "/empresa": "Sua Empresa",
};

export const usePageTitle = () => {
  const location = useLocation();
  return pageTitles[location.pathname] || "Início";
};

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem("zordeon-dark-mode");
    if (saved !== null) return saved === "true";
    return document.documentElement.classList.contains("dark");
  });
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem("zordeon-dark-mode", String(darkMode));
  }, [darkMode]);

  const toggleDark = (v: boolean) => {
    setDarkMode(v);
  };

  return (
    <LayoutContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed, darkMode, setDarkMode: toggleDark, mobileDrawerOpen, setMobileDrawerOpen }}>
      <div className="flex min-h-screen w-full bg-background">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        {/* Mobile drawer */}
        <MobileDrawer />
        <div className="flex flex-1 flex-col min-w-0">
          <AppHeader />
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
    </LayoutContext.Provider>
  );
}
