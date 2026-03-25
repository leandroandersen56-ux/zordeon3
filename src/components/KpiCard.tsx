import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  subtitle?: string;
  accentClass?: string;
}

export function KpiCard({ title, value, icon, subtitle, accentClass }: KpiCardProps) {
  return (
    <div className="glass-card p-5 md:p-6 flex items-start gap-4">
      <div className={cn("p-3 rounded-xl bg-primary/10 text-primary", accentClass)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
        <p className="text-lg md:text-xl font-heading font-bold text-foreground mt-1">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
