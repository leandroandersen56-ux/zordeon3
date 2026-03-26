import { useImpersonation } from "@/contexts/ImpersonationContext";
import { X, Eye } from "lucide-react";

export function ImpersonationBanner() {
  const { isImpersonating, impersonatedProfile, stopImpersonation } = useImpersonation();

  if (!isImpersonating) return null;

  return (
    <div className="bg-warning/20 border-b border-warning/40 px-4 py-2 flex items-center justify-between gap-3 z-50">
      <div className="flex items-center gap-2 text-sm text-warning font-medium">
        <Eye size={16} />
        <span>
          Visualizando como: <strong>{impersonatedProfile?.full_name || impersonatedProfile?.email || "..."}</strong>
        </span>
      </div>
      <button
        onClick={stopImpersonation}
        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-warning text-warning-foreground text-xs font-medium hover:bg-warning/80 transition-colors"
      >
        <X size={14} />
        Sair
      </button>
    </div>
  );
}
