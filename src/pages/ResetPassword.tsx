import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import zordeonWhite from "@/assets/logos/zordeon-white.png";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a recovery session from the URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get("type");

    if (type === "recovery") {
      setValidSession(true);
      setChecking(false);
      return;
    }

    // Also check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setValidSession(true);
      }
      setChecking(false);
    });
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
    } else {
      setSuccess(true);
      toast.success("Senha atualizada com sucesso!");
      setTimeout(() => navigate("/auth"), 3000);
    }
    setLoading(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-10">
          <img src={zordeonWhite} alt="Zordeon" className="h-8 w-auto" />
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-success" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Senha atualizada!</h1>
            <p className="text-muted-foreground text-sm">
              Sua senha foi redefinida com sucesso. Você será redirecionado para o login...
            </p>
          </div>
        ) : !validSession ? (
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-heading font-bold text-foreground">Link inválido ou expirado</h1>
            <p className="text-muted-foreground text-sm">
              Este link de recuperação não é válido ou já expirou. Solicite um novo link.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="mt-4 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Voltar ao login
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2 text-center">
              Redefinir senha
            </h1>
            <p className="text-muted-foreground text-sm text-center mb-8">
              Crie uma nova senha para sua conta
            </p>

            <form onSubmit={handleReset} className="space-y-5">
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
                  Nova senha
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder=" "
                  required
                  minLength={6}
                  className="peer w-full px-4 pt-5 pb-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-all peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none">
                  Confirmar nova senha
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Atualizando..." : "Redefinir senha"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
