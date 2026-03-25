import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DocSearch, ReadingProgress } from "./DocComponents";
import { Menu, X, ChevronDown, ChevronRight, Home, ArrowLeft, BookOpen } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface DocNavSection {
  icon: React.ReactNode;
  label: string;
  id: string;
  children?: { label: string; id: string }[];
}

interface DocLayoutProps {
  title: string;
  backTo: string;
  backLabel: string;
  navSections: DocNavSection[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  onSearch: (q: string) => void;
  children: React.ReactNode;
}

export function DocLayout({ title, backTo, backLabel, navSections, activeSection, onSectionChange, onSearch, children }: DocLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Auto-expand parent of active section
  useEffect(() => {
    for (const section of navSections) {
      if (section.children?.some(c => c.id === activeSection)) {
        setExpanded(prev => ({ ...prev, [section.id]: true }));
      }
    }
  }, [activeSection]);

  const toggleExpand = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const handleNav = (id: string) => {
    onSectionChange(id);
    setMobileOpen(false);
    window.history.replaceState(null, "", `#${id}`);
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex flex-col h-full", mobile ? "w-[260px]" : "w-64 shrink-0")}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-bold text-foreground text-sm flex items-center gap-2"><BookOpen size={16} /> {title}</h2>
          {mobile && (
            <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:bg-muted text-muted-foreground"><X size={16} /></button>
          )}
        </div>
        <DocSearch onSearch={onSearch} />
        <Link
          to={backTo}
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mt-2"
        >
          <ArrowLeft size={12} /> {backLabel}
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {navSections.map((section) => {
          const isParentActive = section.id === activeSection || section.children?.some(c => c.id === activeSection);
          const isExpanded = expanded[section.id];
          const hasChildren = section.children && section.children.length > 0;

          return (
            <div key={section.id}>
              <button
                onClick={() => {
                  if (hasChildren) {
                    toggleExpand(section.id);
                  }
                  handleNav(section.id);
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
                  isParentActive && !hasChildren
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <span className="shrink-0 text-muted-foreground">{section.icon}</span>
                <span className="flex-1 truncate">{section.label}</span>
                {hasChildren && (
                  <span className="shrink-0">{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
                )}
              </button>
              {hasChildren && isExpanded && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-border/50 pl-2">
                  {section.children!.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => handleNav(child.id)}
                      className={cn(
                        "w-full text-left px-2 py-1.5 rounded text-xs transition-colors",
                        child.id === activeSection
                          ? "text-primary font-medium bg-primary/5"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <ReadingProgress />

      {/* Desktop Sidebar */}
      <div className="hidden md:flex border-r border-border bg-card/40 sticky top-0 h-screen overflow-hidden">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.25 }} className="fixed top-0 left-0 bottom-0 z-50 bg-card border-r border-border md:hidden">
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content area */}
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 md:hidden flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            <Menu size={18} />
          </button>
          <span className="font-heading font-semibold text-sm text-foreground truncate">{title}</span>
        </div>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 xl:pr-56">
          {children}
        </div>
      </div>
    </div>
  );
}
