
CREATE TABLE public.pixels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  pixel_id TEXT NOT NULL,
  api_key TEXT DEFAULT '',
  trigger_on_payment BOOLEAN DEFAULT true,
  trigger_on_creation BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pixels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own pixels"
ON public.pixels FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all pixels"
ON public.pixels FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
