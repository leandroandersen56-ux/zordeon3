import { Plus, Search, Link as LinkIcon, ArrowLeft, Eye, Save, Loader2, MoreVertical, BarChart3, Settings, Ban, CopyPlus, Trash2, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CheckoutDomainSection from "@/components/CheckoutDomainSection";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LinkSettings from "@/components/links/LinkSettings";

export default function Links() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);

  const { data: links = [] } = useQuery({
    queryKey: ["payment_links", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("payment_links").select("*").order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;
  const totalRevenue = links.reduce((s: number, l: any) => s + Number(l.amount) * l.conversions, 0);
  const totalVisits = links.reduce((s: number, l: any) => s + l.visits, 0);

  const handleToggleStatus = async (link: any) => {
    const newStatus = link.status === "active" ? "inactive" : "active";
    const { error } = await supabase.from("payment_links").update({ status: newStatus }).eq("id", link.id);
    if (error) { toast.error(error.message); return; }
    toast.success(newStatus === "active" ? "Link ativado!" : "Link desativado!");
    queryClient.invalidateQueries({ queryKey: ["payment_links"] });
  };

  const handleDuplicate = async (link: any) => {
    const slug = link.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();
    const { error } = await supabase.from("payment_links").insert({
      user_id: user!.id,
      title: link.title + " (cópia)",
      amount: link.amount,
      slug,
      status: "active",
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Link duplicado!");
    queryClient.invalidateQueries({ queryKey: ["payment_links"] });
  };

  const handleDelete = async (link: any) => {
    if (!confirm("Tem certeza que deseja excluir este link?")) return;
    const { error } = await supabase.from("payment_links").delete().eq("id", link.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Link excluído!");
    queryClient.invalidateQueries({ queryKey: ["payment_links"] });
  };

  if (editingLink) return <LinkSettings link={editingLink} onBack={() => { setEditingLink(null); queryClient.invalidateQueries({ queryKey: ["payment_links"] }); }} />;
  if (showCreate) return <CreateLink userId={user?.id} onBack={() => { setShowCreate(false); queryClient.invalidateQueries({ queryKey: ["payment_links"] }); }} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-bold">Links de Pagamento</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie seus links de pagamento</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90">
          <Plus size={16} /> Novo Link
        </button>
      </div>

      <CheckoutDomainSection />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "LINKS TOTAIS", value: String(links.length), sub: `${links.filter((l: any) => l.status === "active").length} ativos` },
          { label: "RECEITA TOTAL", value: fmt(totalRevenue) },
          { label: "TRÁFEGO", value: String(totalVisits), sub: "visitantes" },
          { label: "TAXA DE CONVERSÃO", value: totalVisits > 0 ? ((links.reduce((s: number, l: any) => s + l.conversions, 0) / totalVisits) * 100).toFixed(1) + "%" : "0.0%" },
        ].map((k) => (
          <div key={k.label} className="glass-card p-4 md:p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{k.label}</p>
            <p className="text-2xl font-heading font-bold text-foreground mt-1">{k.value}</p>
            {k.sub && <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>}
          </div>
        ))}
      </div>

      {links.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <LinkIcon size={40} className="mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-foreground font-medium mb-1">Nenhum link encontrado</p>
          <p className="text-sm text-muted-foreground mb-4">Crie seu primeiro link de pagamento</p>
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            <Plus size={14} className="inline mr-1" /> Criar Primeiro Link
          </button>
        </div>
      ) : (
        <>
          <div className="glass-card overflow-hidden hidden sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left px-5 py-3 font-medium">TÍTULO</th>
                  <th className="text-left px-5 py-3 font-medium">VALOR</th>
                  <th className="text-left px-5 py-3 font-medium">STATUS</th>
                  <th className="text-left px-5 py-3 font-medium">VISITAS</th>
                  <th className="text-left px-5 py-3 font-medium">CRIADO EM</th>
                  <th className="text-left px-5 py-3 font-medium">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {links.map((l: any) => {
                  return (
                  <tr key={l.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 text-foreground font-medium">{l.title}</td>
                    <td className="px-5 py-3 text-foreground">{fmt(Number(l.amount))}</td>
                    <td className="px-5 py-3"><span className={`text-xs px-2 py-1 rounded-full ${l.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{l.status === "active" ? "Ativo" : "Inativo"}</span></td>
                    <td className="px-5 py-3 text-foreground">{l.visits}</td>
                    <td className="px-5 py-3 text-foreground">{new Date(l.created_at).toLocaleDateString("pt-BR")}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/pay/${l.slug}`); toast.success("Link copiado!"); }} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Copiar link">
                          <Copy size={15} />
                        </button>
                        <button onClick={() => window.open(`${window.location.origin}/pay/${l.slug}`, "_blank")} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Abrir em nova janela">
                          <ExternalLink size={15} />
                        </button>
                        <LinkActionsMenu link={l} onToggleStatus={handleToggleStatus} onDuplicate={handleDuplicate} onDelete={handleDelete} onSettings={setEditingLink} />
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden space-y-3">
            {links.map((l: any) => (
              <div key={l.id} className="glass-card p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{l.title}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${l.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{l.status === "active" ? "Ativo" : "Inativo"}</span>
                </div>
                <p className="text-sm text-primary font-bold">{fmt(Number(l.amount))}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{l.visits} visitas · {new Date(l.created_at).toLocaleDateString("pt-BR")}</p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/pay/${l.slug}`); toast.success("Link copiado!"); }} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Copiar link">
                      <Copy size={14} />
                    </button>
                    <button onClick={() => window.open(`${window.location.origin}/pay/${l.slug}`, "_blank")} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Abrir em nova janela">
                      <ExternalLink size={14} />
                    </button>
                    <LinkActionsMenu link={l} onToggleStatus={handleToggleStatus} onDuplicate={handleDuplicate} onDelete={handleDelete} onSettings={setEditingLink} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Create Link ─── */
function CreateLink({ userId, onBack }: { userId?: string; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    product: "",
    description: "",
    amount: "",
    isActive: true,
    pix: true,
    creditCard: true,
    boleto: true,
    color: "#CC0854",
  });

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));
  const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;
  const parsedAmount = parseFloat(form.amount.replace(",", ".")) || 0;

  const tabs = ["Informações", "Pagamento", "Aparência"];

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Informe o nome do link."); return; }
    setSaving(true);
    try {
      const slug = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();
      const { error } = await supabase.from("payment_links").insert({
        user_id: userId!,
        title: form.title,
        amount: parsedAmount,
        slug,
        status: form.isActive ? "active" : "inactive",
      });
      if (error) throw error;
      toast.success("Link de pagamento criado!");
      onBack();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-heading font-bold">Novo Link de Pagamento</h1>
            <p className="text-muted-foreground text-sm">Configure seu link de pagamento personalizado</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">
            <Eye size={14} /> Preview
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Salvar
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex border-b border-border">
            {tabs.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)} className={`px-5 py-3 text-sm font-medium transition-colors ${i === activeTab ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 0 && (
            <div className="glass-card p-5 md:p-6 space-y-5">
              <div>
                <h2 className="font-heading font-semibold text-foreground">Informações Básicas</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Configure as informações principais do seu link de pagamento</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Nome do Link *</label>
                  <input value={form.title} onChange={e => update("title", e.target.value)} placeholder="Ex: Pagamento Produto X" className={inputClass} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Nome do Produto *</label>
                  <input value={form.product} onChange={e => update("product", e.target.value)} placeholder="Ex: Curso de Marketing Digital" className={inputClass} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Descrição</label>
                  <textarea value={form.description} onChange={e => update("description", e.target.value)} placeholder="Descreva o produto ou serviço..." rows={4} className={inputClass + " resize-none"} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Valor *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                    <input value={form.amount} onChange={e => update("amount", e.target.value)} placeholder="0,00" inputMode="decimal" className={inputClass + " pl-10"} />
                  </div>
                </div>

                <hr className="border-border" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Link Ativo</p>
                    <p className="text-xs text-muted-foreground">Link disponível para receber pagamentos</p>
                  </div>
                  <button onClick={() => update("isActive", !form.isActive)} className={`w-12 h-7 rounded-full relative transition-colors ${form.isActive ? "bg-primary" : "bg-muted"}`}>
                    <span className={`absolute top-1 w-5 h-5 rounded-full transition-all ${form.isActive ? "left-6 bg-primary-foreground" : "left-1 bg-muted-foreground"}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="glass-card p-5 md:p-6 space-y-5">
              <div>
                <h2 className="font-heading font-semibold text-foreground">Formas de Pagamento</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Selecione as formas de pagamento disponíveis</p>
              </div>

              <div className="space-y-3">
                {[
                  { key: "pix", label: "PIX", desc: "Pagamento instantâneo", icon: "➕" },
                  { key: "creditCard", label: "Cartão de Crédito", desc: "Parcelamento disponível", icon: "💳" },
                  { key: "boleto", label: "Boleto Bancário", desc: "Vencimento em 3 dias", icon: "📄" },
                ].map(method => (
                  <div key={method.key} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">{method.icon}</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{method.label}</p>
                        <p className="text-xs text-muted-foreground">{method.desc}</p>
                      </div>
                    </div>
                    <button onClick={() => update(method.key, !(form as any)[method.key])} className={`w-12 h-7 rounded-full relative transition-colors ${(form as any)[method.key] ? "bg-primary" : "bg-muted"}`}>
                      <span className={`absolute top-1 w-5 h-5 rounded-full transition-all ${(form as any)[method.key] ? "left-6 bg-primary-foreground" : "left-1 bg-muted-foreground"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="glass-card p-5 md:p-6 space-y-5">
              <div>
                <h2 className="font-heading font-semibold text-foreground">Personalização Visual</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Customize a aparência do seu checkout</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Cor Principal</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.color} onChange={e => update("color", e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                  <input value={form.color} onChange={e => update("color", e.target.value)} className={inputClass + " max-w-[200px] font-mono"} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Imagem do Produto</label>
                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="text-muted-foreground mb-2">↑</div>
                  <p className="text-sm text-muted-foreground">Clique para enviar uma imagem</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG até 5MB</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="glass-card p-5 sticky top-4 space-y-4">
            <div>
              <h3 className="font-heading font-semibold text-foreground">Resumo do Link</h3>
              <p className="text-xs text-muted-foreground">Preview das configurações</p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Nome do Link</p>
                <p className="text-sm font-semibold text-foreground">{form.title || "Não definido"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Produto</p>
                <p className="text-sm font-semibold text-foreground">{form.product || "Não definido"}</p>
              </div>
              <hr className="border-border" />
              <div>
                <p className="text-xs text-muted-foreground">Valor</p>
                <p className="text-lg font-bold text-primary">{fmt(parsedAmount)}</p>
              </div>
              <hr className="border-border" />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Status</p>
                <span className={`text-xs px-2.5 py-1 rounded-full ${form.isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                  {form.isActive ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile save */}
      <div className="sm:hidden flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-lg border border-border text-sm text-muted-foreground">Cancelar</button>
        <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Salvar
        </button>
      </div>
    </div>
  );
}

/* ─── Actions Menu ─── */
function LinkActionsMenu({ link, onToggleStatus, onDuplicate, onDelete, onSettings }: { link: any; onToggleStatus: (l: any) => void; onDuplicate: (l: any) => void; onDelete: (l: any) => void; onSettings: (l: any) => void }) {
  const items = [
    { icon: BarChart3, label: "Estatísticas", action: () => toast.info("Em breve!") },
    { icon: Settings, label: "Configurações", action: () => onSettings(link) },
    { icon: Ban, label: link.status === "active" ? "Desativar" : "Ativar", action: () => onToggleStatus(link) },
    { icon: CopyPlus, label: "Duplicar Link", action: () => onDuplicate(link) },
    { icon: Trash2, label: "Excluir", action: () => onDelete(link), danger: true },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <MoreVertical size={15} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-44 p-1">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === items.length - 1;
          return (
            <div key={item.label}>
              {isLast && <DropdownMenuSeparator className="my-1" />}
              <DropdownMenuItem
                onClick={item.action}
                className={`gap-2 text-sm ${item.danger ? "text-destructive focus:text-destructive" : "text-foreground"}`}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </DropdownMenuItem>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
