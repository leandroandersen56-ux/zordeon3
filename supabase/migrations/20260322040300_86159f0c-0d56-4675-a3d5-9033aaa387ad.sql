
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _api_key TEXT;
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  
  -- Assign admin role if email matches
  IF NEW.email = 'sparckonmeta@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;

  -- Auto-generate merchant_configs with API key
  _api_key := 'sk_live_' || replace(gen_random_uuid()::text, '-', '');
  INSERT INTO public.merchant_configs (user_id, api_key_hash)
  VALUES (NEW.id, _api_key);
  
  RETURN NEW;
END;
$function$;
