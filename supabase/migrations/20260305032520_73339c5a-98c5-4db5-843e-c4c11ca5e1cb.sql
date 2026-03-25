
-- ===========================================
-- ACQUIRERS / PSP PROVIDERS
-- ===========================================
CREATE TABLE public.acquirers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'pix', -- pix, card, boleto, multi
  provider text NOT NULL, -- celcoin, efí, stark_bank, cielo, rede, stone, adyen, etc
  status text NOT NULL DEFAULT 'inactive', -- active, inactive, maintenance, degraded
  priority integer NOT NULL DEFAULT 1,
  -- Credentials (encrypted reference - actual keys in secrets)
  api_endpoint text DEFAULT '',
  api_version text DEFAULT 'v1',
  credential_key text DEFAULT '', -- reference name to secret
  -- Operational config
  settlement_type text DEFAULT 'D+1', -- D+0, D+1, D+2, D+30
  max_amount numeric DEFAULT 50000,
  min_amount numeric DEFAULT 1,
  daily_limit numeric DEFAULT 1000000,
  monthly_limit numeric DEFAULT 30000000,
  -- Monitoring
  success_rate numeric DEFAULT 100,
  avg_response_ms integer DEFAULT 0,
  last_health_check timestamptz,
  total_processed numeric DEFAULT 0,
  -- Supported features
  supports_refund boolean DEFAULT true,
  supports_partial_refund boolean DEFAULT false,
  supports_recurring boolean DEFAULT false,
  supports_split boolean DEFAULT false,
  -- Metadata
  webhook_url text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.acquirers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can manage acquirers" ON public.acquirers FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ===========================================
-- MERCHANT CONFIGURATIONS (per-user overrides)
-- ===========================================
CREATE TABLE public.merchant_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Fee overrides (null = use global)
  pix_fee_pct numeric,
  pix_fee_fixed numeric,
  card_fee_pct numeric,
  card_fee_fixed numeric,
  boleto_fee_pct numeric,
  boleto_fee_fixed numeric,
  -- Limits
  daily_transaction_limit numeric DEFAULT 50000,
  monthly_transaction_limit numeric DEFAULT 1500000,
  single_transaction_limit numeric DEFAULT 10000,
  min_transaction_amount numeric DEFAULT 1,
  -- Settlement
  settlement_cycle text DEFAULT 'D+1',
  auto_settlement boolean DEFAULT true,
  settlement_bank_code text DEFAULT '',
  settlement_agency text DEFAULT '',
  settlement_account text DEFAULT '',
  settlement_account_type text DEFAULT 'checking', -- checking, savings
  settlement_pix_key text DEFAULT '',
  -- Risk
  risk_score integer DEFAULT 50, -- 0-100
  risk_level text DEFAULT 'medium', -- low, medium, high, critical
  max_chargeback_rate numeric DEFAULT 1.0, -- percentage
  velocity_check_enabled boolean DEFAULT true,
  max_transactions_per_hour integer DEFAULT 100,
  max_transactions_per_day integer DEFAULT 1000,
  -- Anti-fraud
  require_3ds boolean DEFAULT false,
  require_avs boolean DEFAULT false,
  block_international boolean DEFAULT false,
  block_prepaid_cards boolean DEFAULT false,
  -- Status
  is_active boolean DEFAULT true,
  is_sandbox boolean DEFAULT false,
  api_key_hash text DEFAULT '',
  webhook_url text DEFAULT '',
  webhook_secret_hash text DEFAULT '',
  -- Metadata
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.merchant_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all merchant configs" ON public.merchant_configs FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own merchant config" ON public.merchant_configs FOR SELECT USING (auth.uid() = user_id);

-- ===========================================
-- DISPUTES / CHARGEBACKS
-- ===========================================
CREATE TABLE public.disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES public.transactions(id) ON DELETE SET NULL,
  user_id uuid NOT NULL,
  -- Dispute details
  type text NOT NULL DEFAULT 'chargeback', -- chargeback, inquiry, retrieval, pre_arbitration
  reason_code text DEFAULT '',
  reason_description text DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  currency text DEFAULT 'BRL',
  -- Status
  status text NOT NULL DEFAULT 'open', -- open, under_review, won, lost, accepted, expired
  -- Evidence
  evidence_due_date timestamptz,
  evidence_submitted boolean DEFAULT false,
  evidence_notes text DEFAULT '',
  -- Resolution
  resolved_at timestamptz,
  resolved_by uuid,
  resolution_notes text DEFAULT '',
  -- Acquirer reference
  acquirer_reference text DEFAULT '',
  card_brand text DEFAULT '', -- visa, mastercard, elo, amex
  -- Metadata
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all disputes" ON public.disputes FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own disputes" ON public.disputes FOR SELECT USING (auth.uid() = user_id);

-- ===========================================
-- RISK RULES (Global anti-fraud rules)
-- ===========================================
CREATE TABLE public.risk_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  type text NOT NULL DEFAULT 'velocity', -- velocity, amount, geo, device, pattern, blacklist, whitelist
  -- Rule config (JSON)
  conditions jsonb NOT NULL DEFAULT '{}',
  action text NOT NULL DEFAULT 'flag', -- flag, block, review, allow
  severity text DEFAULT 'medium', -- low, medium, high, critical
  -- Scope
  applies_to text DEFAULT 'all', -- all, pix, card, boleto
  -- Status
  is_active boolean DEFAULT true,
  priority integer DEFAULT 50,
  -- Stats
  triggers_count integer DEFAULT 0,
  last_triggered_at timestamptz,
  -- Metadata
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.risk_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can manage risk rules" ON public.risk_rules FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ===========================================
-- SETTLEMENT BATCHES
-- ===========================================
CREATE TABLE public.settlement_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Batch info
  batch_number text NOT NULL,
  settlement_date date NOT NULL,
  -- Financial
  total_amount numeric NOT NULL DEFAULT 0,
  total_fees numeric NOT NULL DEFAULT 0,
  net_amount numeric NOT NULL DEFAULT 0,
  transaction_count integer NOT NULL DEFAULT 0,
  -- Breakdown
  pix_amount numeric DEFAULT 0,
  card_amount numeric DEFAULT 0,
  boleto_amount numeric DEFAULT 0,
  refund_amount numeric DEFAULT 0,
  chargeback_amount numeric DEFAULT 0,
  -- Status
  status text NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed, partial
  -- Payment
  paid_at timestamptz,
  bank_reference text DEFAULT '',
  -- Metadata
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.settlement_batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can manage settlements" ON public.settlement_batches FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ===========================================
-- BLACKLIST (anti-fraud)
-- ===========================================
CREATE TABLE public.blacklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL, -- cpf, email, phone, card_bin, ip, device_id
  value text NOT NULL,
  reason text DEFAULT '',
  added_by uuid,
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(type, value)
);

ALTER TABLE public.blacklist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can manage blacklist" ON public.blacklist FOR ALL USING (has_role(auth.uid(), 'admin'));
