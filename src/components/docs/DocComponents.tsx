import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy, Search, ChevronRight, AlertTriangle, AlertCircle, Lightbulb } from "lucide-react";

// ── Method Badge ──
export function MethodBadge({ method }: { method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH" }) {
  const colors: Record<string, string> = {
    GET: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    POST: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
    PUT: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    PATCH: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border", colors[method] || colors.GET)}>
      {method}
    </span>
  );
}

// ── Code Block ──
export function CodeBlock({ code, language = "javascript", title }: { code: string; language?: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-lg border border-border overflow-hidden my-4 bg-card/60">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
          <span className="text-xs font-mono text-muted-foreground">{title || language}</span>
          <button onClick={copy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            {copied ? <><Check size={12} /> Copiado!</> : <><Copy size={12} /> Copiar</>}
          </button>
        </div>
      )}
      {!title && (
        <div className="flex justify-end px-4 py-1.5 border-b border-border bg-muted/30">
          <button onClick={copy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            {copied ? <><Check size={12} /> Copiado!</> : <><Copy size={12} /> Copiar</>}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm font-mono text-foreground/90 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ── Alert Box ──
type AlertLevel = "critical" | "warning" | "tip";
export function AlertBox({ level, title, children }: { level: AlertLevel; title?: string; children: React.ReactNode }) {
  const styles: Record<AlertLevel, { bg: string; border: string; icon: React.ReactNode; defaultTitle: string }> = {
    critical: {
      bg: "bg-red-500/10", border: "border-red-500/30",
      icon: <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />,
      defaultTitle: "CRÍTICO",
    },
    warning: {
      bg: "bg-amber-500/10", border: "border-amber-500/30",
      icon: <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />,
      defaultTitle: "ATENÇÃO",
    },
    tip: {
      bg: "bg-emerald-500/10", border: "border-emerald-500/30",
      icon: <Lightbulb size={16} className="text-emerald-400 shrink-0 mt-0.5" />,
      defaultTitle: "DICA",
    },
  };
  const s = styles[level];
  return (
    <div className={cn("rounded-lg border p-4 my-4 flex gap-3", s.bg, s.border)}>
      {s.icon}
      <div className="text-sm">
        <p className="font-semibold text-foreground mb-1">{title || s.defaultTitle}</p>
        <div className="text-muted-foreground leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

// ── Responsive Table ──
export function DocTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-4 rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40">
            {headers.map((h, i) => (
              <th key={i} className="text-left px-4 py-2.5 font-semibold text-foreground border-b border-border whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-muted/20 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2.5 text-muted-foreground border-b border-border/50 whitespace-nowrap">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Breadcrumb ──
export function DocBreadcrumb({ items }: { items: string[] }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={12} />}
          <span className={i === items.length - 1 ? "text-foreground font-medium" : ""}>{item}</span>
        </span>
      ))}
    </div>
  );
}

// ── Search Bar ──
export function DocSearch({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState("");
  useEffect(() => { onSearch(query); }, [query]);
  return (
    <div className="relative mb-4">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar na documentação...   ⌘K"
        className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-muted/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
      />
    </div>
  );
}

// ── Table of Contents (floating anchor index) ──
export function TableOfContents({ items, activeId }: { items: { id: string; label: string }[]; activeId?: string }) {
  return (
    <div className="hidden xl:block fixed right-6 top-32 w-48">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Nesta página</p>
      <nav className="space-y-1 border-l border-border pl-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
              window.history.replaceState(null, "", `#${item.id}`);
            }}
            className={cn(
              "block text-xs py-1 transition-colors",
              activeId === item.id ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

// ── Reading Progress Bar ──
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-muted/30">
      <div className="h-full bg-primary transition-all duration-150" style={{ width: `${progress}%` }} />
    </div>
  );
}

// ── Section Component ──
export function DocSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 mb-12">
      <h2 className="text-xl font-bold text-foreground mb-4 font-heading">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
