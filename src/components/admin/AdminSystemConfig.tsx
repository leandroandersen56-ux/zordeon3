import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Settings, Save, Plus, X, AlertTriangle, Globe, Lock, Zap, Database, Server, Clock } from "lucide-react";

const defaultSettings = [
  { key: "maintenance_mode", value: "false", description: "Ativa modo manutenção (bloqueia novas transações)" },
  { key: "api_rate_limit", value: "100", description: "Limite de requisições por minuto por merchant" },
  { key: "api_version", value: "v1", description: "Versão atual da API pública" },
  { key: "min_pix_amount", value: "1.00", description: "Valor mínimo para transação PIX (R$)" },
  { key: "max_pix_amount", value: "50000.00", description: "Valor máximo para transação PIX (R$)" },
  { key: "min_card_amount", value: "5.00", description: "Valor mínimo para transação Cartão (R$)" },
  { key: "max_card_amount", value: "100000.00", description: "Valor máximo para transação Cartão (R$)" },
  { key: "default_settlement_cycle", value: "D+1", description: "Ciclo de liquidação padrão para novos merchants" },
  { key: "auto_approve_kyc", value: "false", description: "Aprovar KYC automaticamente" },
  { key: "require_email_verification", value: "true", description: "Exigir verificação de email no cadastro" },
  { key: "webhook_retry_count", value: "3", description: "Número de tentativas de reenvio de webhook" },
  { key: "webhook_retry_interval", value: "60", description: "Intervalo entre tentativas de webhook (segundos)" },
  { key: "sandbox_enabled", value: "true", description: "Permitir modo sandbox para merchants" },
  { key: "pix_expiration_minutes", value: "30", description: "Tempo de expiração do QR Code PIX (minutos)" },
  { key: "boleto_expiration_days", value: "3", description: "Dias para vencimento do boleto" },
  { key: "max_refund_days", value: "90", description: "Prazo máximo para estorno (dias)" },
  { key: "chargeback_alert_threshold", value: "0.5", description: "Threshold de alerta de chargeback (%)" },
  { key: "fraud_score_threshold", value: "80", description: "Score mínimo para bloquear transação por fraude" },
];

const iconMap: Record<string, any> = {
  maintenance: AlertTriangle, api: Globe, pix: Zap, card: Lock,
  settlement: Clock, kyc: Lock, webhook: Server, sandbox: Database,
  boleto: Database, refund: Clock, chargeback: AlertTriangle, fraud: AlertTriangle,
  default: Settings, require: Lock, max: AlertTriangle, min: Zap,
};

function getIcon(key: string) {
  for (const [k, icon] of Object.entries(iconMap)) {
    if (key.includes(k)) return icon;
  }
  return Settings;
}

export function AdminSystemConfig() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [showInit, setShowInit] = useState(false);

  const { data: settings = [] } = useQuery({
    queryKey: ["admin-system-settings"],
    queryFn: async () => { const { data } = await supabase.from("system_settings").select("*").order("key"); return data || []; },
  });

  const initDefaults = async () => {
    const existing = settings.map((s: any) => s.key);
    const toInsert = defaultSettings.filter(d => !existing.includes(d.key)).map(d => ({ ...d, updated_by: user!.id }));
    if (toInsert.length === 0) { toast.info("Todas as configurações já existem"); return; }
    await supabase.from("system_settings").insert(toInsert);
    qc.invalidateQueries({ queryKey: ["admin-system-settings"] });
    toast.success(`${toInsert.length} configurações inicializadas`);
  };

  const saveSetting = async (id: string, key: string) => {
    const value = editing[id];
    if (value === undefined) return;
    await supabase.from("system_settings").update({ value, updated_by: user!.id, updated_at: new Date().toISOString() }).eq("id", id);
    await supabase.from("admin_audit_log").insert({ admin_id: user!.id, action: "update_system_setting", target_type: "system_setting", target_id: id, details: { key, value } });
    setEditing(prev => { const n = { ...prev }; delete n[id]; return n; });
    qc.invalidateQueries({ queryKey: ["admin-system-settings"] });
    toast.success(`${key} atualizado`);
  };

  const isMaintenanceOn = settings.find((s: any) => s.key === "maintenance_mode")?.value === "true";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-semibold text-foreground text-lg">Configurações do Sistema</h3>
          <p className="text-xs text-muted-foreground">Parâmetros globais do gateway: limites, API, antifraude, liquidação</p>
        </div>
        <button onClick={initDefaults} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Database size={15} /> Inicializar Padrões
        </button>
      </div>

      {/* Maintenance alert */}
      {isMaintenanceOn && (
        <div className="glass-card p-4 border-2 border-warning/30 bg-warning/5 flex items-center gap-3">
          <AlertTriangle size={20} className="text-warning shrink-0" />
          <div>
            <p className="text-sm font-medium text-warning">MODO MANUTENÇÃO ATIVO</p>
            <p className="text-xs text-muted-foreground">Novas transações estão sendo bloqueadas. Desative quando o sistema estiver estável.</p>
          </div>
        </div>
      )}

      {/* Settings grid */}
      {settings.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Settings size={40} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground mb-2">Nenhuma configuração encontrada</p>
          <p className="text-xs text-muted-foreground mb-4">Clique em "Inicializar Padrões" para criar as configurações do gateway</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {settings.map((s: any) => {
            const isEditing = editing[s.id] !== undefined;
            const Icon = getIcon(s.key);
            const isBool = s.value === "true" || s.value === "false";
            const isDanger = s.key === "maintenance_mode" && s.value === "true";
            return (
              <div key={s.id} className={`glass-card p-4 ${isDanger ? "border-2 border-warning/30" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted shrink-0 mt-0.5"><Icon size={14} className="text-foreground" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground font-mono">{s.key}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                    <div className="mt-2">
                      {isEditing ? (
                        <div className="flex gap-2">
                          {isBool ? (
                            <select value={editing[s.id]} onChange={e => setEditing(prev => ({ ...prev, [s.id]: e.target.value }))} className="flex-1 px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                              <option value="true">true</option><option value="false">false</option>
                            </select>
                          ) : (
                            <input value={editing[s.id]} onChange={e => setEditing(prev => ({ ...prev, [s.id]: e.target.value }))} className="flex-1 px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                          )}
                          <button onClick={() => saveSetting(s.id, s.key)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium"><Save size={12} /></button>
                          <button onClick={() => setEditing(prev => { const n = { ...prev }; delete n[s.id]; return n; })} className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground"><X size={12} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${isBool ? (s.value === "true" ? "text-success" : "text-muted-foreground") : "text-foreground"} ${isBool ? `px-2 py-0.5 rounded-full text-xs ${s.value === "true" ? "bg-success/10" : "bg-muted"}` : ""}`}>
                            {s.value}
                          </span>
                          <button onClick={() => setEditing(prev => ({ ...prev, [s.id]: s.value }))} className="text-xs text-primary hover:underline ml-auto">Editar</button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Atualizado: {new Date(s.updated_at).toLocaleString("pt-BR")}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
