import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import authMech from "@/assets/landing/auth-mech.png";
import zordeonDark from "@/assets/logos/zordeon-dark.png";

type AuthView = "login" | "signup" | "forgot" | "mfa";

export default function Auth() {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    return () => {
      const isDark = localStorage.getItem("zordeon-dark-mode") !== "false";
      if (isDark) document.documentElement.classList.add("dark");
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (view === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      // Check if MFA is required
      const { data: factorsData } = await supabase.auth.mfa.listFactors();
      const verifiedFactors = factorsData?.totp?.filter((f: any) => f.status === "verified") || [];

      if (verifiedFactors.length > 0) {
        // MFA is enabled, need to verify
        setMfaFactorId(verifiedFactors[0].id);
        setView("mfa");
        setLoading(false);
        return;
      }

      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } else if (view === "signup") {
      if (!fullName.trim()) {
        toast.error("Informe seu nome completo");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Conta criada! Verifique seu e-mail para confirmar o cadastro.");
      }
    }
    setLoading(false);
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaFactorId || mfaCode.length !== 6) return;
    setLoading(true);

    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: mfaFactorId,
      });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: challengeData.id,
        code: mfaCode,
      });
      if (verifyError) throw verifyError;

      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Código inválido. Tente novamente.");
      setMfaCode("");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      toast.error("Informe seu e-mail.");
      return;
    }

    setLoading(true);

    let { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    // Fallback para casos em que o redirectTo não está permitido no projeto Supabase
    if (error && /redirect/i.test(error.message)) {
      const fallback = await supabase.auth.resetPasswordForEmail(normalizedEmail);
      error = fallback.error;
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Se o e-mail existir na plataforma, enviaremos o link de recuperação. Verifique também o spam.");
    }

    setLoading(false);
  };

  const titles: Record<AuthView, { h1: string; sub: string }> = {
    login: { h1: "Entrar na minha conta.", sub: "Preencha os campos abaixo para acessar sua conta" },
    signup: { h1: "Criar uma conta.", sub: "Preencha os campos abaixo para começar" },
    forgot: { h1: "Recuperar senha.", sub: "Informe seu e-mail e enviaremos um link para redefinir sua senha" },
    mfa: { h1: "Verificação MFA.", sub: "Digite o código de 6 dígitos do seu aplicativo autenticador" },
  };

  return (
    <div className="min-h-screen flex flex-row-reverse">
      {/* Right panel - mecha */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={authMech} alt="Zordeon Mecha" className="absolute inset-0 w-full h-full object-cover scale-[1.15]" />
      </div>

      {/* Left panel - form */}
      <div className="w-full lg:w-1/2 bg-background flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center mb-10">
            <img src={zordeonDark} alt="Zordeon" className="h-9 w-auto" />
          </div>

          {/* Desktop logo small */}
          <div className="hidden lg:flex items-center mb-10">
            <img src={zordeonDark} alt="Zordeon" className="h-8 w-auto" />
          </div>

          {(view === "forgot" || view === "mfa") && (
            <button
              onClick={() => {
                if (view === "mfa") {
                  supabase.auth.signOut();
                  setMfaFactorId(null);
                  setMfaCode("");
                }
                setView("login");
              }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Voltar ao login
            </button>
          )}

          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
            {titles[view].h1}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mb-8">
            {titles[view].sub}
          </p>

          {view === "mfa" ? (
            <form onSubmit={handleMfaVerify} className="space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck size={32} className="text-primary" />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={mfaCode}
                  onChange={e => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                  className="w-full px-4 py-4 rounded-lg border border-border bg-background text-2xl text-foreground text-center tracking-[0.5em] font-mono focus:outline-none focus:border-primary transition-colors"
                />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Abra o Google Authenticator e digite o código exibido
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || mfaCode.length !== 6}
                className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                {loading ? "Verificando..." : "Verificar e entrar"}
              </button>
            </form>
          ) : view === "forgot" ? (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  required
                  className="peer w-full px-4 pt-5 pb-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-all peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none">
                  E-mail
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {view === "signup" && (
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder=" "
                    required
                    className="peer w-full px-4 pt-5 pb-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-all peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none">
                    Nome completo
                  </label>
                </div>
              )}

              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  required
                  className="peer w-full px-4 pt-5 pb-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-all peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none">
                  E-mail
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  required
                  minLength={6}
                  className="peer w-full px-4 pt-5 pb-2 pr-12 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-all peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {view === "login" && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Esqueci a senha
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Aguarde..." : view === "login" ? "Entrar" : "Criar conta"}
              </button>
            </form>
          )}

          {view !== "mfa" && (
            <p className="text-sm text-muted-foreground text-center mt-6">
              {view === "login" || view === "forgot" ? "Novo por aqui?" : "Já tem conta?"}{" "}
              <button
                onClick={() => setView(view === "signup" ? "login" : "signup")}
                className="text-primary font-medium hover:underline"
              >
                {view === "signup" ? "Fazer login" : "Criar uma conta"}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
