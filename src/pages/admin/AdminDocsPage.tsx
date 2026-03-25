import { useState, useEffect } from "react";
import { DocLayout, DocNavSection } from "@/components/docs/DocLayout";
import { DocSection, CodeBlock, AlertBox, DocTable, DocBreadcrumb, MethodBadge, TableOfContents } from "@/components/docs/DocComponents";
import { Home, Settings, Building2, Users, CreditCard, KeyRound, Bell, AlertTriangle, BarChart3, Link2 } from "lucide-react";

const navSections: DocNavSection[] = [
  { icon: <Home size={16} />, label: "Visão Geral", id: "overview" },
  { icon: <Settings size={16} />, label: "Como Funciona", id: "how-it-works" },
  { icon: <Building2 size={16} />, label: "Arquitetura", id: "architecture" },
  {
    icon: <Users size={16} />, label: "Gestão de Clientes", id: "clients",
    children: [
      { label: "Criar novo cliente", id: "clients-create" },
      { label: "Editar plano e limites", id: "clients-edit" },
      { label: "Bloquear / suspender", id: "clients-block" },
      { label: "Excluir cliente", id: "clients-delete" },
    ],
  },
  {
    icon: <CreditCard size={16} />, label: "Gestão Financeira", id: "finance",
    children: [
      { label: "Transações de clientes", id: "finance-transactions" },
      { label: "Saldos por cliente", id: "finance-balances" },
      { label: "Saques", id: "finance-withdrawals" },
      { label: "Tarifas e repasses", id: "finance-fees" },
    ],
  },
  {
    icon: <KeyRound size={16} />, label: "Credenciais & API", id: "credentials",
    children: [
      { label: "Autenticação", id: "credentials-auth" },
      { label: "Gerenciar chaves", id: "credentials-keys" },
      { label: "Permissões", id: "credentials-permissions" },
    ],
  },
  {
    icon: <Bell size={16} />, label: "Webhooks", id: "webhooks",
    children: [
      { label: "O que são webhooks", id: "webhooks-intro" },
      { label: "Configurar endpoint", id: "webhooks-config" },
      { label: "Reenviar manualmente", id: "webhooks-resend" },
      { label: "Debugar falhas", id: "webhooks-debug" },
    ],
  },
  {
    icon: <AlertTriangle size={16} />, label: "Resolução de Problemas", id: "troubleshooting",
    children: [
      { label: "Transação não confirmada", id: "trouble-transaction" },
      { label: "Saque travado", id: "trouble-withdrawal" },
      { label: "Cliente bloqueado", id: "trouble-blocked" },
      { label: "Erro de credencial", id: "trouble-credential" },
      { label: "Webhook não chegou", id: "trouble-webhook" },
    ],
  },
  { icon: <BarChart3 size={16} />, label: "Relatórios", id: "reports" },
  { icon: <Link2 size={16} />, label: "Integrações", id: "integrations" },
];

const allAnchors = [
  { id: "overview", label: "Visão Geral" },
  { id: "how-it-works", label: "Como Funciona" },
  { id: "architecture", label: "Arquitetura" },
  { id: "clients-create", label: "Criar Cliente" },
  { id: "clients-block", label: "Bloquear Cliente" },
  { id: "credentials-auth", label: "Autenticação" },
  { id: "credentials-permissions", label: "Permissões" },
  { id: "webhooks-intro", label: "Webhooks" },
  { id: "trouble-transaction", label: "Problemas" },
];

export default function AdminDocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) setActiveSection(hash);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <DocLayout
      title="Documentação Super Admin"
      backTo="/admin"
      backLabel="Voltar ao Painel Admin"
      navSections={navSections}
      activeSection={activeSection}
      onSectionChange={scrollToSection}
      onSearch={setSearchQuery}
    >
      <TableOfContents items={allAnchors} activeId={activeSection} />

      <DocBreadcrumb items={["Documentação", "Super Admin"]} />

      {/* ── VISÃO GERAL ── */}
      <DocSection id="overview" title="Bem-vindo ao Painel Super Admin">
        <p className="text-base text-foreground font-medium mb-3">
          Você é o administrador master desta plataforma. Aqui você controla TUDO: todos os clientes, todos os gateways, todas as transações e toda a operação financeira.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {[
            "Criar e gerenciar contas de clientes (donos de gateway)",
            "Definir planos, limites de saque e tarifas por cliente",
            "Monitorar em tempo real todas as transações",
            "Bloquear ou suspender contas com um clique",
            "Depurar problemas de webhook e pagamentos",
            "Exportar relatórios financeiros completos",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
              <span className="text-primary font-bold">✓</span>
              <span className="text-foreground text-sm">{item}</span>
            </div>
          ))}
        </div>
      </DocSection>

      {/* ── COMO FUNCIONA ── */}
      <DocSection id="how-it-works" title="Como a Plataforma Funciona">
        <p>Fluxo completo de um pagamento PIX na plataforma:</p>
        <div className="my-4 p-4 rounded-lg bg-muted/20 border border-border font-mono text-xs space-y-1 text-foreground/80">
          <p>Seu Cliente (Lojista/Dev)</p>
          <p className="text-muted-foreground pl-4">↓ gera cobrança via API</p>
          <p>Painel Admin Cliente</p>
          <p className="text-muted-foreground pl-4">↓ chama</p>
          <p className="text-primary font-bold">Sua Plataforma SaaS ← você está aqui</p>
          <p className="text-muted-foreground pl-4">↓ repassa para</p>
          <p>API Pluggou (api.pluggoutech.com/api)</p>
          <p className="text-muted-foreground pl-4">↓ processa PIX</p>
          <p>Banco Central / Sistema PIX Brasileiro</p>
          <p className="text-muted-foreground pl-4">↓ notifica via webhook</p>
          <p className="text-primary font-bold">Sua Plataforma SaaS</p>
          <p className="text-muted-foreground pl-4">↓ repassa evento</p>
          <p>Seu Cliente (Lojista/Dev)</p>
        </div>
        <AlertBox level="warning">
          A Pluggou NÃO possui ambiente de testes/sandbox. Toda requisição à API é real e movimenta dinheiro de verdade. Oriente seus clientes a usarem valores baixos durante a integração.
        </AlertBox>
      </DocSection>

      {/* ── ARQUITETURA ── */}
      <DocSection id="architecture" title="Arquitetura do Sistema">
        <p>O sistema é construído em camadas para escalabilidade e segurança:</p>
        <div className="my-4 space-y-2">
          {["Frontend (React SPA) → Interface do admin e dos clientes",
            "Edge Functions (Serverless) → Proxy seguro para API Pluggou",
            "Banco de dados (PostgreSQL) → Transações, credenciais, webhooks",
            "Webhooks Handler → Recebe e processa notificações da Pluggou",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-foreground">
              <span className="w-6 h-6 rounded bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              {item}
            </div>
          ))}
        </div>
        <CodeBlock language="text" code={`Base URL: https://api.pluggoutech.com/api\nFormato: JSON (application/json)\nAmbiente: Produção único (sem sandbox)\nAutenticação: Headers X-Public-Key + X-Secret-Key`} title="Configuração da API" />
      </DocSection>

      {/* ── GESTÃO DE CLIENTES ── */}
      <DocSection id="clients-create" title="Criar Novo Cliente/Gateway">
        <p className="text-foreground font-medium mb-2">Passo a passo:</p>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Acesse Menu → Clientes → Novo Cliente</li>
          <li>Preencha os dados da empresa (razão social, CNPJ, e-mail, telefone)</li>
          <li>Selecione o plano contratado</li>
          <li>Defina os limites operacionais (por transação, diário, por saque)</li>
          <li>Informe as credenciais Pluggou do cliente (X-Public-Key, X-Secret-Key, X-Webhook-Code)</li>
          <li>Salve e envie as credenciais de acesso ao painel por e-mail</li>
        </ol>
        <AlertBox level="tip">
          Oriente o cliente a acessar a seção "Primeiros Passos" na documentação do painel dele assim que fizer login pela primeira vez.
        </AlertBox>
      </DocSection>

      <DocSection id="clients-edit" title="Editar Plano e Limites">
        <p>Acesse Menu → Clientes → [selecionar cliente] → Configurações para alterar:</p>
        <DocTable
          headers={["Configuração", "Descrição", "Padrão"]}
          rows={[
            ["Limite por transação", "Valor máximo de cada PIX gerado", "R$ 3.000,00"],
            ["Limite diário de saque", "Total que pode sacar por dia", "R$ 10.000,00"],
            ["Limite por saque", "Valor máximo por solicitação de saque", "R$ 5.000,00"],
            ["Plano/Tarifa", "Percentual + fixo cobrado por transação", "Conforme contrato"],
          ]}
        />
      </DocSection>

      <DocSection id="clients-block" title="Bloquear / Suspender Conta">
        <p className="text-foreground font-medium mb-2">Quando bloquear:</p>
        <ul className="list-disc list-inside space-y-1 text-sm mb-4">
          <li>Suspeita de fraude ou uso indevido</li>
          <li>Inadimplência</li>
          <li>Solicitação do próprio cliente</li>
          <li>Investigação interna</li>
        </ul>
        <p className="text-foreground font-medium mb-2">Como fazer:</p>
        <ol className="list-decimal list-inside space-y-1 text-sm mb-4">
          <li>Menu → Clientes → [selecionar cliente] → Ações → Bloquear Conta</li>
          <li>Informe o motivo (fica registrado no log)</li>
          <li>Confirme a ação</li>
        </ol>
        <AlertBox level="warning">
          O bloqueio é imediato. O cliente não é notificado automaticamente. Recomendamos enviar um e-mail de comunicação antes ou logo após.
        </AlertBox>
        <p className="text-foreground font-medium mt-4 mb-2">O que acontece após o bloqueio:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Todas as chamadas de API do cliente retornam erro 403</li>
          <li>O painel do cliente fica acessível (apenas visualização)</li>
          <li>Saques pendentes ficam congelados</li>
          <li>Transações já confirmadas NÃO são afetadas</li>
        </ul>
      </DocSection>

      <DocSection id="clients-delete" title="Excluir Cliente">
        <AlertBox level="critical">
          A exclusão de um cliente é permanente e remove todos os dados associados. Esta ação não pode ser desfeita. Certifique-se de exportar os relatórios necessários antes de prosseguir.
        </AlertBox>
      </DocSection>

      {/* ── GESTÃO FINANCEIRA ── */}
      <DocSection id="finance-transactions" title="Visualizar Transações de Todos os Clientes">
        <p>Acesse Menu → Transações para visualizar todas as transações de todos os clientes em uma única tabela com filtros avançados por status, data, valor e cliente.</p>
      </DocSection>

      <DocSection id="finance-balances" title="Consultar Saldos por Cliente">
        <p>A consulta de saldo é feita via API Pluggou:</p>
        <div className="flex items-center gap-2 my-2"><MethodBadge method="GET" /> <code className="text-sm text-foreground">https://api.pluggoutech.com/api/withdrawals/balance</code></div>
        <CodeBlock language="json" code={`{\n  "data": {\n    "available_balance": 1250000,\n    "daily_limit_remaining": 500000,\n    "minimum_withdrawal": 1000,\n    "limits": {\n      "per_request": 500000,\n      "per_day_total": 1000000\n    }\n  }\n}`} title="Resposta — Saldo" />
        <AlertBox level="tip">Todos os valores são em centavos. Divida por 100 para exibir em reais.</AlertBox>
      </DocSection>

      <DocSection id="finance-withdrawals" title="Acompanhar Saques">
        <DocTable
          headers={["Status", "Significado", "Ação"]}
          rows={[
            ["pending", "Aguardando processamento", "Aguardar"],
            ["approved", "Em processamento pela adquirente", "Monitorar"],
            ["paid", "✅ Transferência concluída", "Confirmar"],
            ["failed", "❌ Falha na transferência", "Investigar e notificar"],
            ["canceled", "Cancelado antes de processar", "Registrar"],
            ["refunded", "Valor devolvido à carteira", "Confirmar estorno"],
          ]}
        />
      </DocSection>

      <DocSection id="finance-fees" title="Tarifas e Repasses">
        <p>Cada transação tem 3 valores:</p>
        <DocTable
          headers={["Campo", "Descrição"]}
          rows={[
            ["amount", "Valor total cobrado do pagador"],
            ["platform_tax", "Taxa da plataforma (descontada automaticamente)"],
            ["liquid_amount", "O que entra na carteira do cliente (amount - platform_tax)"],
          ]}
        />
      </DocSection>

      {/* ── CREDENCIAIS ── */}
      <DocSection id="credentials-auth" title="Como Funciona a Autenticação">
        <p>Cada cliente possui um par de credenciais Pluggou:</p>
        <ul className="list-disc list-inside space-y-1 text-sm my-3">
          <li><strong>X-Public-Key:</strong> identifica a conta (pode ser compartilhada)</li>
          <li><strong>X-Secret-Key:</strong> autoriza operações (NUNCA expor publicamente)</li>
        </ul>
        <CodeBlock language="http" code={`Content-Type: application/json\nX-Public-Key: pk_live_abc123...\nX-Secret-Key: sk_live_xyz789...`} title="Headers obrigatórios" />
      </DocSection>

      <DocSection id="credentials-keys" title="Gerenciar Chaves por Cliente">
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Menu → Clientes → [cliente] → Configurações → Credenciais Pluggou</li>
          <li>Insira as novas chaves</li>
          <li>Clique em "Testar Conexão" — faz uma chamada real à API Pluggou</li>
          <li>Se retornar ✅ Sucesso, salve</li>
          <li>As chaves antigas são invalidadas imediatamente</li>
        </ol>
        <AlertBox level="critical">
          Nunca salve credenciais em planilhas, e-mails ou chats. Use sempre o campo seguro do painel.
        </AlertBox>
      </DocSection>

      <DocSection id="credentials-permissions" title="Permissões de Credencial">
        <DocTable
          headers={["Tipo", "Pode gerar PIX?", "Pode sacar?", "Uso recomendado"]}
          rows={[
            ["cashin", "✅ Sim", "❌ Não", "E-commerce, checkout"],
            ["cashout", "❌ Não", "✅ Sim", "Sistema de pagamentos"],
            ["all", "✅ Sim", "✅ Sim", "Integração completa"],
          ]}
        />
      </DocSection>

      {/* ── WEBHOOKS ── */}
      <DocSection id="webhooks-intro" title="O que São Webhooks">
        <p>Webhooks são notificações automáticas que a Pluggou envia para o servidor desta plataforma sempre que algo importante acontece: pagamento confirmado, saque realizado, estorno, etc.</p>
        <p className="text-foreground font-medium my-3">Fluxo: Pluggou → Esta Plataforma → Endpoint do Cliente</p>
        <DocTable
          headers={["Header", "Descrição"]}
          rows={[
            ["X-Webhook-Event-ID", "ID único do evento (use para evitar duplicatas)"],
            ["X-Webhook-Code", "Código de segurança — SEMPRE valide esse campo"],
            ["User-Agent", 'Sempre "Pluggou-Webhook/1.0"'],
          ]}
        />
      </DocSection>

      <DocSection id="webhooks-config" title="Configurar Endpoint por Cliente">
        <p>Cada cliente pode configurar seu endpoint de webhook no painel. A URL deve ser pública e responder em menos de 1 segundo.</p>
        <AlertBox level="warning">
          A Pluggou espera resposta em até 1 segundo. Se demorar, marca como falha. NÃO há retentativas automáticas.
        </AlertBox>
      </DocSection>

      <DocSection id="webhooks-resend" title="Reenviar Webhook Manualmente">
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Acesse o Dashboard da Pluggou (pluggoucash.com)</li>
          <li>Vá em Webhooks → Histórico</li>
          <li>Encontre o evento com status "falha"</li>
          <li>Clique em "Reenviar"</li>
        </ol>
      </DocSection>

      <DocSection id="webhooks-debug" title="Debugar Falhas de Entrega">
        <p>Checklist em ordem:</p>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>O endpoint do cliente está acessível publicamente? (não pode ser localhost)</li>
          <li>O endpoint responde em menos de 1 segundo?</li>
          <li>O X-Webhook-Code está correto e sendo validado?</li>
          <li>Confira o log de webhooks recebidos no servidor</li>
          <li>Reenvie manualmente pelo Dashboard Pluggou</li>
        </ol>
      </DocSection>

      {/* ── RESOLUÇÃO DE PROBLEMAS ── */}
      <DocSection id="trouble-transaction" title="Transação Não Confirmada">
        <p className="text-foreground font-medium mb-2">Sintoma: cliente reporta que pagador pagou mas o sistema não atualizou</p>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Verifique no painel: Menu → Transações → buscar pelo valor + data</li>
          <li>Confira o status: pending / paid / failed / canceled</li>
          <li>Se status = "paid" → o problema é na integração do cliente (webhook não processado)</li>
          <li>Se status = "pending" → o pagamento ainda não foi confirmado pela Pluggou</li>
          <li>Se não encontrou a transação → verifique se a chamada POST /transactions foi feita</li>
        </ol>
      </DocSection>

      <DocSection id="trouble-withdrawal" title="Saque Travado / Pendente">
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Verifique o status: pending → approved → paid</li>
          <li>Status "pending" por mais de 30 min → pode ser fila da adquirente, aguardar</li>
          <li>Verifique o horário: saques só funcionam das 09:00 às 22:00 (Brasília)</li>
          <li>Verifique se a conta não foi bloqueada entre a criação e o processamento</li>
          <li>Se status = "failed" → consulte a mensagem de erro no log</li>
        </ol>
      </DocSection>

      <DocSection id="trouble-blocked" title="Cliente Bloqueado Indevidamente">
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Menu → Clientes → [cliente] → Ações → Verificar Status</li>
          <li>Confira o motivo do bloqueio no log de auditoria</li>
          <li>Se for erro, clique em "Remover Bloqueio"</li>
          <li>Documente o ocorrido no campo de observações</li>
        </ol>
      </DocSection>

      <DocSection id="trouble-credential" title="Erro de Credencial (401 / 403)">
        <DocTable
          headers={["Código", "Significado", "Solução"]}
          rows={[
            ["401", "Chaves ausentes ou inválidas", "Verificar e atualizar chaves no painel"],
            ["403", "Chave não tem permissão para a operação", "Verificar tipo de permissão da credencial"],
          ]}
        />
      </DocSection>

      <DocSection id="trouble-webhook" title="Webhook Não Chegou">
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>O endpoint do cliente está acessível publicamente?</li>
          <li>O endpoint responde em menos de 1 segundo?</li>
          <li>O X-Webhook-Code está correto?</li>
          <li>Confira o log de webhooks recebidos</li>
          <li>Reenvie manualmente pelo Dashboard Pluggou</li>
          <li>Verifique se o domínio não está bloqueando o IP da Pluggou</li>
        </ol>
        <AlertBox level="tip">
          Suporte Pluggou via WhatsApp: <a href="https://wa.me/+555181791451" target="_blank" rel="noopener noreferrer" className="text-primary underline">wa.me/+555181791451</a>
        </AlertBox>
      </DocSection>

      {/* ── RELATÓRIOS ── */}
      <DocSection id="reports" title="Relatórios">
        <p>Exporte dados financeiros completos por período em Menu → Relatórios. Disponível em CSV e PDF. Inclui: volume total, taxas cobradas, líquido por cliente, saques realizados.</p>
      </DocSection>

      {/* ── INTEGRAÇÕES ── */}
      <DocSection id="integrations" title="Integrações">
        <DocTable
          headers={["Recurso", "URL"]}
          rows={[
            ["Documentação oficial Pluggou", "docs.pluggoucash.com"],
            ["Dashboard Pluggou", "pluggoucash.com"],
            ["Gerenciar chaves API", "pluggoucash.com/dashboard/apis"],
            ["Suporte WhatsApp", "wa.me/+555181791451"],
          ]}
        />
        <AlertBox level="warning">
          A Pluggou opera exclusivamente em produção — não há ambiente sandbox.
        </AlertBox>
      </DocSection>
    </DocLayout>
  );
}
