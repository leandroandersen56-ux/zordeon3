import { Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Empresa() {
  const { user } = useAuth();
  const [data, setData] = useState({
    razao_social: "", nome_fatura: "", cnpj: "",
    produtos_vendidos: "", vende_fisicos: false, site: "",
    cep: "", rua: "", bairro: "", cidade: "", complemento: "", numero: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      supabase.from("company_settings").select("*").eq("user_id", user.id).maybeSingle()
        .then(({ data: d }) => { if (d) setData(d as any); });
    }
  }, [user]);

  const save = async () => {
    setSaving(true);
    const { data: existing } = await supabase.from("company_settings").select("id").eq("user_id", user!.id).maybeSingle();
    const payload = { ...data, user_id: user!.id };
    if (existing) {
      await supabase.from("company_settings").update(payload).eq("user_id", user!.id);
    } else {
      await supabase.from("company_settings").insert(payload);
    }
    toast.success("Dados salvos!");
    setSaving(false);
  };

  const update = (key: string, value: any) => setData(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-heading font-bold">Configurações de Empresa</h1>
        <button onClick={save} disabled={saving} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">Salvar tudo</button>
      </div>

      <div className="glass-card p-4 md:p-6">
        <h2 className="font-heading font-semibold text-foreground mb-4">Editar Empresa</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Razão Social", key: "razao_social" },
            { label: "Nome da Fatura", key: "nome_fatura" },
            { label: "CNPJ", key: "cnpj" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">{f.label}</label>
              <input value={(data as any)[f.key] || ""} onChange={e => update(f.key, e.target.value)} className="w-full px-4 py-3 sm:py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[48px] sm:min-h-0" />
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-4 md:p-6">
        <h2 className="font-heading font-semibold text-foreground mb-4">Detalhes da Empresa</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Produtos Vendidos</label>
            <input value={data.produtos_vendidos} onChange={e => update("produtos_vendidos", e.target.value)} className="w-full px-4 py-3 sm:py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[48px] sm:min-h-0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Vende produtos físicos?</label>
            <button onClick={() => update("vende_fisicos", !data.vende_fisicos)} className={`mt-1 w-12 h-7 rounded-full relative transition-colors min-h-[28px] ${data.vende_fisicos ? "bg-primary" : "bg-muted"}`}>
              <span className={`absolute top-1 w-5 h-5 rounded-full transition-transform ${data.vende_fisicos ? "left-6 bg-primary-foreground" : "left-1 bg-muted-foreground"}`} />
            </button>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Site / Rede Social</label>
            <input value={data.site} onChange={e => update("site", e.target.value)} className="w-full px-4 py-3 sm:py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[48px] sm:min-h-0" />
          </div>
        </div>
      </div>

      <div className="glass-card p-4 md:p-6">
        <h2 className="font-heading font-semibold text-foreground mb-4">Endereço</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["cep", "rua", "bairro", "cidade", "complemento", "numero"].map((f) => (
            <div key={f}>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5 capitalize">{f}</label>
              <input value={(data as any)[f] || ""} onChange={e => update(f, e.target.value)} className="w-full px-4 py-3 sm:py-2.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[48px] sm:min-h-0" />
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-4 md:p-6">
        <h2 className="font-heading font-semibold text-foreground mb-4">Documentos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {["Contrato Social", "Documento (Frente)", "Documento (Verso)", "Selfie"].map((doc) => (
            <div key={doc} className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer aspect-[4/3] flex flex-col items-center justify-center">
              <Upload size={24} className="text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">{doc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
