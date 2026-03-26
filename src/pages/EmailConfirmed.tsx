import { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import zordeonDark from "@/assets/logos/zordeon-dark.png";

const PRODUCTION_DOMAIN = "https://zordeon.com";

export default function EmailConfirmed() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    document.documentElement.classList.remove("dark");

    // If we're not on the production domain, redirect there immediately
    if (window.location.hostname !== "zordeon.com" && window.location.hostname !== "www.zordeon.com") {
      window.location.href = `${PRODUCTION_DOMAIN}/email-confirmado`;
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = `${PRODUCTION_DOMAIN}/auth`;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center mb-6">
          <img src={zordeonDark} alt="Zordeon" className="h-9 w-auto" />
        </div>

        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle size={48} className="text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
          Parabéns! 🎉
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Sua conta foi confirmada com sucesso! Agora você pode acessar a plataforma Zordeon.
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={14} className="animate-spin" />
          Redirecionando para o login em {countdown}s...
        </div>

        <button
          onClick={() => (window.location.href = `${PRODUCTION_DOMAIN}/auth`)}
          className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Ir para o login agora
        </button>
      </div>
    </div>
  );
}
