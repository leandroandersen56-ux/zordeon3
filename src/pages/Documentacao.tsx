import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, Copy, Check, ExternalLink } from "lucide-react";

/* ── Types ── */
type Method = "GET" | "POST" | "PUT" | "DELETE";

interface NavEndpoint {
  method: Method;
  label: string;
  anchor: string;
}

interface NavSection {
  title: string;
  items?: { label: string; anchor: string }[];
  endpoints?: NavEndpoint[];
  open?: boolean;
}

/* ── Zordeon official colors ── */
const C = {
  bg: "#0e1112",
  bg2: "#141718",
  bg3: "#1a1d1e",
  surface: "#1e2122",
  surface2: "#252829",
  border: "#2a2d2e",
  border2: "#353839",
  primary: "#cc0854",        // Rosa/Magenta Zordeon
  primaryDim: "rgba(204,8,84,0.12)",
  primaryGlow: "rgba(204,8,84,0.35)",
  green: "#10b981",
  amber: "#f59e0b",
  red: "#ef4444",
  violet: "#a855f7",
  text: "#e2e8f0",
  text2: "#94a3b8",
  text3: "#64748b",
  codeBg: "#0a0d0e",
};

/* ── Data ── */
const navSections: NavSection[] = [
  {
    title: "Introdução",
    items: [
      { label: "Visão Geral", anchor: "visao-geral" },
      { label: "Autenticação", anchor: "autenticacao" },
      { label: "Tokenização de Cartão", anchor: "tokenizacao" },
      { label: "Eventos & Webhooks", anchor: "webhooks" },
    ],
  },
  {
    title: "Pagamentos",
    endpoints: [
      { method: "POST", label: "Criar PIX", anchor: "criar-pix" },
      { method: "GET", label: "Status PIX", anchor: "status-pix" },
      { method: "POST", label: "Pagar com Cartão", anchor: "pagar-cartao" },
      { method: "POST", label: "Gerar Boleto", anchor: "gerar-boleto" },
      { method: "GET", label: "Status Boleto", anchor: "status-boleto" },
      { method: "POST", label: "Criar Link de Pag.", anchor: "criar-link" },
      { method: "GET", label: "Listar Links", anchor: "listar-links" },
      { method: "PUT", label: "Atualizar Link", anchor: "atualizar-link" },
      { method: "DELETE", label: "Deletar Link", anchor: "deletar-link" },
    ],
  },
  {
    title: "Transações",
    endpoints: [
      { method: "GET", label: "Listar Transações", anchor: "listar-transacoes" },
      { method: "GET", label: "Buscar Transação", anchor: "buscar-transacao" },
      { method: "POST", label: "Estornar Transação", anchor: "estornar-transacao" },
      { method: "POST", label: "Capturar Pré-auth", anchor: "capturar-preauth" },
    ],
  },
  {
    title: "Carteira",
    endpoints: [
      { method: "GET", label: "Consultar Saldo", anchor: "consultar-saldo" },
      { method: "POST", label: "Realizar Saque", anchor: "realizar-saque" },
      { method: "POST", label: "Antecipar Recebível", anchor: "antecipar-recebivel" },
      { method: "GET", label: "Extrato", anchor: "extrato" },
      { method: "GET", label: "Chaves PIX", anchor: "chaves-pix" },
    ],
  },
  {
    title: "Clientes",
    endpoints: [
      { method: "POST", label: "Criar Cliente", anchor: "criar-cliente" },
      { method: "GET", label: "Listar Clientes", anchor: "listar-clientes" },
      { method: "GET", label: "Buscar Cliente", anchor: "buscar-cliente" },
      { method: "PUT", label: "Atualizar Cliente", anchor: "atualizar-cliente" },
      { method: "DELETE", label: "Deletar Cliente", anchor: "deletar-cliente" },
    ],
  },
  {
    title: "Integrações",
    endpoints: [
      { method: "POST", label: "Cadastrar Webhook", anchor: "cadastrar-webhook" },
      { method: "GET", label: "Listar Webhooks", anchor: "listar-webhooks" },
      { method: "DELETE", label: "Remover Webhook", anchor: "remover-webhook" },
      { method: "GET", label: "Chaves de API", anchor: "chaves-api" },
      { method: "POST", label: "Criar Chave de API", anchor: "criar-chave-api" },
    ],
  },
];

const methodStyles: Record<Method, { bg: string; color: string; borderColor: string }> = {
  POST: { bg: "rgba(16,185,129,0.15)", color: "#34d399", borderColor: "rgba(16,185,129,0.3)" },
  GET: { bg: "rgba(204,8,84,0.15)", color: C.primary, borderColor: "rgba(204,8,84,0.3)" },
  PUT: { bg: "rgba(245,158,11,0.15)", color: "#fbbf24", borderColor: "rgba(245,158,11,0.3)" },
  DELETE: { bg: "rgba(239,68,68,0.15)", color: "#f87171", borderColor: "rgba(239,68,68,0.3)" },
};

/* ── Sub-components ── */

function MethodBadge({ method, size = "sm" }: { method: Method; size?: "sm" | "md" }) {
  const s = methodStyles[method];
  return (
    <span
      className={cn("font-mono font-bold rounded border", size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-3 py-1 min-w-[60px] text-center inline-block")}
      style={{ background: s.bg, color: s.color, borderColor: s.borderColor }}
    >
      {method}
    </span>
  );
}

function CodeBlock({ lang, title, children }: { lang: string; title?: string; children: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-xl overflow-hidden mb-5" style={{ background: C.codeBg, border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded" style={{ color: C.text3, background: C.surface2 }}>{lang}</span>
        {title && <span className="text-xs" style={{ color: C.text2 }}>{title}</span>}
        <button onClick={copy} className="ml-auto transition-colors" style={{ color: C.text3 }}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="p-5 overflow-x-auto text-[13px] leading-relaxed font-mono" style={{ color: C.text2 }}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

function InfoBox({ type, title, children }: { type: "note" | "warn" | "tip" | "danger"; title: string; children: React.ReactNode }) {
  const styles: Record<string, { bg: string; border: string }> = {
    note: { bg: C.primaryDim, border: C.primary },
    warn: { bg: "rgba(245,158,11,0.08)", border: C.amber },
    tip: { bg: "rgba(16,185,129,0.08)", border: C.green },
    danger: { bg: "rgba(239,68,68,0.08)", border: C.red },
  };
  const icons = { note: "💡", warn: "⚠️", tip: "✅", danger: "🚨" };
  const s = styles[type];
  return (
    <div className="rounded-xl p-4 mb-5 text-sm" style={{ background: s.bg, borderLeft: `3px solid ${s.border}`, color: C.text }}>
      <strong className="block mb-1 text-xs uppercase tracking-wider">{icons[type]} {title}</strong>
      {children}
    </div>
  );
}

function ParamsTable({ params }: { params: { name: string; type: string; required?: boolean; desc: string }[] }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-[13px]">
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border2}` }}>
            <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.text3 }}>Campo</th>
            <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.text3 }}>Tipo</th>
            <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.text3 }}>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr key={p.name} style={{ borderBottom: `1px solid ${C.border}` }}>
              <td className="px-3 py-2.5 font-mono text-[12.5px]" style={{ color: C.primary }}>
                {p.name}
                {p.required ? <span className="text-red-400 text-[10px] font-semibold align-super ml-0.5">*</span> : <span className="text-[10px] font-semibold align-super ml-0.5" style={{ color: C.text3 }}>opt</span>}
              </td>
              <td className="px-3 py-2.5"><span className="text-[11px] font-mono" style={{ color: C.violet }}>{p.type}</span></td>
              <td className="px-3 py-2.5" style={{ color: C.text2 }}>{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EndpointCard({ method, path, summary, children }: { method: Method; path: string; summary: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] overflow-hidden mb-7" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-3.5 px-6 py-4" style={{ background: C.surface2, borderBottom: `1px solid ${C.border}` }}>
        <MethodBadge method={method} size="md" />
        <span className="font-mono text-sm" style={{ color: C.text }}>{path}</span>
        <span className="ml-auto text-[13px] hidden sm:block" style={{ color: C.text3 }}>{summary}</span>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function ResponseBadge({ code, desc }: { code: number; desc: string }) {
  const color = code < 300 ? "bg-emerald-500/15 text-emerald-400" : code < 500 ? "bg-amber-500/15 text-amber-400" : "bg-red-500/15 text-red-400";
  return (
    <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg mb-2" style={{ border: `1px solid ${C.border}` }}>
      <span className={cn("font-mono text-xs font-bold px-2.5 py-0.5 rounded", color)}>{code}</span>
      <p className="text-[13px]" style={{ color: C.text2 }}>{desc}</p>
    </div>
  );
}

/* ── Sidebar Nav ── */
function Sidebar({ active, onNavigate }: { active: string; onNavigate: (anchor: string) => void }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (title: string) => setCollapsed((p) => ({ ...p, [title]: !p[title] }));

  return (
    <aside className="w-[280px] min-w-[280px] fixed top-0 left-0 bottom-0 overflow-y-auto z-50 hidden lg:block" style={{ background: C.bg2, borderRight: `1px solid ${C.border}` }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-lg" style={{ background: `linear-gradient(135deg, ${C.primary}, #e91e8c)` }}>🦅</div>
        <span className="font-['Sora'] font-bold text-lg" style={{ color: C.text }}>Zordeon</span>
        <span className="text-[11px] px-2 py-0.5 rounded-full ml-auto" style={{ color: C.text3, background: C.surface, border: `1px solid ${C.border}` }}>v1.0</span>
      </div>

      {/* Nav sections */}
      <nav className="py-4">
        {navSections.map((sec) => (
          <div key={sec.title} className="mb-1">
            <button onClick={() => sec.endpoints && toggle(sec.title)} className="w-full flex items-center justify-between px-6 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors" style={{ color: C.text3 }}>
              {sec.title}
              {sec.endpoints && <ChevronDown size={12} className={cn("transition-transform", collapsed[sec.title] && "-rotate-90")} />}
            </button>

            {!collapsed[sec.title] && sec.items?.map((item) => (
              <button
                key={item.anchor}
                onClick={() => onNavigate(item.anchor)}
                className="block w-full text-left px-6 py-2 text-[13.5px] border-l-2 transition-all"
                style={{
                  color: active === item.anchor ? C.primary : C.text2,
                  background: active === item.anchor ? C.primaryDim : "transparent",
                  borderLeftColor: active === item.anchor ? C.primary : "transparent",
                }}
              >
                {item.label}
              </button>
            ))}

            {!collapsed[sec.title] && sec.endpoints?.map((ep) => (
              <button
                key={ep.anchor}
                onClick={() => onNavigate(ep.anchor)}
                className="flex items-center gap-2 w-full text-left px-6 py-2 text-[13.5px] border-l-2 transition-all"
                style={{
                  color: active === ep.anchor ? C.primary : C.text2,
                  background: active === ep.anchor ? C.primaryDim : "transparent",
                  borderLeftColor: active === ep.anchor ? C.primary : "transparent",
                }}
              >
                <MethodBadge method={ep.method} />
                {ep.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}

/* ── Main Page ── */
export default function Documentacao() {
  const [active, setActive] = useState("visao-geral");

  const navigate = (anchor: string) => {
    setActive(anchor);
    document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen font-['DM_Sans',sans-serif]" style={{ background: C.bg, color: C.text, fontSize: 15, lineHeight: 1.7 }}>
      <Sidebar active={active} onNavigate={navigate} />

      <div className="lg:ml-[280px] flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-40 px-6 lg:px-12 py-4 flex items-center gap-4" style={{ background: C.bg2, borderBottom: `1px solid ${C.border}` }}>
          <span className="text-white text-[11px] font-bold px-3 py-1 rounded-full font-mono" style={{ background: `linear-gradient(135deg, ${C.primary}, #e91e8c)` }}>API</span>
          <span className="font-['Sora'] font-semibold text-[15px]">Zordeon — Documentação de Referência</span>
          <div className="ml-auto hidden sm:flex items-center gap-2 text-[12px] font-mono px-3.5 py-1.5 rounded-md" style={{ color: C.text3, background: C.surface, border: `1px solid ${C.border}` }}>
            <span style={{ color: C.primary }}>https://</span>api.zordeon.com.br/v1
          </div>
        </div>

        {/* Content */}
        <div className="px-6 lg:px-12 py-14 max-w-[900px]">

          {/* ═══ INTRO ═══ */}
          <section id="visao-geral" className="mb-20 scroll-mt-20">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] mb-3" style={{ color: C.primary }}>
              <span className="w-5 h-0.5 rounded-full" style={{ background: C.primary }} /> Introdução
            </div>
            <h1 className="font-['Sora'] text-4xl font-extrabold leading-tight mb-4">Zordeon API</h1>
            <p style={{ color: C.text2 }} className="mb-6">
              API REST para processamento de pagamentos no Brasil. Suporte completo a PIX, Cartão de Crédito (com tokenização) e Boleto Bancário, além de links de pagamento, gestão de carteira e webhooks em tempo real.
            </p>

            <div className="rounded-2xl p-8 mb-8 relative overflow-hidden" style={{ border: `1px solid ${C.border2}`, background: `linear-gradient(135deg, ${C.bg3}, ${C.surface2})` }}>
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: C.primaryGlow }} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm relative z-10">
                {["REST / JSON", "HTTPS obrigatório", "Webhooks em tempo real", "Sandbox disponível"].map((f) => (
                  <div key={f} className="flex items-center gap-2" style={{ color: C.text }}>
                    <span className="text-emerald-400">✓</span> {f}
                  </div>
                ))}
              </div>
            </div>

            <InfoBox type="note" title="Base URL de Produção">
              Todas as requisições devem ser feitas para: <code className="font-mono" style={{ color: C.primary }}>https://api.zordeon.com.br/v1</code>
            </InfoBox>

            <h3 className="font-['Sora'] text-lg font-semibold mb-3">Formatos de Resposta</h3>
            <p style={{ color: C.text2 }}>
              Todas as respostas são retornadas em JSON com charset UTF-8. Datas seguem ISO 8601. Valores monetários são sempre em centavos (inteiro).
            </p>
          </section>

          {/* ═══ AUTH ═══ */}
          <section id="autenticacao" className="mb-20 scroll-mt-20">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] mb-3" style={{ color: C.primary }}>
              <span className="w-5 h-0.5 rounded-full" style={{ background: C.primary }} /> Segurança
            </div>
            <h2 className="font-['Sora'] text-2xl font-bold mb-3">Autenticação</h2>
            <p style={{ color: C.text2 }} className="mb-4">
              A Zordeon utiliza autenticação via API Key enviada no header de todas as requisições. Cada conta possui chaves separadas para sandbox e produção.
            </p>

            <CodeBlock lang="HTTP" title="Header obrigatório em todas as requisições">
{`Authorization: Bearer YOUR_SECRET_KEY
Content-Type: application/json`}
            </CodeBlock>

            <InfoBox type="warn" title="Segurança">
              Nunca exponha sua chave secreta no frontend. Use a chave pública apenas para tokenização de cartão no client-side.
            </InfoBox>

            <h3 className="font-['Sora'] text-lg font-semibold mb-3">Tipos de Chave</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-[13px]">
                <thead><tr style={{ borderBottom: `1px solid ${C.border2}` }}>
                  <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.text3 }}>Tipo</th>
                  <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.text3 }}>Prefixo</th>
                  <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.text3 }}>Uso</th>
                </tr></thead>
                <tbody>
                  {[
                    ["sk_live_...", "sk_live_", "Chave secreta de produção — usar apenas no backend"],
                    ["pk_live_...", "pk_live_", "Chave pública de produção — tokenização no frontend"],
                    ["sk_test_...", "sk_test_", "Chave secreta sandbox — testes sem cobranças reais"],
                    ["pk_test_...", "pk_test_", "Chave pública sandbox — testes de tokenização"],
                  ].map(([tipo, prefix, uso]) => (
                    <tr key={tipo} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td className="px-3 py-2.5 font-mono text-[12.5px]" style={{ color: C.primary }}>{tipo}</td>
                      <td className="px-3 py-2.5 font-mono text-[11px]" style={{ color: C.violet }}>{prefix}</td>
                      <td className="px-3 py-2.5" style={{ color: C.text2 }}>{uso}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ═══ TOKENIZAÇÃO ═══ */}
          <section id="tokenizacao" className="mb-20 scroll-mt-20">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] mb-3" style={{ color: C.primary }}>
              <span className="w-5 h-0.5 rounded-full" style={{ background: C.primary }} /> Cartão de Crédito
            </div>
            <h2 className="font-['Sora'] text-2xl font-bold mb-3">Tokenização de Cartão</h2>
            <p style={{ color: C.text2 }} className="mb-6">
              Para processar pagamentos com cartão, os dados sensíveis devem ser tokenizados no frontend antes de serem enviados ao backend.
            </p>

            {/* Flow */}
            <div className="flex items-center gap-0 overflow-x-auto pb-4 mb-6">
              {[
                { step: "Passo 1", label: "Incluir biblioteca JS" },
                { step: "Passo 2", label: "Definir chave pública" },
                { step: "Passo 3", label: "Gerar token_id" },
                { step: "Passo 4", label: "Enviar ao backend" },
                { step: "Passo 5", label: "Processar cobrança" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-0 shrink-0">
                  <div className="rounded-xl px-4 py-3 text-center min-w-[130px]" style={{ background: C.surface, border: `1px solid ${C.border2}` }}>
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: C.primary }}>{s.step}</div>
                    <div className="text-[13px]" style={{ color: C.text }}>{s.label}</div>
                  </div>
                  {i < 4 && <span className="text-xl px-2" style={{ color: C.text3 }}>→</span>}
                </div>
              ))}
            </div>

            <CodeBlock lang="HTML" title="Incluir no head da página">
{`<script src="https://api.zordeon.com.br/functions/v1/js"></script>`}
            </CodeBlock>

            <CodeBlock lang="JavaScript" title="Frontend — nunca no backend">
{`Zordeon.setPublicKey("pk_live_SUA_CHAVE_PUBLICA");

const token_id = await Zordeon.encrypt({
  number: "4111111111111111",
  holderName: "João Silva",
  expMonth: 1,
  expYear: 2027,
  cvv: "456",
  amount: 10000,
  installments: 1
});

await fetch("/api/checkout", {
  method: "POST",
  body: JSON.stringify({ token_id, orderId: "order_123" })
});`}
            </CodeBlock>

            <InfoBox type="tip" title="Boas práticas">
              O token_id gerado é de uso único e expira em 15 minutos. Gere um novo token a cada tentativa de pagamento.
            </InfoBox>
          </section>

          {/* ═══ WEBHOOKS ═══ */}
          <section id="webhooks" className="mb-20 scroll-mt-20">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] mb-3" style={{ color: C.primary }}>
              <span className="w-5 h-0.5 rounded-full" style={{ background: C.primary }} /> Eventos
            </div>
            <h2 className="font-['Sora'] text-2xl font-bold mb-3">Eventos & Webhooks</h2>
            <p style={{ color: C.text2 }} className="mb-4">
              A Zordeon envia notificações automáticas via HTTP POST para URLs cadastradas sempre que o status de uma transação muda.
            </p>

            <InfoBox type="warn" title="Idempotência obrigatória">
              O mesmo evento pode ser entregue mais de uma vez. Sempre verifique o campo event_id antes de processar.
            </InfoBox>

            <h3 className="font-['Sora'] text-lg font-semibold mb-3">Eventos disponíveis</h3>
            <div className="flex flex-col gap-2 mb-6">
              {[
                ["payment.approved", "Pagamento aprovado e confirmado", "bg-emerald-400"],
                ["payment.pending", "Pagamento aguardando confirmação", "bg-amber-400"],
                ["payment.refused", "Pagamento recusado pela operadora", "bg-red-400"],
                ["payment.expired", "PIX ou boleto expirado", `bg-[${C.text3}]`],
                ["payment.refunded", "Estorno total concluído", "bg-violet-400"],
                ["payment.partially_refunded", "Estorno parcial concluído", "bg-violet-400"],
                ["payment.chargeback", "Chargeback iniciado pelo portador", "bg-red-400"],
                ["withdrawal.approved", "Saque/transferência aprovado", "bg-emerald-400"],
                ["withdrawal.failed", "Saque falhou", "bg-red-400"],
              ].map(([name, desc, dot]) => (
                <div key={name} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <span className={cn("w-2 h-2 rounded-full shrink-0", dot)} />
                  <span className="font-mono text-[12.5px] min-w-[200px]" style={{ color: C.primary }}>{name}</span>
                  <span className="text-[13px]" style={{ color: C.text2 }}>{desc}</span>
                </div>
              ))}
            </div>

            <CodeBlock lang="JSON" title="payment.approved — exemplo PIX">
{`{
  "event_id": "evt_7f3a92b1c4d5e6f7",
  "event": "payment.approved",
  "created_at": "2026-03-04T14:32:17Z",
  "data": {
    "id": "txn_abc123def456",
    "status": "approved",
    "method": "pix",
    "amount": 15000,
    "currency": "BRL",
    "paid_at": "2026-03-04T14:32:15Z",
    "customer": {
      "name": "Lucas Gabriel Silveira",
      "document": "95711476483",
      "email": "lucas@email.com"
    },
    "metadata": { "order_id": "order_789" }
  }
}`}
            </CodeBlock>

            <h3 className="font-['Sora'] text-lg font-semibold mb-3">Verificação de Assinatura</h3>
            <p style={{ color: C.text2 }} className="mb-4">
              Todo webhook inclui o header <code className="font-mono" style={{ color: C.primary }}>X-Zordeon-Signature</code> com um HMAC-SHA256 do corpo da requisição.
            </p>

            <CodeBlock lang="Node.js">
{`const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  );
}`}
            </CodeBlock>

            <InfoBox type="tip" title="Resposta esperada">
              Responda o webhook com HTTP 200 o mais rápido possível. A Zordeon reenvia até 7 vezes com backoff exponencial.
            </InfoBox>
          </section>

          <hr style={{ borderColor: C.border }} className="my-10" />

          {/* ═══ CRIAR PIX ═══ */}
          <section id="criar-pix" className="mb-20 scroll-mt-20">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] mb-3" style={{ color: C.primary }}>
              <span className="w-5 h-0.5 rounded-full" style={{ background: C.primary }} /> Pagamentos
            </div>
            <h2 className="font-['Sora'] text-2xl font-bold mb-6">Criar cobrança PIX</h2>

            <EndpointCard method="POST" path="/payments/pix" summary="Gera QR Code PIX e copia-e-cola">
              <p className="text-sm mb-5" style={{ color: C.text2 }}>
                Cria uma cobrança PIX e retorna o QR Code em base64 e o código copia-e-cola. Expira em 30 minutos por padrão.
              </p>

              <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: C.text3 }}>Body Parameters</div>
              <ParamsTable params={[
                { name: "amount", type: "integer", required: true, desc: "Valor em centavos (ex: 15000 = R$ 150,00)" },
                { name: "customer", type: "object", required: true, desc: "Dados do pagador (ver objeto abaixo)" },
                { name: "description", type: "string", desc: "Descrição exibida no comprovante (max 140 chars)" },
                { name: "expires_in", type: "integer", desc: "Expiração em segundos (padrão: 1800, máx: 86400)" },
                { name: "external_id", type: "string", desc: "ID externo do seu sistema para reconciliação" },
                { name: "webhook_url", type: "string", desc: "URL para receber notificação desta transação" },
                { name: "metadata", type: "object", desc: "Dados adicionais retornados nos webhooks" },
              ]} />

              <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: C.text3 }}>Objeto customer</div>
              <ParamsTable params={[
                { name: "name", type: "string", required: true, desc: "Nome completo do pagador" },
                { name: "document", type: "string", required: true, desc: "CPF (11 dígitos) ou CNPJ (14 dígitos)" },
                { name: "email", type: "string", desc: "E-mail para envio de comprovante" },
                { name: "phone", type: "string", desc: "Celular com DDD, apenas números" },
              ]} />

              <CodeBlock lang="cURL" title="Exemplo de requisição">
{`curl -X POST https://api.zordeon.com.br/v1/payments/pix \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 15000,
    "description": "Ingresso VIP-001",
    "external_id": "order_789",
    "expires_in": 1800,
    "customer": {
      "name": "Lucas Gabriel Silveira",
      "document": "95711476483",
      "email": "lucas@email.com",
      "phone": "5547997300093"
    },
    "metadata": {
      "product": "Ingresso VIP-001",
      "event": "Show 2026"
    }
  }'`}
              </CodeBlock>

              <CodeBlock lang="JSON" title="Resposta 201 — Sucesso">
{`{
  "id": "txn_abc123def456",
  "status": "pending",
  "method": "pix",
  "amount": 15000,
  "currency": "BRL",
  "expires_at": "2026-03-04T15:02:17Z",
  "pix": {
    "qr_code": "00020126580014br.gov.bcb.pix0136...",
    "qr_code_base64": "data:image/png;base64,iVBORw0KGgo...",
    "copy_paste": "00020126580014br.gov.bcb.pix0136..."
  },
  "customer": {
    "name": "Lucas Gabriel Silveira",
    "document": "95711476483"
  },
  "external_id": "order_789",
  "created_at": "2026-03-04T14:32:17Z"
}`}
              </CodeBlock>

              <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: C.text3 }}>Respostas</div>
              <ResponseBadge code={201} desc="Cobrança PIX criada com sucesso" />
              <ResponseBadge code={400} desc="Parâmetros inválidos ou ausentes" />
              <ResponseBadge code={401} desc="Chave de API inválida ou ausente" />
              <ResponseBadge code={422} desc="CPF/CNPJ inválido ou valor abaixo do mínimo" />
            </EndpointCard>
          </section>

          {/* ═══ STATUS PIX ═══ */}
          <section id="status-pix" className="mb-20 scroll-mt-20">
            <EndpointCard method="GET" path="/payments/pix/{id}" summary="Consulta status de um PIX">
              <p className="text-sm mb-5" style={{ color: C.text2 }}>
                Consulta o status atual de uma cobrança PIX. Use para polling enquanto aguarda confirmação.
              </p>

              <CodeBlock lang="JSON" title="Resposta — PIX pago">
{`{
  "id": "txn_abc123def456",
  "status": "approved",
  "amount": 15000,
  "paid_at": "2026-03-04T14:35:22Z",
  "e2e_id": "E60746948202603041435a1234bcdef"
}`}
              </CodeBlock>

              <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: C.text3 }}>Status possíveis</div>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-[13px]">
                  <thead><tr style={{ borderBottom: `1px solid ${C.border2}` }}>
                    <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.text3 }}>Status</th>
                    <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.text3 }}>Descrição</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["pending", "Aguardando pagamento"],
                      ["approved", "Pago e confirmado"],
                      ["expired", "Expirou sem pagamento"],
                      ["refunded", "Estornado"],
                    ].map(([s, d]) => (
                      <tr key={s} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td className="px-3 py-2.5 font-mono text-[12.5px]" style={{ color: C.primary }}>{s}</td>
                        <td className="px-3 py-2.5" style={{ color: C.text2 }}>{d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </EndpointCard>
          </section>

          {/* ═══ PAGAR CARTÃO ═══ */}
          <section id="pagar-cartao" className="mb-20 scroll-mt-20">
            <EndpointCard method="POST" path="/payments/card" summary="Cobrar com cartão tokenizado">
              <p className="text-sm mb-5" style={{ color: C.text2 }}>
                Processa pagamento com cartão de crédito usando o token_id gerado pela biblioteca de tokenização.
              </p>

              <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: C.text3 }}>Body Parameters</div>
              <ParamsTable params={[
                { name: "token_id", type: "string", required: true, desc: "Token gerado por Zordeon.encrypt()" },
                { name: "amount", type: "integer", required: true, desc: "Valor total em centavos" },
                { name: "installments", type: "integer", required: true, desc: "Número de parcelas (1-12)" },
                { name: "customer", type: "object", required: true, desc: "Dados do pagador" },
                { name: "capture", type: "boolean", desc: "Captura automática (padrão: true). false = pré-autorização" },
                { name: "description", type: "string", desc: "Descrição na fatura do cartão" },
                { name: "external_id", type: "string", desc: "ID externo para reconciliação" },
                { name: "three_ds", type: "boolean", desc: "Habilitar autenticação 3DS (padrão: false)" },
              ]} />

              <CodeBlock lang="cURL">
{`curl -X POST https://api.zordeon.com.br/v1/payments/card \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "token_id": "tok_3f8a9b2c1d4e5f6g",
    "amount": 50000,
    "installments": 3,
    "description": "TALONPAY*INGRESSO",
    "capture": true,
    "customer": {
      "name": "João Silva",
      "document": "12345678909",
      "email": "joao@email.com"
    }
  }'`}
              </CodeBlock>

              <CodeBlock lang="JSON" title="Resposta 200 — Aprovado">
{`{
  "id": "txn_xyz789",
  "status": "approved",
  "method": "credit_card",
  "amount": 50000,
  "installments": 3,
  "installment_amount": 16667,
  "card": {
    "brand": "visa",
    "last4": "1111",
    "holder_name": "JOAO SILVA"
  },
  "authorization_code": "AUTH_8823",
  "nsu": "NSU_449921",
  "approved_at": "2026-03-04T14:33:01Z"
}`}
              </CodeBlock>
            </EndpointCard>
          </section>

          {/* ═══ BOLETO ═══ */}
          <section id="gerar-boleto" className="mb-20 scroll-mt-20">
            <EndpointCard method="POST" path="/payments/boleto" summary="Gerar boleto bancário">
              <ParamsTable params={[
                { name: "amount", type: "integer", required: true, desc: "Valor em centavos (mínimo: 500 = R$ 5,00)" },
                { name: "customer", type: "object", required: true, desc: "Dados do pagador — endereço completo obrigatório" },
                { name: "due_date", type: "string", required: true, desc: "Vencimento YYYY-MM-DD (mínimo: D+1)" },
                { name: "description", type: "string", desc: "Instrução exibida no boleto (max 255 chars)" },
                { name: "fine", type: "object", desc: "Multa após vencimento" },
                { name: "interest", type: "object", desc: "Juros mensais" },
                { name: "discount", type: "object", desc: "Desconto antecipado" },
              ]} />

              <CodeBlock lang="JSON" title="Resposta 201 — Boleto gerado">
{`{
  "id": "txn_bol456",
  "status": "pending",
  "method": "boleto",
  "amount": 9990,
  "due_date": "2026-03-10",
  "boleto": {
    "barcode": "23793.38128 60007.827136 96000.063305 1 95310000009990",
    "url": "https://boleto.zordeon.com.br/txn_bol456",
    "pdf_url": "https://boleto.zordeon.com.br/txn_bol456/pdf"
  },
  "created_at": "2026-03-04T10:00:00Z"
}`}
              </CodeBlock>
            </EndpointCard>
          </section>

          {/* ═══ CRIAR LINK ═══ */}
          <section id="criar-link" className="mb-20 scroll-mt-20">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] mb-3" style={{ color: C.primary }}>
              <span className="w-5 h-0.5 rounded-full" style={{ background: C.primary }} /> Links de Pagamento
            </div>
            <h2 className="font-['Sora'] text-2xl font-bold mb-6">Criar Link de Pagamento</h2>

            <EndpointCard method="POST" path="/payment-links" summary="Cria link de checkout hospedado">
              <ParamsTable params={[
                { name: "name", type: "string", required: true, desc: "Nome do produto/link exibido no checkout" },
                { name: "amount", type: "integer", required: true, desc: "Valor em centavos. Use 0 para valor livre" },
                { name: "methods", type: "array", required: true, desc: 'Métodos aceitos: ["pix","credit_card","boleto"]' },
                { name: "description", type: "string", desc: "Descrição exibida no checkout" },
                { name: "max_uses", type: "integer", desc: "Limite de usos. null = ilimitado" },
                { name: "expires_at", type: "string", desc: "Data de expiração ISO 8601" },
                { name: "redirect_url", type: "string", desc: "URL de redirecionamento pós-pagamento" },
                { name: "installments", type: "integer", desc: "Máximo de parcelas no cartão (1-12)" },
                { name: "custom_slug", type: "string", desc: "Slug da URL personalizado" },
                { name: "image_url", type: "string", desc: "URL da imagem do produto" },
              ]} />

              <CodeBlock lang="JSON" title="Resposta 201">
{`{
  "id": "lnk_9f3a2b1c",
  "name": "Ingresso VIP-001",
  "amount": 20000,
  "status": "active",
  "url": "https://minhaloja.checkout.zordeon.com.br/ingresso-vip",
  "short_url": "https://pay.zordeon.com.br/lnk_9f3a2b1c",
  "methods": ["pix", "credit_card", "boleto"],
  "stats": { "visits": 0, "conversions": 0, "revenue": 0 },
  "created_at": "2026-03-04T10:00:00Z"
}`}
              </CodeBlock>
            </EndpointCard>
          </section>

          {/* ═══ LISTAR LINKS ═══ */}
          <section id="listar-links" className="mb-20 scroll-mt-20">
            <EndpointCard method="GET" path="/payment-links" summary="Listar links de pagamento">
              <p className="text-sm mb-5" style={{ color: C.text2 }}>
                Retorna uma lista paginada de links de pagamento. Filtros disponíveis por status.
              </p>
              <ParamsTable params={[
                { name: "status", type: "string", desc: "active | inactive | expired" },
                { name: "page", type: "integer", desc: "Número da página (padrão: 1)" },
                { name: "per_page", type: "integer", desc: "Itens por página (padrão: 20, máx: 100)" },
              ]} />
            </EndpointCard>
          </section>

        </div>
      </div>
    </div>
  );
}
