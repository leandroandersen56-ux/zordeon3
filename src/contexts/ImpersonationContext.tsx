import { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ImpersonationContextType {
  impersonatedUserId: string | null;
  impersonatedProfile: { full_name: string; email: string } | null;
  startImpersonation: (userId: string) => void;
  stopImpersonation: () => void;
  isImpersonating: boolean;
  /** Returns impersonated user ID if active, otherwise the real user ID */
  getEffectiveUserId: (realUserId: string | undefined) => string | undefined;
}

const ImpersonationContext = createContext<ImpersonationContextType>({
  impersonatedUserId: null,
  impersonatedProfile: null,
  startImpersonation: () => {},
  stopImpersonation: () => {},
  isImpersonating: false,
  getEffectiveUserId: (id) => id,
});

export const useImpersonation = () => useContext(ImpersonationContext);

export function ImpersonationProvider({ children }: { children: ReactNode }) {
  const [impersonatedUserId, setImpersonatedUserId] = useState<string | null>(null);

  const { data: impersonatedProfile = null } = useQuery({
    queryKey: ["impersonated-profile", impersonatedUserId],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", impersonatedUserId!)
        .single();
      return data;
    },
    enabled: !!impersonatedUserId,
  });

  const startImpersonation = (userId: string) => setImpersonatedUserId(userId);
  const stopImpersonation = () => setImpersonatedUserId(null);

  const getEffectiveUserId = (realUserId: string | undefined) => {
    return impersonatedUserId || realUserId;
  };

  return (
    <ImpersonationContext.Provider
      value={{
        impersonatedUserId,
        impersonatedProfile,
        startImpersonation,
        stopImpersonation,
        isImpersonating: !!impersonatedUserId,
        getEffectiveUserId,
      }}
    >
      {children}
    </ImpersonationContext.Provider>
  );
}
