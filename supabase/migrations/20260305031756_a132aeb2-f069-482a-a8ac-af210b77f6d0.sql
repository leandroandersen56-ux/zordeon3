
-- Add KYC and account status to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kyc_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kyc_notes TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS balance_pix NUMERIC(12,2) NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS balance_card NUMERIC(12,2) NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS balance_pending NUMERIC(12,2) NOT NULL DEFAULT 0;

-- Global system settings (admin-only)
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage system settings" ON public.system_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Fee configuration table
CREATE TABLE public.fee_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method TEXT NOT NULL,
  label TEXT NOT NULL,
  fixed_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  percentage_fee NUMERIC(5,2) NOT NULL DEFAULT 0,
  reserve_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.fee_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read fees" ON public.fee_config FOR SELECT USING (true);
CREATE POLICY "Only admins can manage fees" ON public.fee_config FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert default fee configs
INSERT INTO public.fee_config (method, label, fixed_fee, percentage_fee, reserve_percentage) VALUES
  ('pix', 'PIX', 1.50, 4.50, 0),
  ('credit_card', 'Cartão de Crédito', 3.49, 5.99, 25),
  ('boleto', 'Boleto Bancário', 2.99, 4.99, 8);

-- Audit log for admin actions
CREATE TABLE public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit log" ON public.admin_audit_log
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Admin can update profiles (for KYC approval, blocking)
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
