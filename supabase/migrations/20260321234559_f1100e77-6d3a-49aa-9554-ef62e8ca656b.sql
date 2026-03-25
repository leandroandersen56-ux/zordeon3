CREATE TABLE public.checkout_domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  configured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.checkout_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own domain" ON public.checkout_domains FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own domain" ON public.checkout_domains FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own domain" ON public.checkout_domains FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own domain" ON public.checkout_domains FOR DELETE TO authenticated USING (auth.uid() = user_id);