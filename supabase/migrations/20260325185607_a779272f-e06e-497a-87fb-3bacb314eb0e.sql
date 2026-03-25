
-- Create update_own_profile function used in Configuracoes.tsx
CREATE OR REPLACE FUNCTION public.update_own_profile(
  _full_name TEXT,
  _cpf TEXT,
  _phone TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.profiles
  SET full_name = _full_name,
      cpf = _cpf,
      phone = _phone,
      updated_at = now()
  WHERE id = auth.uid();
END;
$$;
