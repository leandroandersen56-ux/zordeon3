import { ArrowLeft, Eye, Save, Loader2, Settings, Package, Image, Palette, Link2, Plus, User, Mail, Phone, MapPin, Star, TrendingUp, MessageSquare, CreditCard, Smartphone, FileText, BarChart3 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LinkSettingsProps {
  link: any;
  onBack: () => void;
}

const tabs = [
  { label: "Geral", icon: Settings },
  { label: "Header", icon: Palette },
  { label: "Banner", icon: Image },
  { label: "Frete", icon: Package },
  { label: "Campos", icon: Settings },
  { label: "Social", icon: BarChart3 },
  { label: "Vendas", icon: TrendingUp },
  { label: "Pagamento", icon: CreditCard },
  { label: "Pixels", icon: BarChart3 },
  { label: "Tema", icon: Palette },
];

const inputClass = "w-full px-4 py-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`w-12 h-7 rounded-full relative transition-colors shrink-0 ${enabled ? "bg-primary" : "bg-muted"}`}>
      <span className={`absolute top-1 w-5 h-5 rounded-full transition-all ${enabled ? "left-6 bg-primary-foreground" : "left-1 bg-muted-foreground"}`} />
    </button>
  );
}

export default function LinkSettings({ link, onBack }: LinkSettingsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: link.title || "",
    product: link.title || "",
    amount: String(Number(link.amount).toFixed(2)).replace(".", ","),
    description: "",
    isActive: link.status === "active",
    maxInstallments: "1",
    imageUrl: "",
    pageTitle: "",
    faviconUrl: "",
    // Header
    headerLayout: "centered",
    headerShowTitle: true,
    headerShowSubtitle: true,
    headerShowNav: true,
    headerBgColor: "#ffffff",
    headerTextColor: "#000000",
    headerFixed: true,
    headerShadow: true,
    // Frete
    freteObrigatorio: true,
    freteAutoCalc: true,
    // Campos
    fieldName: true, fieldNameRequired: true, fieldNameLabel: "Nome completo", fieldNamePlaceholder: "Digite seu nome completo",
    fieldEmail: true, fieldEmailRequired: true, fieldEmailLabel: "E-mail", fieldEmailPlaceholder: "exemplo@email.com",
    fieldPhone: true, fieldPhoneRequired: true, fieldPhoneLabel: "Telefone", fieldPhonePlaceholder: "(00) 00000-0000",
    fieldCpf: true, fieldCpfRequired: true, fieldCpfLabel: "CPF", fieldCpfPlaceholder: "000.000.000-00",
    sectionTitle: "Dados Cadastrais",
    // Social
    showRatings: false,
    // Vendas
    orderBump: true,
    upsell: true,
    // Pagamento
    pix: true, pixExpiration: "30", pixCopyPaste: true,
    creditCard: true,
    boleto: true,
    // Tema
    primaryColor: "#cc0854",
    secondaryColor: "#6B46C1",
    bgColor: "#F9FAFB",
    textColor: "#111827",
    fontFamily: "Inter",
    fontSize: "16px",
    borderRadius: "8px",
  });

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));
  const parsedAmount = parseFloat(form.amount.replace(",", ".")) || 0;
  const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Informe o nome do link."); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from("payment_links").update({
        title: form.title,
        amount: parsedAmount,
        status: form.isActive ? "active" : "inactive",
      }).eq("id", link.id);
      if (error) throw error;
      toast.success("Configurações salvas!");
      onBack();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const tabContent: Record<number, JSX.Element> = {
    0: <GeneralTab form={form} update={update} fmt={fmt} parsedAmount={parsedAmount} />,
    1: <HeaderTab form={form} update={update} />,
    2: <BannerTab />,
    3: <FreteTab form={form} update={update} />,
    4: <CamposTab form={form} update={update} />,
    5: <SocialTab form={form} update={update} />,
    6: <VendasTab form={form} update={update} />,
    7: <PagamentoTab form={form} update={update} />,
    8: <PixelsTab />,
    9: <TemaTab form={form} update={update} />,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-heading font-bold">Configurações do Link</h1>
            <p className="text-muted-foreground text-sm">{form.title || link.title} - Personalize seu checkout</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">
            <Eye size={14} /> Preview
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Salvar
          </button>
        </div>
      </div>

      <div className="flex border-b border-border overflow-x-auto scrollbar-none">
        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          return (
            <button key={tab.label} onClick={() => setActiveTab(i)} className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${i === activeTab ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {tabContent[activeTab]}
        </div>

        <div className="w-full lg:w-80 shrink-0">
          <CheckoutPreview form={form} fmt={fmt} parsedAmount={parsedAmount} />
        </div>
      </div>

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

/* ─── Checkout Preview ─── */
function CheckoutPreview({ form, fmt, parsedAmount }: any) {
  return (
    <div className="glass-card p-5 sticky top-4 space-y-4">
      <div>
        <h3 className="font-heading font-semibold text-foreground">Preview do Checkout</h3>
        <p className="text-xs text-muted-foreground">Visualização em tempo real</p>
      </div>
      <div className="bg-muted rounded-2xl p-3 mx-auto max-w-[280px]">
        <div className="bg-background rounded-xl overflow-hidden shadow-inner">
          <div className="flex items-center justify-between px-4 py-1.5 text-[10px] text-muted-foreground">
            <span>9:41</span>
            <div className="flex gap-0.5">
              <div className="w-1 h-1 rounded-full bg-muted-foreground" />
              <div className="w-1 h-1 rounded-full bg-muted-foreground" />
              <div className="w-1 h-1 rounded-full bg-muted-foreground" />
            </div>
          </div>
          <div className="px-4 py-3 border-b border-border">
            <p className="text-primary text-xs font-semibold">{form.product || form.title || "Produto"}</p>
            <p className="text-foreground font-bold text-sm">{fmt(parsedAmount)}</p>
          </div>
          <div className="px-4 py-3 space-y-2">
            <p className="text-primary text-[10px] font-semibold">Dados Cadastrais</p>
            {["Nome completo", "CPF", "Telefone", "E-mail"].map(label => (
              <div key={label}>
                <p className="text-[9px] text-muted-foreground mb-0.5">{label}*</p>
                <div className="h-6 rounded border border-border bg-muted/30" />
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border">
            <p className="text-primary text-[10px] font-semibold mb-2">Forma de Pagamento</p>
            <div className="flex items-center gap-2 text-[10px]">
              <div className="w-3 h-3 rounded-full border-2 border-primary flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
              <span className="text-foreground font-medium">PIX</span>
              <span className="text-success text-[9px]">Aprovação Instantânea</span>
            </div>
          </div>
          <div className="h-1 bg-primary mx-8 mb-2 rounded-full" />
        </div>
      </div>
      <button className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5 py-2">
        <Eye size={14} /> Ver Tela Cheia
      </button>
    </div>
  );
}

/* ─── General Tab ─── */
function GeneralTab({ form, update, fmt, parsedAmount }: any) {
  return (
    <>
      <div>
        <h2 className="font-heading font-semibold text-foreground text-lg">Informações Gerais</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Configure as informações básicas do seu link de pagamento</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-5 space-y-5">
          <div className="flex items-center gap-2">
            <span className="text-base">🔗</span>
            <div>
              <h3 className="font-heading font-semibold text-foreground">Configurações do Link</h3>
              <p className="text-xs text-muted-foreground">Nome e configurações gerais do link de pagamento</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Nome do Link *</label>
            <input value={form.title} onChange={e => update("title", e.target.value)} placeholder="Ex: Pagamento Produto X" className={inputClass} />
            <p className="text-xs text-muted-foreground mt-1">Nome interno para identificar este link</p>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Link Ativo</p>
              <p className="text-xs text-muted-foreground">Link disponível para receber pagamentos</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${form.isActive ? "text-success" : "text-muted-foreground"}`}>
                {form.isActive ? "Ativo" : "Inativo"}
              </span>
              <Toggle enabled={form.isActive} onChange={() => update("isActive", !form.isActive)} />
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-start gap-2">
            <span className="text-sm">💡</span>
            <p className="text-xs text-foreground"><strong>Dica:</strong> Para configurar o endereço de entrega, acesse a aba <strong>Campos</strong> nas configurações.</p>
          </div>
        </div>
        <div className="glass-card p-5 space-y-5">
          <div className="flex items-center gap-2">
            <span className="text-base">⚙️</span>
            <div>
              <h3 className="font-heading font-semibold text-foreground">Produto/Serviço</h3>
              <p className="text-xs text-muted-foreground">Informações que aparecem no checkout</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Nome do Produto/Serviço *</label>
            <input value={form.product} onChange={e => update("product", e.target.value)} placeholder="Ex: Curso de Marketing Digital" className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Valor *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
              <input value={form.amount} onChange={e => update("amount", e.target.value)} placeholder="0,00" inputMode="decimal" className={inputClass + " pl-10"} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Máximo de Parcelas</label>
            <input value={form.maxInstallments} onChange={e => update("maxInstallments", e.target.value)} placeholder="1" type="number" min="1" max="12" className={inputClass} />
            <p className="text-xs text-muted-foreground mt-1">Para pagamentos no cartão de crédito</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Descrição do Produto</label>
            <textarea value={form.description} onChange={e => update("description", e.target.value)} placeholder="Descreva o produto ou serviço que está sendo vendido..." rows={4} className={inputClass + " resize-none"} />
          </div>
        </div>
      </div>
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-base">📷</span>
          <div>
            <h3 className="font-heading font-semibold text-foreground">Imagem do Produto</h3>
            <p className="text-xs text-muted-foreground">Adicione uma imagem para destacar seu produto no checkout</p>
          </div>
        </div>
        <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
          <div className="text-muted-foreground mb-2 text-2xl">↑</div>
          <p className="text-sm text-muted-foreground">Nenhuma imagem selecionada</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG até 5MB</p>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">URL da Imagem</label>
          <div className="flex gap-2">
            <input value={form.imageUrl} onChange={e => update("imageUrl", e.target.value)} placeholder="https://exemplo.com/imagem.jpg" className={inputClass} />
            <button className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors whitespace-nowrap flex items-center gap-1.5">↑ Upload</button>
          </div>
        </div>
      </div>
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-base">⚙️</span>
          <div>
            <h3 className="font-heading font-semibold text-foreground">Customizações da Página de Checkout</h3>
            <p className="text-xs text-muted-foreground">Personalize o título e o ícone (favicon) da página de checkout</p>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Título da Página</label>
          <input value={form.pageTitle} onChange={e => update("pageTitle", e.target.value)} placeholder="Ex: Checkout - Meu Produto" className={inputClass} />
          <p className="text-xs text-muted-foreground mt-1">Título que aparece na aba do navegador. Deixe vazio para usar um espaço em branco.</p>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">URL do Favicon</label>
          <input value={form.faviconUrl} onChange={e => update("faviconUrl", e.target.value)} placeholder="https://exemplo.com/favicon.ico" className={inputClass} />
          <p className="text-xs text-muted-foreground mt-1">Ícone que aparece na aba do navegador (formatos: .ico, .png). Deixe vazio para não exibir favicon.</p>
        </div>
      </div>
    </>
  );
}

/* ─── Header Tab ─── */
function HeaderTab({ form, update }: any) {
  const layouts = [
    { value: "left", label: "Alinhado à Esquerda" },
    { value: "centered", label: "Centralizado" },
    { value: "right", label: "Alinhado à Direita" },
    { value: "divided", label: "Dividido" },
  ];

  return (
    <div className="glass-card p-5 md:p-6 space-y-6">
      <div>
        <h2 className="font-heading font-semibold text-foreground text-lg">Configurações do Header</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Personalize o cabeçalho do seu checkout</p>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground block mb-3">Layout do Header</label>
        <div className="grid grid-cols-2 gap-3">
          {layouts.map(l => (
            <button key={l.value} onClick={() => update("headerLayout", l.value)} className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${form.headerLayout === l.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"}`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.headerLayout === l.value ? "border-primary" : "border-muted-foreground"}`}>
                {form.headerLayout === l.value && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <span className="text-sm text-foreground">{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground block mb-2">Logo da Empresa</label>
        <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer">
          <div className="text-muted-foreground mb-2 text-2xl">↑</div>
          <p className="text-sm text-muted-foreground">Clique para fazer upload da logo</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG ou SVG até 5MB</p>
        </div>
      </div>

      {[
        { key: "headerShowTitle", label: "Título do Header" },
        { key: "headerShowSubtitle", label: "Subtítulo do Header" },
        { key: "headerShowNav", label: "Menu de Navegação" },
      ].map(item => (
        <div key={item.key} className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{item.label}</span>
          <Toggle enabled={(form as any)[item.key]} onChange={() => update(item.key, !(form as any)[item.key])} />
        </div>
      ))}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Cor de Fundo</label>
          <div className="flex items-center gap-2">
            <input type="color" value={form.headerBgColor} onChange={e => update("headerBgColor", e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
            <input value={form.headerBgColor} onChange={e => update("headerBgColor", e.target.value)} className={inputClass + " font-mono"} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Cor do Texto</label>
          <div className="flex items-center gap-2">
            <input type="color" value={form.headerTextColor} onChange={e => update("headerTextColor", e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
            <input value={form.headerTextColor} onChange={e => update("headerTextColor", e.target.value)} className={inputClass + " font-mono"} />
          </div>
        </div>
      </div>

      {[
        { key: "headerFixed", label: "Header Fixo", desc: "Mantém o header visível ao rolar a página" },
        { key: "headerShadow", label: "Sombra", desc: "Adiciona sombra ao header" },
      ].map(item => (
        <div key={item.key} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
          <Toggle enabled={(form as any)[item.key]} onChange={() => update(item.key, !(form as any)[item.key])} />
        </div>
      ))}
    </div>
  );
}

/* ─── Banner Tab ─── */
function BannerTab() {
  return (
    <div className="glass-card p-5 md:p-6 space-y-5">
      <div>
        <h2 className="font-heading font-semibold text-foreground text-lg">Banners Promocionais</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Configure banners para destacar promoções e informações importantes</p>
      </div>
      <div className="border border-border rounded-xl p-10 text-center">
        <p className="text-sm text-muted-foreground mb-4">Nenhum banner configurado</p>
        <button className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors inline-flex items-center gap-2">
          <Plus size={14} /> Adicionar Banner
        </button>
      </div>
    </div>
  );
}

/* ─── Frete Tab ─── */
function FreteTab({ form, update }: any) {
  return (
    <div className="glass-card p-5 md:p-6 space-y-6">
      <div>
        <h2 className="font-heading font-semibold text-foreground text-lg">Configurações de Frete</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Configure as opções de entrega disponíveis para seus clientes</p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Frete Obrigatório</p>
          <p className="text-xs text-muted-foreground">Exigir seleção de frete no checkout</p>
        </div>
        <Toggle enabled={form.freteObrigatorio} onChange={() => update("freteObrigatorio", !form.freteObrigatorio)} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Cálculo Automático</p>
          <p className="text-xs text-muted-foreground">Calcular frete automaticamente via CEP</p>
        </div>
        <Toggle enabled={form.freteAutoCalc} onChange={() => update("freteAutoCalc", !form.freteAutoCalc)} />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={16} className="text-foreground" />
          <h3 className="font-heading font-semibold text-foreground">Opções de Frete</h3>
        </div>
        <div className="border border-border rounded-xl p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">Nenhuma opção de frete configurada</p>
        </div>
        <button className="w-full mt-3 px-4 py-3 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2">
          <Plus size={14} /> Adicionar Opção de Frete
        </button>
      </div>
    </div>
  );
}

/* ─── Campos Tab ─── */
function CamposTab({ form, update }: any) {
  const [subTab, setSubTab] = useState(0);
  const subTabs = [
    { label: "Dados Pessoais", icon: User },
    { label: "Endereço", icon: MapPin },
  ];

  const fields = [
    { key: "fieldName", icon: User, label: "Nome Completo", enabledKey: "fieldName", requiredKey: "fieldNameRequired", labelKey: "fieldNameLabel", placeholderKey: "fieldNamePlaceholder" },
    { key: "fieldEmail", icon: Mail, label: "E-mail", enabledKey: "fieldEmail", requiredKey: "fieldEmailRequired", labelKey: "fieldEmailLabel", placeholderKey: "fieldEmailPlaceholder" },
    { key: "fieldPhone", icon: Phone, label: "Telefone", enabledKey: "fieldPhone", requiredKey: "fieldPhoneRequired", labelKey: "fieldPhoneLabel", placeholderKey: "fieldPhonePlaceholder" },
    { key: "fieldCpf", icon: User, label: "CPF", enabledKey: "fieldCpf", requiredKey: "fieldCpfRequired", labelKey: "fieldCpfLabel", placeholderKey: "fieldCpfPlaceholder" },
  ];

  return (
    <div className="glass-card p-5 md:p-6 space-y-6">
      <div>
        <h2 className="font-heading font-semibold text-foreground text-lg">Campos do Formulário</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Configure quais campos serão exibidos e suas propriedades no checkout</p>
      </div>

      <div className="flex border-b border-border">
        {subTabs.map((tab, i) => {
          const Icon = tab.icon;
          return (
            <button key={tab.label} onClick={() => setSubTab(i)} className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium transition-colors ${i === subTab ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {subTab === 0 && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <User size={16} className="text-foreground" />
            <div>
              <h3 className="font-heading font-semibold text-foreground">Dados Pessoais do Cliente</h3>
              <p className="text-xs text-muted-foreground">Configure os campos que o cliente deve preencher</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Título da Seção</label>
            <input value={form.sectionTitle} onChange={e => update("sectionTitle", e.target.value)} className={inputClass} />
          </div>

          {fields.map(field => {
            const Icon = field.icon;
            return (
              <div key={field.key} className="border border-border rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{field.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Exibir</span>
                      <Toggle enabled={(form as any)[field.enabledKey]} onChange={() => update(field.enabledKey, !(form as any)[field.enabledKey])} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Obrigatório</span>
                      <Toggle enabled={(form as any)[field.requiredKey]} onChange={() => update(field.requiredKey, !(form as any)[field.requiredKey])} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">Label do Campo</label>
                    <input value={(form as any)[field.labelKey]} onChange={e => update(field.labelKey, e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">Placeholder</label>
                    <input value={(form as any)[field.placeholderKey]} onChange={e => update(field.placeholderKey, e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {subTab === 1 && (
        <div className="border border-border rounded-xl p-10 text-center">
          <MapPin size={32} className="mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">Configurações de endereço em breve</p>
        </div>
      )}
    </div>
  );
}

/* ─── Social Tab ─── */
function SocialTab({ form, update }: any) {
  const [subTab, setSubTab] = useState(0);
  const subTabs = [
    { label: "Avaliações", icon: Star },
    { label: "Views", icon: User },
    { label: "Vendas", icon: TrendingUp },
    { label: "Reviews", icon: MessageSquare },
  ];

  return (
    <div className="glass-card p-5 md:p-6 space-y-6">
      <div>
        <h2 className="font-heading font-semibold text-foreground text-lg">Prova Social</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Configure elementos de prova social para aumentar a confiança dos clientes</p>
      </div>

      <div className="flex border-b border-border">
        {subTabs.map((tab, i) => {
          const Icon = tab.icon;
          return (
            <button key={tab.label} onClick={() => setSubTab(i)} className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium transition-colors ${i === subTab ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {subTab === 0 && (
        <div className="border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-foreground" />
            <div>
              <h3 className="font-heading font-semibold text-foreground">Avaliações com Estrelas</h3>
              <p className="text-xs text-muted-foreground">Mostre a nota média e total de avaliações do seu produto</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Toggle enabled={form.showRatings} onChange={() => update("showRatings", !form.showRatings)} />
            <span className="text-sm text-foreground">Exibir avaliações no checkout</span>
          </div>
        </div>
      )}

      {subTab > 0 && (
        <div className="border border-border rounded-xl p-10 text-center">
          <p className="text-sm text-muted-foreground">{subTabs[subTab].label} - Em breve</p>
        </div>
      )}
    </div>
  );
}

/* ─── Vendas Tab ─── */
function VendasTab({ form, update }: any) {
  return (
    <div className="space-y-6">
      <div className="glass-card p-5 md:p-6 space-y-5">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-primary" />
          <div>
            <h2 className="font-heading font-semibold text-foreground text-lg">Order Bump</h2>
            <p className="text-sm text-muted-foreground">Ofertas adicionais exibidas durante o checkout para aumentar o ticket médio</p>
          </div>
        </div>
        <div className="border border-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Ativar Order Bumps</p>
            <p className="text-xs text-muted-foreground">Exibir produtos adicionais no checkout</p>
          </div>
          <Toggle enabled={form.orderBump} onChange={() => update("orderBump", !form.orderBump)} />
        </div>
      </div>

      <div className="glass-card p-5 md:p-6 space-y-5">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-primary" />
          <div>
            <h2 className="font-heading font-semibold text-foreground text-lg">Upsell (Página de Obrigado)</h2>
            <p className="text-sm text-muted-foreground">Redirecione clientes para uma página customizada após a compra</p>
          </div>
        </div>
        <div className="border border-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Ativar Upsell</p>
            <p className="text-xs text-muted-foreground">Redirecionar para página customizada após pagamento aprovado</p>
          </div>
          <Toggle enabled={form.upsell} onChange={() => update("upsell", !form.upsell)} />
        </div>
      </div>
    </div>
  );
}

/* ─── Pagamento Tab ─── */
function PagamentoTab({ form, update }: any) {
  return (
    <div className="glass-card p-5 md:p-6 space-y-6">
      <div>
        <h2 className="font-heading font-semibold text-foreground text-lg">Opções de Pagamento</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Configure as formas de pagamento e suas opções específicas</p>
      </div>

      {/* PIX */}
      <div className="border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone size={16} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">PIX</span>
          </div>
          <Toggle enabled={form.pix} onChange={() => update("pix", !form.pix)} />
        </div>
        {form.pix && (
          <>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Tempo de Expiração (minutos)</label>
              <input value={form.pixExpiration} onChange={e => update("pixExpiration", e.target.value)} type="number" className={inputClass} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Mostrar botão Copia e Cola</span>
              <Toggle enabled={form.pixCopyPaste} onChange={() => update("pixCopyPaste", !form.pixCopyPaste)} />
            </div>
          </>
        )}
      </div>

      {/* Credit Card */}
      <div className="border border-border rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">Cartão de Crédito</span>
          </div>
          <Toggle enabled={form.creditCard} onChange={() => update("creditCard", !form.creditCard)} />
        </div>
      </div>

      {/* Boleto */}
      <div className="border border-border rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">Boleto Bancário</span>
          </div>
          <Toggle enabled={form.boleto} onChange={() => update("boleto", !form.boleto)} />
        </div>
      </div>
    </div>
  );
}

/* ─── Pixels Tab ─── */
function PixelsTab() {
  const [subTab, setSubTab] = useState(0);
  const platforms = ["Meta", "Google Ads", "GTM", "TikTok", "Kwai"];

  return (
    <div className="glass-card p-5 md:p-6 space-y-6">
      <div className="border border-border rounded-xl p-4 flex items-start gap-3">
        <Settings size={16} className="text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">Configure pixels de rastreamento para monitorar conversões e otimizar suas campanhas de marketing. Você pode adicionar múltiplos pixels de cada plataforma e escolher quais eventos rastrear.</p>
      </div>

      <div className="flex border-b border-border">
        {platforms.map((p, i) => (
          <button key={p} onClick={() => setSubTab(i)} className={`px-5 py-2.5 text-sm font-medium transition-colors ${i === subTab ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
            {p}
          </button>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-semibold text-foreground">{platforms[subTab]} Pixel {subTab === 0 && "(Facebook & Instagram)"}</h3>
            <p className="text-xs text-muted-foreground">Configure pixels do {platforms[subTab]} para rastreamento{subTab === 0 ? " em Facebook e Instagram" : ""}</p>
          </div>
          <button className="px-3 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-1.5">
            <Plus size={14} /> Adicionar Pixel
          </button>
        </div>

        <div className="border border-border rounded-xl p-10 text-center">
          <BarChart3 size={32} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground mb-4">Nenhum pixel {platforms[subTab]} configurado</p>
          <button className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors inline-flex items-center gap-2">
            <Plus size={14} /> Adicionar Primeiro Pixel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Tema Tab ─── */
function TemaTab({ form, update }: any) {
  return (
    <div className="glass-card p-5 md:p-6 space-y-6">
      <div>
        <h2 className="font-heading font-semibold text-foreground text-lg">Tema e Cores</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Personalize a aparência visual do seu checkout</p>
      </div>

      {/* Cores Principais */}
      <div className="border border-border rounded-xl p-5 space-y-5">
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-foreground" />
          <h3 className="font-heading font-semibold text-foreground">Cores Principais</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "primaryColor", label: "Cor Primária" },
            { key: "secondaryColor", label: "Cor Secundária" },
            { key: "bgColor", label: "Cor de Fundo" },
            { key: "textColor", label: "Cor do Texto" },
          ].map(c => (
            <div key={c.key}>
              <label className="text-sm font-medium text-foreground block mb-2">{c.label}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={(form as any)[c.key]} onChange={e => update(c.key, e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                <input value={(form as any)[c.key]} onChange={e => update(c.key, e.target.value)} className={inputClass + " font-mono"} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tipografia */}
      <div className="border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-heading font-semibold text-foreground">Tipografia</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Fonte Principal</label>
            <select value={form.fontFamily} onChange={e => update("fontFamily", e.target.value)} className={inputClass}>
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Poppins">Poppins</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Tamanho Base</label>
            <input value={form.fontSize} onChange={e => update("fontSize", e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Bordas e Cantos */}
      <div className="border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-heading font-semibold text-foreground">Bordas e Cantos</h3>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Raio das Bordas</label>
          <select value={form.borderRadius} onChange={e => update("borderRadius", e.target.value)} className={inputClass}>
            <option value="0px">Sem arredondamento (0px)</option>
            <option value="4px">Sutil (4px)</option>
            <option value="8px">Arredondado (8px)</option>
            <option value="12px">Muito arredondado (12px)</option>
            <option value="16px">Pílula (16px)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
