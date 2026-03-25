import { useAdminFees } from "@/hooks/useAdminData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Save, Zap, CreditCard, FileText } from "lucide-react";

export function AdminFees() {
  const { user } = useAuth();
  const { data: fees = [] } = useAdminFees();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Record<string, any>>({});

  const icons: Record<string, any> = { pix: Zap, credit_card: CreditCard, boleto: FileText };
  const colors: Record<string, string> = { pix: "border-l-primary", credit_card: "border-l-violet-500", boleto: "border-l-cyan-500" };

  const startEdit = (fee: any) => {
    setEditing(prev => ({
      ...prev,
      [fee.id]: { fixed_fee: fee.fixed_fee, percentage_fee: fee.percentage_fee, reserve_percentage: fee.reserve_percentage },
    }));
  };

  const saveFee = async (feeId: string) => {
    const edit = editing[feeId];
    if (!edit) return;
    await supabase.from("fee_config").update({
      fixed_fee: Number(edit.fixed_fee),
      percentage_fee: Number(edit.percentage_fee),
      reserve_percentage: Number(edit.reserve_percentage),
      updated_at: new Date().toISOString(),
    }).eq("id", feeId);
    await supabase.from("admin_audit_log").insert({
      admin_id: user!.id, action: "update_fee", target_type: "fee_config", target_id: feeId, details: edit,
    });
    setEditing(prev => { const n = { ...prev }; delete n[feeId]; return n; });
    queryClient.invalidateQueries({ queryKey: ["admin-fees"] });
    toast.success("Taxa atualizada");
  };

  const updateField = (feeId: string, field: string, value: string) => {
    setEditing(prev => ({
      ...prev,
      [feeId]: { ...prev[feeId], [field]: value },
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-semibold text-foreground">Configuração de Taxas</h3>
          <p className="text-xs text-muted-foreground">Gerencie as taxas cobradas por método de pagamento</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fees.map((fee: any) => {
          const Icon = icons[fee.method] || Zap;
          const isEditing = !!editing[fee.id];
          const edit = editing[fee.id] || {};

          return (
            <div key={fee.id} className={`glass-card p-5 border-l-4 ${colors[fee.method] || "border-l-muted"}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon size={18} className="text-muted-foreground" />
                  <h4 className="font-heading font-semibold text-foreground">{fee.label}</h4>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${fee.is_active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                  {fee.is_active ? "Ativo" : "Inativo"}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Taxa fixa (R$)</label>
                  {isEditing ? (
                    <input type="number" step="0.01" value={edit.fixed_fee} onChange={e => updateField(fee.id, "fixed_fee", e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                  ) : (
                    <p className="text-foreground font-medium">R$ {Number(fee.fixed_fee).toFixed(2)}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Taxa percentual (%)</label>
                  {isEditing ? (
                    <input type="number" step="0.01" value={edit.percentage_fee} onChange={e => updateField(fee.id, "percentage_fee", e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                  ) : (
                    <p className="text-foreground font-medium">{Number(fee.percentage_fee).toFixed(2)}%</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Reserva (%)</label>
                  {isEditing ? (
                    <input type="number" step="0.01" value={edit.reserve_percentage} onChange={e => updateField(fee.id, "reserve_percentage", e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                  ) : (
                    <p className="text-foreground font-medium">{Number(fee.reserve_percentage).toFixed(2)}%</p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(prev => { const n = { ...prev }; delete n[fee.id]; return n; })} className="flex-1 py-2 rounded-lg border border-border text-xs text-muted-foreground">Cancelar</button>
                    <button onClick={() => saveFee(fee.id)} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center gap-1"><Save size={12} /> Salvar</button>
                  </div>
                ) : (
                  <button onClick={() => startEdit(fee)} className="w-full py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Editar taxas</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
