
CREATE POLICY "Users can insert own merchant config"
ON public.merchant_configs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own merchant config"
ON public.merchant_configs
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);
