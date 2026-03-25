import { cn } from "@/lib/utils";

type StatusType = "approved" | "pending" | "cancelled";

const styles: Record<StatusType, string> = {
  approved: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  cancelled: "bg-destructive/10 text-destructive",
};

const labels: Record<StatusType, string> = {
  approved: "Aprovado",
  pending: "Pendente",
  cancelled: "Cancelado",
};

export function StatusBadge({ status }: { status: StatusType }) {
  return (
    <span className={cn("status-badge", styles[status])}>
      <span className={cn("w-1.5 h-1.5 rounded-full", {
        "bg-success": status === "approved",
        "bg-warning": status === "pending",
        "bg-destructive": status === "cancelled",
      })} />
      {labels[status]}
    </span>
  );
}
