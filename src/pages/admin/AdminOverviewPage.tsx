import { useAdminStats } from "@/hooks/useAdminData";
import { AdminOverview } from "@/components/admin/AdminOverview";

export default function AdminOverviewPage() {
  const { data: stats } = useAdminStats();
  return <AdminOverview stats={stats} />;
}
