
-- Payment transactions table (Pluggou integration)
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  external_id TEXT,
  amount INTEGER NOT NULL DEFAULT 0,
  platform_tax INTEGER DEFAULT 0,
  liquid_amount INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL DEFAULT 'pix',
  pix_emv TEXT,
  e2e_id TEXT,
  buyer_name TEXT,
  buyer_document TEXT,
  buyer_phone TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own payment transactions" ON public.payment_transactions
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all payment transactions" ON public.payment_transactions
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Payment withdrawals table
CREATE TABLE public.payment_withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  external_id TEXT,
  amount INTEGER NOT NULL DEFAULT 0,
  liquid_amount INTEGER DEFAULT 0,
  pix_key_type TEXT NOT NULL DEFAULT 'cpf',
  pix_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  e2e_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own payment withdrawals" ON public.payment_withdrawals
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all payment withdrawals" ON public.payment_withdrawals
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Webhook events table (idempotency)
CREATE TABLE public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  processed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view webhook events" ON public.webhook_events
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Gateway credentials table (per-user gateway config)
CREATE TABLE public.gateway_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  gateway TEXT NOT NULL DEFAULT 'pluggou',
  public_key TEXT DEFAULT '',
  secret_key TEXT DEFAULT '',
  webhook_code TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gateway_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own gateway credentials" ON public.gateway_credentials
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all gateway credentials" ON public.gateway_credentials
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
