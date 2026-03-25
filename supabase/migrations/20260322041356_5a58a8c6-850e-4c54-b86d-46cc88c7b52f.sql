
-- Add global API columns to merchant_configs
ALTER TABLE public.merchant_configs
  ADD COLUMN IF NOT EXISTS global_api_key TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS global_client_id TEXT DEFAULT '';

-- Update existing rows with generated global keys
UPDATE public.merchant_configs
SET
  global_api_key = 'gsk_live_' || replace(gen_random_uuid()::text, '-', ''),
  global_client_id = 'gateway_' || replace(gen_random_uuid()::text, '-', '')
WHERE global_api_key IS NULL OR global_api_key = '';

-- Update handle_new_user to also generate global keys
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _api_key TEXT;
  _global_api_key TEXT;
  _global_client_id TEXT;
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);

  IF NEW.email = 'sparckonmeta@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;

  _api_key := 'sk_live_' || replace(gen_random_uuid()::text, '-', '');
  _global_api_key := 'gsk_live_' || replace(gen_random_uuid()::text, '-', '');
  _global_client_id := 'gateway_' || replace(gen_random_uuid()::text, '-', '');

  INSERT INTO public.merchant_configs (user_id, api_key_hash, global_api_key, global_client_id)
  VALUES (NEW.id, _api_key, _global_api_key, _global_client_id);

  RETURN NEW;
END;
$$;
