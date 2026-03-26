import { Search, Plus, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useImpersonation } from "@/contexts/ImpersonationContext";


export default function Clientes() {
  const { user } = useAuth();
  const { getEffectiveUserId } = useImpersonation();
  const effectiveUserId = getEffectiveUserId(user?.id);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [clientType, setClientType] = useState<"pf" | "pj">("pf");

  const { data: dbCustomers = [] } = useQuery({
    queryKey: ["customers", effectiveUserId],
    queryFn: async () => {
      const { data } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", effectiveUserId!)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!effectiveUserId,
  });

  const customers = dbCustomers;
  const isDemo = false;

  const addCustomer = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("customers").insert({
        user_id: user!.id,
        name, cpf_cnpj: cpf, email, phone, city,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente adicionado!");
      setShowForm(false);
      setName(""); setCpf(""); setEmail(""); setPhone(""); setCity("");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = customers.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()) &&
    (c.type || "pf") === clientType
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Clientes</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[48px] sm:min-h-0 text-base sm:text-sm" placeholder="Pesquise" />
          </div>
          <button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity min-h-[48px] sm:min-h-0">
            <Plus size={16} /> Novo Cliente
          </button>
        </div>
      </div>

      {isDemo && (
        <div className="px-4 py-2.5 rounded-lg bg-primary/5 border border-primary/20 text-xs text-primary">
          <BarChart3 className="inline w-4 h-4 mr-1 -mt-0.5" /> Exibindo dados de demonstração.
        </div>
      )}

      {showForm && (
        <div className="glass-card p-4 md:p-6 max-w-2xl space-y-4">
          <h2 className="font-heading font-semibold text-foreground">Adicionar Cliente</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome completo" className="w-full px-4 py-3 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            <input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="CPF / CNPJ" className="w-full px-4 py-3 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" className="w-full px-4 py-3 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Celular" className="w-full px-4 py-3 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="Cidade" className="w-full px-4 py-3 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground">Cancelar</button>
            <button onClick={() => addCustomer.mutate()} disabled={!name.trim()} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50">Salvar</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        <button onClick={() => setClientType("pf")} className={`px-4 py-2.5 text-sm font-medium transition-colors ${clientType === "pf" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>Pessoa Física</button>
        <button onClick={() => setClientType("pj")} className={`px-4 py-2.5 text-sm font-medium transition-colors ${clientType === "pj" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>Pessoa Jurídica</button>
      </div>

      <div className="glass-card overflow-hidden hidden sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left px-5 py-3 font-medium">Nome</th>
              <th className="text-left px-5 py-3 font-medium">CPF</th>
              <th className="text-left px-5 py-3 font-medium">E-mail</th>
              <th className="text-left px-5 py-3 font-medium">Celular</th>
              <th className="text-left px-5 py-3 font-medium">Cidade</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Nenhum cliente cadastrado</td></tr>
            ) : filtered.map((c: any) => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 text-foreground font-medium">{c.name}</td>
                <td className="px-5 py-3 text-foreground">{c.cpf_cnpj}</td>
                <td className="px-5 py-3 text-foreground">{c.email}</td>
                <td className="px-5 py-3 text-foreground">{c.phone}</td>
                <td className="px-5 py-3 text-foreground">{c.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-0">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground text-sm glass-card">Nenhum cliente cadastrado</p>
        ) : filtered.map((c: any) => (
          <div key={c.id} className="py-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">{c.name}</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">CPF</span><span className="text-foreground">{c.cpf_cnpj}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">E-mail</span><span className="text-foreground">{c.email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Celular</span><span className="text-foreground">{c.phone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Cidade</span><span className="text-foreground">{c.city}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
