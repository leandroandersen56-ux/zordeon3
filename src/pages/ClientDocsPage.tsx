import { useState, useEffect } from "react";
import { DocLayout, DocNavSection } from "@/components/docs/DocLayout";
import { DocSection, CodeBlock, AlertBox, DocTable, DocBreadcrumb, MethodBadge, TableOfContents } from "@/components/docs/DocComponents";
import { Rocket, KeyRound, QrCode, Bell, Wallet, DollarSign, AlertTriangle, Phone } from "lucide-react";

const navSections: DocNavSection[] = [
  {
    icon: <Rocket size={16} />, label: "Primeiros Passos", id: "getting-started",
    children: [
      { label: "O que é este painel", id: "gs-about" },
      { label: "Configurar sua conta", id: "gs-setup" },
      { label: "Checklist de integração", id: "gs-checklist" },
    ],
  },
  {
    icon: <KeyRound size={16} />, label: "Credenciais de API", id: "api-keys",
    children: [
      { label: "Onde encontrar", id: "keys-find" },
      { label: "Como usar nos headers", id: "keys-usage" },
      { label: "Tipos de permissão", id: "keys-permissions" },
      { label: "Segurança", id: "keys-security" },
    ],
  },
  {
    icon: <QrCode size={16} />, label: "Gerar Cobrança PIX", id: "pix-charge",
    children: [
      { label: "Como funciona", id: "pix-how" },
      { label: "Campos obrigatórios", id: "pix-fields" },
      { label: "Exemplo completo", id: "pix-example" },
      { label: "Exibindo o QR Code", id: "pix-qrcode" },
      { label: "Limites de valor", id: "pix-limits" },
    ],
  },
  {
    icon: <Bell size={16} />, label: "Webhooks", id: "webhooks",
    children: [
      { label: "O que são", id: "wh-about" },
      { label: "Validar autenticidade", id: "wh-validate" },
      { label: "Exemplo de código", id: "wh-code" },
      { label: "Status de transação", id: "wh-status" },
      { label: "Idempotência", id: "wh-idempotency" },
    ],
  },
  {
    icon: <Wallet size={16} />, label: "Saques e Transferências", id: "withdrawals",
    children: [
      { label: "Como solicitar", id: "wd-request" },
      { label: "Tipos de chave PIX", id: "wd-keys" },
      { label: "Limites e horários", id: "wd-limits" },
      { label: "Acompanhar status", id: "wd-status" },
    ],
  },
  {
    icon: <DollarSign size={16} />, label: "Saldo e Extrato", id: "balance",
    children: [
      { label: "Consultar saldo", id: "bal-check" },
      { label: "Listar transações", id: "bal-list" },
      { label: "Filtros de busca", id: "bal-filters" },
      { label: "Entendendo as taxas", id: "bal-fees" },
    ],
  },
  {
    icon: <AlertTriangle size={16} />, label: "Problemas Comuns", id: "problems",
    children: [
      { label: "Pagamento não confirmou", id: "prob-payment" },
      { label: "Webhook não chegou", id: "prob-webhook" },
      { label: "Erro 401 / 403", id: "prob-auth" },
      { label: "Saque não processado", id: "prob-withdrawal" },
      { label: "QR Code inválido", id: "prob-qrcode" },
    ],
  },
  { icon: <Phone size={16} />, label: "Contato e Suporte", id: "support" },
];

const allAnchors = [
  { id: "gs-about", label: "Primeiros Passos" },
  { id: "keys-find", label: "Credenciais" },
  { id: "pix-how", label: "Gerar PIX" },
  { id: "pix-example", label: "Exemplo Completo" },
  { id: "wh-about", label: "Webhooks" },
  { id: "wd-request", label: "Saques" },
  { id: "bal-check", label: "Saldo" },
  { id: "prob-payment", label: "Problemas" },
  { id: "support", label: "Suporte" },
];

export default function ClientDocsPage() {
  const [activeSection, setActiveSection] = useState("gs-about");
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
      title="Documentação"
      backTo="/dashboard"
      backLabel="Voltar ao Dashboard"
      navSections={navSections}
      activeSection={activeSection}
      onSectionChange={scrollToSection}
      onSearch={setSearchQuery}
    >
      <TableOfContents items={allAnchors} activeId={activeSection} />

      <DocBreadcrumb items={["Documentação", "Gateway de Pagamentos"]} />

      {/* ── PRIMEIROS PASSOS ── */}
      <DocSection id="gs-about" title="Bem-vindo ao seu Gateway de Pagamentos">
        <p className="text-base text-foreground font-medium mb-3">
          Este é seu painel de controle para receber pagamentos via PIX e realizar transferências para qualquer chave PIX do Brasil.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {[
            "Gerar cobranças PIX com QR Code automático",
            "Receber notificações em tempo real",
            "Sacar o saldo para qualquer chave PIX",
            "Acompanhar todas as transações",
            "Integrar com sua aplicação via API",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
              <span className="text-primary font-bold">✓</span>
              <span className="text-foreground text-sm">{item}</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="gs-setup" title="Como Configurar sua Conta">
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Acesse Menu → Pagamentos e insira suas credenciais Pluggou</li>
          <li>Configure o endpoint de webhook (URL pública do seu servidor)</li>
          <li>Copie o X-Webhook-Code para validar as notificações</li>
          <li>Clique em "Testar Conexão" para validar</li>
        </ol>
      </DocSection>

      <DocSection id="gs-checklist" title="Checklist de Integração">
        <div className="space-y-2 my-3">
          {[
            "Copiar Chave Pública e Chave Secreta em Menu → Pagamentos",
            "Configurar endpoint de webhook",
            "Copiar o X-Webhook-Code",
            "Fazer primeira transação de teste com R$ 1,00",
            "Confirmar que o webhook chegou no seu servidor",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 rounded border border-border flex items-center justify-center text-xs text-muted-foreground">{i + 1}</div>
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
        <AlertBox level="warning">
          Este gateway opera em ambiente de PRODUÇÃO. Toda transação é real e movimenta dinheiro de verdade. Use valores pequenos (R$ 1,00) para validar sua integração.
        </AlertBox>
      </DocSection>

      {/* ── CREDENCIAIS ── */}
      <DocSection id="keys-find" title="Onde Encontrar suas Chaves">
        <p>Acesse: <strong>Menu → Pagamentos</strong></p>
        <ul className="list-disc list-inside space-y-1 text-sm my-3">
          <li><strong>Chave Pública (X-Public-Key):</strong> ex: pk_live_abc123...</li>
          <li><strong>Chave Secreta (X-Secret-Key):</strong> ex: sk_live_xyz789...</li>
        </ul>
      </DocSection>

      <DocSection id="keys-usage" title="Como Usar nos Headers">
        <p>Inclua esses dois headers em TODA requisição:</p>
        <CodeBlock language="bash" code={`curl -X POST https://api.pluggoutech.com/api/transactions \\\n  -H "Content-Type: application/json" \\\n  -H "X-Public-Key: SUA_CHAVE_PUBLICA" \\\n  -H "X-Secret-Key: SUA_CHAVE_SECRETA" \\\n  -d '{ ... }'`} title="Exemplo cURL" />
      </DocSection>

      <DocSection id="keys-permissions" title="Tipos de Permissão">
        <DocTable
          headers={["Tipo", "Gerar PIX", "Sacar", "Quando usar"]}
          rows={[
            ["cashin", "✅", "❌", "Só recebimento (checkout)"],
            ["cashout", "❌", "✅", "Só transferências"],
            ["all", "✅", "✅", "Integração completa"],
          ]}
        />
        <p className="text-sm mt-2">Se sua credencial retorna erro 403, provavelmente ela não tem permissão para a operação. Contate o suporte.</p>
      </DocSection>

      <DocSection id="keys-security" title="Segurança">
        <AlertBox level="critical">
          NUNCA coloque a Chave Secreta no código do frontend (React, Vue, HTML). NUNCA suba as chaves para o GitHub ou qualquer repositório público.
        </AlertBox>
        <div className="space-y-1 text-sm my-3">
          <p>✅ Use variáveis de ambiente no servidor: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">process.env.PLUGGOU_SECRET_KEY</code></p>
          <p>✅ Se suspeitar que a chave vazou, contate o suporte imediatamente</p>
        </div>
      </DocSection>

      {/* ── GERAR COBRANÇA PIX ── */}
      <DocSection id="pix-how" title="Como Funciona a Cobrança PIX">
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Sua aplicação chama <span className="inline-flex items-center gap-1"><MethodBadge method="POST" /> /transactions</span> com os dados do comprador e o valor</li>
          <li>A API retorna um código PIX (formato EMV/copia-e-cola) + dados da transação</li>
          <li>Você exibe o QR Code para o pagador</li>
          <li>O pagador paga pelo app do banco</li>
          <li>Você recebe uma notificação webhook confirmando o pagamento</li>
        </ol>
      </DocSection>

      <DocSection id="pix-fields" title="Campos Obrigatórios">
        <DocTable
          headers={["Campo", "Tipo", "Descrição", "Exemplo"]}
          rows={[
            ["payment_method", "string", 'Sempre "pix"', '"pix"'],
            ["amount", "integer", "Valor em CENTAVOS (R$1,00 = 100)", "10000"],
            ["buyer.buyer_name", "string", "Nome completo do pagador", '"João da Silva"'],
            ["buyer.buyer_document", "string", "CPF ou CNPJ", '"123.456.789-09"'],
            ["buyer.buyer_phone", "string", "Telefone (10-11 dígitos)", '"11999999999"'],
          ]}
        />
      </DocSection>

      <DocSection id="pix-example" title="Exemplo Completo">
        <div className="flex items-center gap-2 mb-3"><MethodBadge method="POST" /> <code className="text-sm text-foreground font-mono">https://api.pluggoutech.com/api/transactions</code></div>
        <CodeBlock language="json" code={`// Request Body\n{\n  "payment_method": "pix",\n  "amount": 10000,\n  "buyer": {\n    "buyer_name": "João da Silva",\n    "buyer_document": "123.456.789-09",\n    "buyer_phone": "11999999999"\n  }\n}`} title="Requisição" />
        <CodeBlock language="json" code={`// Response (201 Created)\n{\n  "success": true,\n  "data": {\n    "id": "UUID_DA_TRANSACAO",\n    "amount": 10000,\n    "platform_tax": 149,\n    "liquid_amount": 9851,\n    "pix": {\n      "emv": "00020126580014br.gov.bcb.pix..."\n    }\n  }\n}`} title="Resposta" />
      </DocSection>

      <DocSection id="pix-qrcode" title="Exibindo o QR Code">
        <p>O campo <code className="bg-muted px-1.5 py-0.5 rounded text-xs">data.pix.emv</code> é o código copia-e-cola. Para gerar o QR Code visual:</p>
        <CodeBlock language="javascript" code={`import QRCode from 'qrcode';\n\nconst qrImage = await QRCode.toDataURL(response.data.pix.emv);\n// Use qrImage como src de uma tag <img>`} title="Gerar QR Code" />
      </DocSection>

      <DocSection id="pix-limits" title="Limites de Valor">
        <DocTable
          headers={["Limite", "Valor"]}
          rows={[
            ["Valor mínimo", "Suficiente para resultar em R$ 0,10 após taxas"],
            ["Valor máximo", "R$ 3.000,00 por transação (300.000 centavos)"],
          ]}
        />
        <p className="text-sm mt-3"><strong>Entendendo as taxas:</strong> amount (total) - platform_tax (taxa) = liquid_amount (seu saldo)</p>
      </DocSection>

      {/* ── WEBHOOKS ── */}
      <DocSection id="wh-about" title="O que é um Webhook?">
        <p>É uma notificação automática que a plataforma envia para o seu servidor quando algo acontece: pagamento confirmado, cancelado, estornado, etc.</p>
        <p className="text-foreground mt-2">Pense assim: em vez de ficar perguntando "foi pago?" a cada segundo, o sistema te avisa quando o pagamento acontece.</p>
        <p className="text-foreground font-medium mt-3">Como configurar:</p>
        <ol className="list-decimal list-inside space-y-1 text-sm mt-2">
          <li>Acesse Menu → Pagamentos</li>
          <li>Informe a URL do seu servidor (deve ser pública)</li>
          <li>Copie o X-Webhook-Code para validação</li>
          <li>Salve as configurações</li>
        </ol>
      </DocSection>

      <DocSection id="wh-validate" title="Validar Autenticidade (OBRIGATÓRIO)">
        <p>Em cada webhook recebido, compare o header X-Webhook-Code com o seu código salvo. Se não bater, rejeite com 401.</p>
        <AlertBox level="critical">
          Sempre valide o X-Webhook-Code. Sem isso, qualquer pessoa pode simular uma notificação falsa de pagamento.
        </AlertBox>
      </DocSection>

      <DocSection id="wh-code" title="Exemplo de Código">
        <CodeBlock language="javascript" code={`app.post('/webhook', (req, res) => {\n  const webhookCode = req.headers['x-webhook-code'];\n  \n  if (webhookCode !== process.env.PLUGGOU_WEBHOOK_CODE) {\n    return res.status(401).json({ error: 'Não autorizado' });\n  }\n  \n  // Responda 200 IMEDIATAMENTE (menos de 1 segundo)\n  res.status(200).json({ received: true });\n  \n  // Processe depois (assíncrono)\n  processarEvento(req.body);\n});`} title="Node.js — Webhook Handler" />
      </DocSection>

      <DocSection id="wh-status" title="Status de Transação">
        <DocTable
          headers={["Status", "Significado", "Ação no seu sistema"]}
          rows={[
            ["pending", "Aguardando pagamento", 'Mostrar "aguardando pagamento"'],
            ["paid", "✅ Pago e confirmado", "Liberar pedido / acesso"],
            ["failed", "❌ Falha no pagamento", "Notificar o comprador"],
            ["canceled", "Expirou ou foi cancelada", "Cancelar pedido"],
            ["refunded", "Valor devolvido ao pagador", "Processar reembolso"],
            ["chargeback", "Contestação aberta", "Contate o suporte imediatamente"],
          ]}
        />
      </DocSection>

      <DocSection id="wh-idempotency" title="Idempotência (Evitar Duplicatas)">
        <p>Guarde o <code className="bg-muted px-1.5 py-0.5 rounded text-xs">X-Webhook-Event-ID</code> no banco de dados. Antes de processar, verifique se já processou esse ID.</p>
        <CodeBlock language="javascript" code={`const eventId = req.headers['x-webhook-event-id'];\nconst jaProcessado = await db.eventos.findOne({ eventId });\nif (jaProcessado) {\n  return res.status(200).json({ received: true });\n}\nawait db.eventos.create({ eventId });\n// ... processa normalmente`} title="Verificação de Idempotência" />
      </DocSection>

      {/* ── SAQUES ── */}
      <DocSection id="wd-request" title="Como Solicitar um Saque">
        <div className="flex items-center gap-2 mb-3"><MethodBadge method="POST" /> <code className="text-sm text-foreground font-mono">https://api.pluggoutech.com/api/withdrawals</code></div>
        <CodeBlock language="json" code={`{\n  "amount": 50000,\n  "key_type": "cpf",\n  "key_value": "12345678909"\n}`} title="Payload de Saque" />
        <p className="text-sm">O campo amount é em centavos. R$ 500,00 = 50000.</p>
      </DocSection>

      <DocSection id="wd-keys" title="Tipos de Chave PIX Aceitos">
        <DocTable
          headers={["key_type", "Exemplo", "Observação"]}
          rows={[
            ["cpf", "12345678909", "Com ou sem pontos/traço"],
            ["cnpj", "12345678000190", "Com ou sem formatação"],
            ["email", "voce@email.com", "E-mail válido"],
            ["phone", "11999999999", "10 ou 11 dígitos, sem +55"],
            ["random", "a1b2c3d4-e5f6-7890-...", "Mínimo 32 caracteres"],
          ]}
        />
      </DocSection>

      <DocSection id="wd-limits" title="Limites e Horários">
        <DocTable
          headers={["Regra", "Valor"]}
          rows={[
            ["Valor mínimo", "R$ 10,00"],
            ["Horário de funcionamento", "09:00 às 22:00 (Brasília)"],
            ["Limite por solicitação", "Consulte Menu → Configurações"],
            ["Limite diário", "Consulte Menu → Configurações"],
          ]}
        />
        <AlertBox level="warning">Saques solicitados fora do horário retornam erro 400.</AlertBox>
      </DocSection>

      <DocSection id="wd-status" title="Acompanhar Status do Saque">
        <DocTable
          headers={["Status", "Significado"]}
          rows={[
            ["pending", "Aguardando processamento"],
            ["approved", "Em processamento pela operadora"],
            ["paid", "✅ Transferência concluída"],
            ["failed", "❌ Falhou — saldo devolvido à carteira"],
            ["canceled", "Cancelado antes de processar"],
            ["refunded", "Valor estornado à carteira"],
          ]}
        />
      </DocSection>

      {/* ── SALDO ── */}
      <DocSection id="bal-check" title="Consultar Saldo Disponível">
        <div className="flex items-center gap-2 mb-3"><MethodBadge method="GET" /> <code className="text-sm text-foreground font-mono">https://api.pluggoutech.com/api/withdrawals/balance</code></div>
        <CodeBlock language="json" code={`{\n  "data": {\n    "available_balance": 1250000,    // R$ 12.500,00\n    "daily_limit_remaining": 500000, // R$ 5.000,00\n    "minimum_withdrawal": 1000,      // R$ 10,00\n    "limits": {\n      "per_request": 500000,         // R$ 5.000,00\n      "per_day_total": 1000000       // R$ 10.000,00\n    }\n  }\n}`} title="Resposta — Saldo" />
        <AlertBox level="tip">Todos os valores são em centavos. Divida por 100 para obter reais.</AlertBox>
      </DocSection>

      <DocSection id="bal-list" title="Listar Transações">
        <div className="flex items-center gap-2 mb-3"><MethodBadge method="GET" /> <code className="text-sm text-foreground font-mono">https://api.pluggoutech.com/api/transactions</code></div>
      </DocSection>

      <DocSection id="bal-filters" title="Filtros de Busca">
        <DocTable
          headers={["Parâmetro", "Descrição", "Exemplo"]}
          rows={[
            ["status", "Filtrar por status", "status=paid"],
            ["amount_min", "Valor mínimo (centavos)", "amount_min=1000"],
            ["amount_max", "Valor máximo (centavos)", "amount_max=100000"],
            ["created_at_min", "Data mínima", "2026-01-01 00:00:00"],
            ["created_at_max", "Data máxima", "2026-01-31 23:59:59"],
            ["page", "Página (10 por página)", "page=2"],
          ]}
        />
      </DocSection>

      <DocSection id="bal-fees" title="Entendendo as Taxas">
        <DocTable
          headers={["Campo", "Descrição"]}
          rows={[
            ["amount", "O que o pagador pagou"],
            ["platform_tax", "Taxa cobrada pela plataforma (automática)"],
            ["liquid_amount", "O que entra no seu saldo (amount - platform_tax)"],
          ]}
        />
        <p className="text-sm mt-2">As taxas variam de acordo com seu plano contratado. Consulte Menu → Taxas para ver sua tarifa.</p>
      </DocSection>

      {/* ── PROBLEMAS COMUNS ── */}
      <DocSection id="prob-payment" title="O Pagador Pagou mas o Sistema Não Atualizou">
        <p className="text-foreground font-medium mb-2">Causa mais comum: webhook não recebido/processado.</p>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Vá em Menu → Vendas e busque pelo valor e data</li>
          <li>Se o status está "paid" → o problema é no seu webhook</li>
          <li>Verifique se o endpoint está online e acessível publicamente</li>
          <li>Verifique nos logs se o webhook chegou</li>
          <li>Verifique se o X-Webhook-Code está correto</li>
          <li>Se necessário, reenvie o webhook pelo Dashboard Pluggou</li>
        </ol>
      </DocSection>

      <DocSection id="prob-webhook" title="Webhook Não Está Chegando">
        <div className="space-y-2 text-sm">
          {[
            "A URL cadastrada está correta e pública (sem localhost)",
            "O servidor responde em menos de 1 segundo",
            "A rota aceita método POST",
            "Nenhum firewall ou WAF está bloqueando o IP de origem",
            "O X-Webhook-Code está correto e não foi trocado recentemente",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-border flex items-center justify-center text-xs text-muted-foreground">☐</div>
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
        <AlertBox level="tip">Se o webhook falhou, ele NÃO é reenviado automaticamente. Reenvie pelo Dashboard Pluggou.</AlertBox>
      </DocSection>

      <DocSection id="prob-auth" title='Erro 401 / 403'>
        <DocTable
          headers={["Código", "Significado", "Solução"]}
          rows={[
            ["401", "Credenciais inválidas", "Verificar chaves em Menu → Pagamentos"],
            ["403", "Sem permissão", "Credencial não tem autorização para a operação"],
          ]}
        />
      </DocSection>

      <DocSection id="prob-withdrawal" title="Saque Não Foi Processado">
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Verifique o horário: 09:00 às 22:00 (Brasília)</li>
          <li>Verifique se havia saldo suficiente</li>
          <li>Valor mínimo: R$ 10,00 (1000 centavos)</li>
          <li>Se status "failed" → saldo foi devolvido automaticamente</li>
          <li>Se "pending" há mais de 1 hora → contate o suporte</li>
        </ol>
      </DocSection>

      <DocSection id="prob-qrcode" title="QR Code Inválido">
        <p>O QR Code PIX tem validade limitada (geralmente 30-60 minutos). Se o pagador tentou usar um QR Code antigo, gere uma nova transação.</p>
        <AlertBox level="warning">Nunca reutilize o campo pix.emv de uma transação anterior.</AlertBox>
      </DocSection>

      {/* ── SUPORTE ── */}
      <DocSection id="support" title="Contato e Suporte">
        <div className="space-y-4 my-4">
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <p className="text-foreground font-medium mb-1">Suporte técnico (WhatsApp)</p>
            <a href="https://wa.me/+555181791451" target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">wa.me/+555181791451</a>
            <p className="text-xs text-muted-foreground mt-1">Horário: dias úteis, 09:00 às 18:00</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <p className="text-foreground font-medium mb-1">Dashboard Pluggou</p>
            <a href="https://pluggoucash.com" target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">pluggoucash.com</a>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <p className="text-foreground font-medium mb-1">Documentação oficial da API</p>
            <a href="https://docs.pluggoucash.com" target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">docs.pluggoucash.com</a>
          </div>
        </div>
        <p className="text-sm text-foreground font-medium mt-4 mb-2">Ao contatar o suporte, informe sempre:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>O ID da transação (UUID) ou saque com problema</li>
          <li>O código de erro HTTP recebido (401, 403, 400, 500)</li>
          <li>A mensagem de erro retornada pela API</li>
          <li>Data e horário em que ocorreu</li>
        </ul>
      </DocSection>
    </DocLayout>
  );
}
