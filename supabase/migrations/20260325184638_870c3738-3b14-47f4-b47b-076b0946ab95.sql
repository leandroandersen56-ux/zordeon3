
CREATE TABLE public.merchant_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  api_key_hash TEXT,
  global_api_key TEXT,
  global_client_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  pix_fee_pct NUMERIC,
  pix_fee_fixed NUMERIC,
  card_fee_pct NUMERIC,
  card_fee_fixed NUMERIC,
  boleto_fee_pct NUMERIC,
  boleto_fee_fixed NUMERIC,
  daily_transaction_limit NUMERIC DEFAULT 50000,
  monthly_transaction_limit NUMERIC DEFAULT 1500000,
  single_transaction_limit NUMERIC DEFAULT 10000,
  min_transaction_amount NUMERIC DEFAULT 1,
  settlement_cycle TEXT DEFAULT 'D+1',
  auto_settlement BOOLEAN DEFAULT true,
  settlement_pix_key TEXT,
  settlement_bank_code TEXT,
  settlement_agency TEXT,
  settlement_account TEXT,
  settlement_account_type TEXT DEFAULT 'checking',
  risk_level TEXT DEFAULT 'medium',
  max_chargeback_rate NUMERIC DEFAULT 1.0,
  velocity_check_enabled BOOLEAN DEFAULT true,
  max_transactions_per_hour INTEGER DEFAULT 100,
  max_transactions_per_day INTEGER DEFAULT 1000,
  require_3ds BOOLEAN DEFAULT false,
  require_avs BOOLEAN DEFAULT false,
  block_international BOOLEAN DEFAULT false,
  block_prepaid_cards BOOLEAN DEFAULT false,
  is_sandbox BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.merchant_configs ENABLE ROW LEVEL SECURITY;

-- Users can view their own config
CREATE POLICY "Users can view own merchant config"
  ON public.merchant_configs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can upsert their own config
CREATE POLICY "Users can upsert own merchant config"
  ON public.merchant_configs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own merchant config"
  ON public.merchant_configs FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Admins can manage all configs
CREATE POLICY "Admins can select all merchant configs"
  ON public.merchant_configs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert merchant configs"
  ON public.merchant_configs FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update merchant configs"
  ON public.merchant_configs FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
