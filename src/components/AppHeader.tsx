import { useNavigate } from "react-router-dom";
import { useLayout, usePageTitle } from "@/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Moon, Sun, ChevronDown, Menu, User, Building2, LogOut, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";

export function AppHeader() {
  const { darkMode, setDarkMode, setMobileDrawerOpen } = useLayout();
  const { profile, isAdmin, signOut } = useAuth();
  const pageTitle = usePageTitle();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const menuItems = [
    { label: "Ajustes de perfil", icon: User, action: () => { navigate("/configuracoes"); setDropdownOpen(false); } },
    { label: "Minha empresa", icon: Building2, action: () => { navigate("/empresa"); setDropdownOpen(false); } },
  ];

  return (
    <header className="h-14 border-b border-border bg-card/60 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3 md:hidden">
        <button onClick={() => setMobileDrawerOpen(true)} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors text-foreground">
          <Menu size={20} />
        </button>
        <span className="font-heading font-semibold text-foreground text-base">{pageTitle}</span>
      </div>

      <div className="hidden md:block text-sm text-muted-foreground">
        Recursos <span className="mx-1">/</span>
        <span className="text-foreground font-medium">{pageTitle}</span>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {isAdmin && (
          <span className="hidden md:flex items-center gap-1 text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
            <Shield size={12} /> Admin
          </span>
        )}
        <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <Bell size={18} />
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground flex"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-2 border-l border-border hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-heading font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground leading-none">{profile?.full_name || "Usuário"}</p>
              <p className="text-xs text-muted-foreground">{profile?.email || ""}</p>
            </div>
            <ChevronDown size={14} className={`text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-fade-up">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <item.icon size={16} className="text-muted-foreground" />
                  {item.label}
                </button>
              ))}
              <div className="border-t border-border" />
              <button
                onClick={async () => { await signOut(); navigate("/auth"); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-muted transition-colors"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
