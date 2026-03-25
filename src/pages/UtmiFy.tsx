import { Search, Plus, Trash2, Edit2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

export default function UtmiFy() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [pixelId, setPixelId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [triggerPayment, setTriggerPayment] = useState(true);
  const [triggerCreation, setTriggerCreation] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: pixels = [] } = useQuery({
    queryKey: ["pixels", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("pixels").select("*").order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const resetForm = () => {
    setName(""); setPixelId(""); setApiKey("");
    setTriggerPayment(true); setTriggerCreation(true); setIsActive(true);
    setEditingId(null); setShowForm(false);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const { error } = await supabase.from("pixels").update({
          name, pixel_id: pixelId, api_key: apiKey,
          trigger_on_payment: triggerPayment, trigger_on_creation: triggerCreation,
          is_active: isActive, updated_at: new Date().toISOString(),
        }).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("pixels").insert({
          user_id: user!.id, name, pixel_id: pixelId, api_key: apiKey,
          trigger_on_payment: triggerPayment, trigger_on_creation: triggerCreation,
          is_active: isActive,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pixels"] });
      toast.success(editingId ? "Pixel atualizado!" : "Pixel cadastrado!");
      resetForm();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pixels").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pixels"] });
      toast.success("Pixel removido!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const openEdit = (p: any) => {
    setEditingId(p.id); setName(p.name); setPixelId(p.pixel_id);
    setApiKey(p.api_key || ""); setTriggerPayment(p.trigger_on_payment);
    setTriggerCreation(p.trigger_on_creation); setIsActive(p.is_active);
    setShowForm(true);
  };

  const filtered = pixels.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));

  const getTriggerLabels = (p: any) => {
    const triggers = [];
    if (p.trigger_on_payment) triggers.push("Pagamento");
    if (p.trigger_on_creation) triggers.push("Criação");
    return triggers.join(", ") || "Nenhum";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-heading font-bold">UtmiFy</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie seus pixels de rastreamento.</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar por nome..."
            className="w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[48px] sm:min-h-0"
          />
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="px-4 py-3 sm:py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 whitespace-nowrap min-h-[48px] sm:min-h-0">
          Cadastrar Novo
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden hidden sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left px-5 py-3 font-medium">Nome</th>
              <th className="text-left px-5 py-3 font-medium">Pixel ID</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Triggers</th>
              <th className="text-left px-5 py-3 font-medium">Criado em</th>
              <th className="text-left px-5 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">Nenhum pixel cadastrado. Clique em "Cadastrar Novo" para começar.</td></tr>
            ) : filtered.map((p: any) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="px-5 py-3 text-foreground font-medium">{p.name}</td>
                <td className="px-5 py-3 text-foreground font-mono text-xs">{p.pixel_id}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${p.is_active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    {p.is_active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-5 py-3 text-foreground text-xs">{getTriggerLabels(p)}</td>
                <td className="px-5 py-3 text-foreground">{new Date(p.created_at).toLocaleDateString("pt-BR")}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => { if (confirm("Remover pixel?")) deleteMutation.mutate(p.id); }} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground text-sm glass-card">Nenhum pixel cadastrado</p>
        ) : filtered.map((p: any) => (
          <div key={p.id} className="glass-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">{p.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${p.is_active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                {p.is_active ? "Ativo" : "Inativo"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">{p.pixel_id}</p>
            <div className="flex items-center gap-2 pt-1">
              <button onClick={() => openEdit(p)} className="text-xs text-primary hover:underline">Editar</button>
              <button onClick={() => { if (confirm("Remover pixel?")) deleteMutation.mutate(p.id); }} className="text-xs text-destructive hover:underline">Remover</button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading font-bold">{editingId ? "Editar Pixel" : "Novo Pixel"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Nome</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome do Pixel" className="w-full px-4 py-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Pixel ID</label>
              <input value={pixelId} onChange={e => setPixelId(e.target.value)} placeholder="Pixel ID" className="w-full px-4 py-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">API Key</label>
              <input value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Chave da API (Opcional)" className="w-full px-4 py-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Acionar no Pagamento</span>
              <Switch checked={triggerPayment} onCheckedChange={setTriggerPayment} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Acionar na Criação</span>
              <Switch checked={triggerCreation} onCheckedChange={setTriggerCreation} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Ativo</span>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <button
              onClick={() => saveMutation.mutate()}
              disabled={!name.trim() || !pixelId.trim()}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {editingId ? "Salvar alterações" : "Confirmar e continuar"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
