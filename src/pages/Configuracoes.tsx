import { User, Building2, Shield, Camera, Eye, EyeOff, Loader2, QrCode, ShieldCheck, ShieldOff, Copy, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Configuracoes() {
  const { user, profile, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Empresa", icon: Building2 },
    { label: "Pessoal", icon: User },
    { label: "Segurança", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <User size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-bold">Configurações</h1>
          <p className="text-muted-foreground text-sm">Gerencie suas informações pessoais, dados da empresa e configurações de segurança.</p>
        </div>
      </div>

      <div className="inline-flex bg-muted/50 rounded-lg p-1 border border-border">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${i === activeTab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <tab.icon size={16} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 0 && <EmpresaTab userId={user?.id} />}
      {activeTab === 1 && <PessoalTab user={user} profile={profile} />}
      {activeTab === 2 && <SegurancaTab />}
    </div>
  );
}

/* ─── Empresa Tab ─── */
function EmpresaTab({ userId }: { userId?: string }) {
  const [data, setData] = useState({
    razao_social: "", nome_fatura: "", cnpj: "",
    produtos_vendidos: "", vende_fisicos: false, site: "",
    cep: "", rua: "", bairro: "", cidade: "", complemento: "", numero: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userId) {
      supabase.from("company_settings").select("*").eq("user_id", userId).maybeSingle()
        .then(({ data: d }) => { if (d) setData(d as any); });
    }
  }, [userId]);

  const update = (key: string, value: any) => setData(prev => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const { data: existing } = await supabase.from("company_settings").select("id").eq("user_id", userId!).maybeSingle();
      const payload = { ...data, user_id: userId! };
      if (existing) {
        await supabase.from("company_settings").update(payload).eq("user_id", userId!);
      } else {
        await supabase.from("company_settings").insert(payload);
      }
      toast.success("Dados da empresa salvos!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

  return (
    <div className="glass-card p-5 md:p-8 max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Building2 size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="font-heading font-semibold text-foreground">Dados da Empresa</h2>
          <p className="text-xs text-muted-foreground">Informações cadastrais e endereço</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-foreground block mb-1.5">Razão Social</label>
          <input value={data.razao_social} onChange={e => update("razao_social", e.target.value)} placeholder="Ex: Empresa LTDA" className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">CNPJ</label>
          <input value={data.cnpj} onChange={e => update("cnpj", e.target.value)} placeholder="00.000.000/0001-00" className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Nome na Fatura</label>
          <input value={data.nome_fatura} onChange={e => update("nome_fatura", e.target.value)} placeholder="Nome exibido na fatura" className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Produtos Vendidos</label>
          <input value={data.produtos_vendidos} onChange={e => update("produtos_vendidos", e.target.value)} placeholder="Ex: Cursos digitais" className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Site / Rede Social</label>
          <input value={data.site} onChange={e => update("site", e.target.value)} placeholder="https://..." className={inputClass} />
        </div>
      </div>

      <hr className="border-border" />

      <h3 className="font-heading font-semibold text-foreground text-sm">Endereço</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "CEP", key: "cep", placeholder: "00000-000" },
          { label: "Rua", key: "rua", placeholder: "Rua principal" },
          { label: "Número", key: "numero", placeholder: "123" },
          { label: "Bairro", key: "bairro", placeholder: "Centro" },
          { label: "Cidade", key: "cidade", placeholder: "São Paulo" },
          { label: "Complemento", key: "complemento", placeholder: "Sala 1" },
        ].map(f => (
          <div key={f.key}>
            <label className="text-sm font-medium text-foreground block mb-1.5">{f.label}</label>
            <input value={(data as any)[f.key] || ""} onChange={e => update(f.key, e.target.value)} placeholder={f.placeholder} className={inputClass} />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button className="px-5 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">Cancelar</button>
        <button onClick={save} disabled={saving} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
          {saving && <Loader2 size={14} className="animate-spin" />}
          Salvar alterações
        </button>
      </div>
    </div>
  );
}

/* ─── Pessoal Tab ─── */
function PessoalTab({ user, profile }: { user: any; profile: any }) {
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setCpf(profile.cpf || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.rpc("update_own_profile", { _full_name: fullName, _cpf: cpf, _phone: phone });
      if (error) throw error;
      if (newPassword.length >= 6) {
        const { error: pwErr } = await supabase.auth.updateUser({ password: newPassword });
        if (pwErr) throw pwErr;
        setNewPassword("");
      }
      toast.success("Perfil atualizado!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

  return (
    <div className="glass-card p-5 md:p-8 max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <User size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="font-heading font-semibold text-foreground">Dados Pessoais</h2>
          <p className="text-xs text-muted-foreground">Suas informações de perfil e contato</p>
        </div>
      </div>

      {/* Avatar */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">Foto de perfil</p>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
            <User size={28} className="text-primary" />
          </div>
          <div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors">
              <Camera size={14} /> Alterar foto
            </button>
            <p className="text-xs text-muted-foreground mt-1">JPG, PNG ou GIF. Máximo 5MB.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Nome completo</label>
          <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Seu nome" className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">E-mail</label>
          <input value={profile?.email || ""} disabled className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm text-muted-foreground cursor-not-allowed" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Celular</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(00) 00000-0000" className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Nova Senha</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              className={inputClass + " pr-10"}
            />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
              {showPassword ? <EyeOff size={16} className="text-muted-foreground" /> : <Eye size={16} className="text-muted-foreground" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Deixe em branco para manter a senha atual</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button className="px-5 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">Cancelar</button>
        <button onClick={save} disabled={saving} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
          {saving && <Loader2 size={14} className="animate-spin" />}
          Salvar alterações
        </button>
      </div>
    </div>
  );
}

/* ─── Segurança Tab ─── */
function SegurancaTab() {
  const [deviceName, setDeviceName] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [factors, setFactors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  const inputClass = "w-full px-4 py-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

  const loadFactors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      setFactors(data?.totp || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFactors(); }, []);

  const startEnroll = async () => {
    setEnrolling(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: deviceName || "Meu dispositivo",
      });
      if (error) throw error;
      setQrCode(data.totp.qr_code);
      setTotpSecret(data.totp.secret);
      setFactorId(data.id);
    } catch (err: any) {
      toast.error(err.message || "Erro ao iniciar configuração MFA");
    } finally {
      setEnrolling(false);
    }
  };

  const verifyAndActivate = async () => {
    if (!factorId || verifyCode.length !== 6) return;
    setVerifying(true);
    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: verifyCode,
      });
      if (verifyError) throw verifyError;

      toast.success("MFA ativado com sucesso! Sua conta agora está mais segura.");
      setQrCode(null);
      setTotpSecret(null);
      setFactorId(null);
      setVerifyCode("");
      setDeviceName("");
      await loadFactors();
    } catch (err: any) {
      toast.error(err.message || "Código inválido. Tente novamente.");
    } finally {
      setVerifying(false);
    }
  };

  const removeFactor = async (id: string) => {
    setRemoving(id);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: id });
      if (error) throw error;
      toast.success("MFA removido com sucesso.");
      await loadFactors();
    } catch (err: any) {
      toast.error(err.message || "Erro ao remover MFA");
    } finally {
      setRemoving(null);
    }
  };

  const verifiedFactors = factors.filter((f: any) => f.status === "verified");

  return (
    <div className="glass-card p-5 md:p-8 max-w-3xl space-y-6">
      <div>
        <h2 className="font-heading font-semibold text-foreground">Autenticação de Dois Fatores (MFA)</h2>
        <p className="text-sm text-muted-foreground mt-1">Adicione uma camada extra de segurança à sua conta</p>
      </div>

      <div className="glass-card p-4 bg-muted/30">
        <h3 className="font-heading font-semibold text-foreground text-sm mb-2">O que é MFA?</h3>
        <p className="text-sm text-muted-foreground">
          A autenticação de dois fatores adiciona uma camada extra de segurança à sua conta. Além da sua senha, você precisará de um código de 6 dígitos gerado por um aplicativo autenticador (Google Authenticator, Authy, etc.) em seu dispositivo móvel.
        </p>
      </div>

      {/* Active factors */}
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 size={20} className="animate-spin text-muted-foreground" />
        </div>
      ) : verifiedFactors.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            Dispositivos ativos
          </h3>
          {verifiedFactors.map((f: any) => (
            <div key={f.id} className="flex items-center justify-between p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <ShieldCheck size={16} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{f.friendly_name || "Dispositivo"}</p>
                  <p className="text-xs text-muted-foreground">Ativo desde {new Date(f.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
              <button
                onClick={() => removeFactor(f.id)}
                disabled={removing === f.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                {removing === f.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                Remover
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {/* Enroll flow */}
      {!qrCode ? (
        <>
          {verifiedFactors.length === 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm">
              <ShieldOff size={16} />
              MFA não está ativado. Ative para proteger sua conta.
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Nome do dispositivo</label>
            <input value={deviceName} onChange={e => setDeviceName(e.target.value)} placeholder="Ex: iPhone 13, Samsung Galaxy, etc." className={inputClass} />
            <p className="text-xs text-muted-foreground mt-1">Escolha um nome que ajude você a identificar este dispositivo</p>
          </div>

          <button
            onClick={startEnroll}
            disabled={enrolling}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {enrolling ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />}
            {verifiedFactors.length > 0 ? "Adicionar outro dispositivo" : "Ativar MFA"}
          </button>
        </>
      ) : (
        <div className="space-y-6">
          {/* Step 1: QR Code */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">1. Escaneie o QR Code</h3>
            <p className="text-xs text-muted-foreground">
              Abra o Google Authenticator (ou outro app TOTP) e escaneie o código abaixo.
            </p>
            <div className="flex justify-center p-6 bg-white rounded-xl border border-border">
              <img src={qrCode} alt="QR Code MFA" className="w-48 h-48" />
            </div>
          </div>

          {/* Manual secret */}
          {totpSecret && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Ou insira o código manualmente no app:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-xs font-mono text-foreground break-all">
                  {totpSecret}
                </code>
                <button
                  onClick={() => { navigator.clipboard.writeText(totpSecret); toast.success("Código copiado!"); }}
                  className="p-2 rounded-lg border border-border hover:bg-muted transition-colors shrink-0"
                >
                  <Copy size={14} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Verify */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">2. Insira o código de verificação</h3>
            <p className="text-xs text-muted-foreground">
              Digite o código de 6 dígitos exibido no seu aplicativo autenticador.
            </p>
            <input
              value={verifyCode}
              onChange={e => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className={inputClass + " text-center text-2xl tracking-[0.5em] font-mono"}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setQrCode(null); setTotpSecret(null); setFactorId(null); setVerifyCode(""); }}
              className="flex-1 py-3 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={verifyAndActivate}
              disabled={verifying || verifyCode.length !== 6}
              className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {verifying ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              Verificar e ativar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
