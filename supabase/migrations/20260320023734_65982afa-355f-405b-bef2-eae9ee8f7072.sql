
-- =====================================================
-- CORREÇÃO CRÍTICA #1: Impedir usuários de alterar saldo
-- Revogar UPDATE em colunas financeiras e criar policy restritiva
-- =====================================================

-- Revogar permissão de UPDATE nas colunas de saldo para authenticated
REVOKE UPDATE (balance_pix, balance_card, balance_pending) ON public.profiles FROM authenticated;
REVOKE UPDATE (balance_pix, balance_card, balance_pending) ON public.profiles FROM anon;

-- Dropar a policy existente que permite UPDATE irrestrito
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Recriar policy de UPDATE restrita (sem colunas de saldo)
-- Usuários só podem atualizar campos não-financeiros
CREATE POLICY "Users can update own profile safe"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- =====================================================
-- CORREÇÃO #2: Migrar policies de public para authenticated
-- =====================================================

-- CUSTOMERS
DROP POLICY IF EXISTS "Admins can manage all customers" ON public.customers;
DROP POLICY IF EXISTS "Users can manage own customers" ON public.customers;
CREATE POLICY "Admins can manage all customers" ON public.customers FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can manage own customers" ON public.customers FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- TRANSACTIONS
DROP POLICY IF EXISTS "Admins can manage all transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can manage own transactions" ON public.transactions;
CREATE POLICY "Admins can manage all transactions" ON public.transactions FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can manage own transactions" ON public.transactions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- PAYMENT_LINKS
DROP POLICY IF EXISTS "Admins can manage all links" ON public.payment_links;
DROP POLICY IF EXISTS "Users can manage own links" ON public.payment_links;
CREATE POLICY "Admins can manage all links" ON public.payment_links FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can manage own links" ON public.payment_links FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- WITHDRAWALS
DROP POLICY IF EXISTS "Admins can manage all withdrawals" ON public.withdrawals;
DROP POLICY IF EXISTS "Users can manage own withdrawals" ON public.withdrawals;
CREATE POLICY "Admins can manage all withdrawals" ON public.withdrawals FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can manage own withdrawals" ON public.withdrawals FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- COMPANY_SETTINGS
DROP POLICY IF EXISTS "Admins can manage all companies" ON public.company_settings;
DROP POLICY IF EXISTS "Users can manage own company" ON public.company_settings;
CREATE POLICY "Admins can manage all companies" ON public.company_settings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can manage own company" ON public.company_settings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- WEBHOOKS
DROP POLICY IF EXISTS "Admins can manage all webhooks" ON public.webhooks;
DROP POLICY IF EXISTS "Users can manage own webhooks" ON public.webhooks;
CREATE POLICY "Admins can manage all webhooks" ON public.webhooks FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can manage own webhooks" ON public.webhooks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- PROFILES (SELECT policies)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- ADMIN-ONLY TABLES (migrate to authenticated)
DROP POLICY IF EXISTS "Only admins can view audit log" ON public.admin_audit_log;
CREATE POLICY "Only admins can view audit log" ON public.admin_audit_log FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Only admins can manage system settings" ON public.system_settings;
CREATE POLICY "Only admins can manage system settings" ON public.system_settings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Only admins can manage settlements" ON public.settlement_batches;
CREATE POLICY "Only admins can manage settlements" ON public.settlement_batches FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Only admins can manage risk rules" ON public.risk_rules;
CREATE POLICY "Only admins can manage risk rules" ON public.risk_rules FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Only admins can manage acquirers" ON public.acquirers;
CREATE POLICY "Only admins can manage acquirers" ON public.acquirers FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Only admins can manage blacklist" ON public.blacklist;
CREATE POLICY "Only admins can manage blacklist" ON public.blacklist FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- DISPUTES
DROP POLICY IF EXISTS "Admins can manage all disputes" ON public.disputes;
DROP POLICY IF EXISTS "Users can view own disputes" ON public.disputes;
CREATE POLICY "Admins can manage all disputes" ON public.disputes FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own disputes" ON public.disputes FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- MERCHANT_CONFIGS
DROP POLICY IF EXISTS "Admins can manage all merchant configs" ON public.merchant_configs;
DROP POLICY IF EXISTS "Users can view own merchant config" ON public.merchant_configs;
CREATE POLICY "Admins can manage all merchant configs" ON public.merchant_configs FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own merchant config" ON public.merchant_configs FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- USER_ROLES
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- FEE_CONFIG (restringir leitura a authenticated)
DROP POLICY IF EXISTS "Anyone can read fees" ON public.fee_config;
DROP POLICY IF EXISTS "Only admins can manage fees" ON public.fee_config;
CREATE POLICY "Authenticated can read fees" ON public.fee_config FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage fees" ON public.fee_config FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
