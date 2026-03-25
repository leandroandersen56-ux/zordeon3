
-- =====================================================
-- CORREÇÃO #3: Restringir profiles UPDATE a colunas seguras
-- Usar column-level grants ao invés de policy genérica
-- =====================================================

-- Dropar policy genérica
DROP POLICY IF EXISTS "Users can update own profile safe" ON public.profiles;

-- Criar policy restritiva: usuários só podem atualizar campos seguros via SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.update_own_profile(
  _full_name text DEFAULT NULL,
  _phone text DEFAULT NULL,
  _cpf text DEFAULT NULL,
  _avatar_url text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET
    full_name = COALESCE(_full_name, full_name),
    phone = COALESCE(_phone, phone),
    cpf = COALESCE(_cpf, cpf),
    avatar_url = COALESCE(_avatar_url, avatar_url),
    updated_at = now()
  WHERE id = auth.uid();
END;
$$;

-- Não dar UPDATE direto ao usuário no profiles (apenas admins)
-- A policy de admin UPDATE já existe

-- =====================================================
-- CORREÇÃO #4: Transações - usuários só INSERT + SELECT
-- =====================================================

DROP POLICY IF EXISTS "Users can manage own transactions" ON public.transactions;
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- =====================================================
-- CORREÇÃO #5: payment_transactions - só INSERT + SELECT
-- =====================================================

DROP POLICY IF EXISTS "Users can manage own payment transactions" ON public.payment_transactions;
CREATE POLICY "Users can insert own payment transactions" ON public.payment_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own payment transactions" ON public.payment_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- =====================================================
-- CORREÇÃO #6: payment_withdrawals - só INSERT + SELECT
-- =====================================================

DROP POLICY IF EXISTS "Users can manage own payment withdrawals" ON public.payment_withdrawals;
CREATE POLICY "Users can insert own payment withdrawals" ON public.payment_withdrawals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own payment withdrawals" ON public.payment_withdrawals FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- =====================================================
-- CORREÇÃO #7: withdrawals - só INSERT + SELECT
-- =====================================================

DROP POLICY IF EXISTS "Users can manage own withdrawals" ON public.withdrawals;
CREATE POLICY "Users can insert own withdrawals" ON public.withdrawals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own withdrawals" ON public.withdrawals FOR SELECT TO authenticated USING (auth.uid() = user_id);
