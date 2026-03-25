export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      acquirers: {
        Row: {
          api_endpoint: string | null
          api_version: string | null
          avg_response_ms: number | null
          created_at: string
          credential_key: string | null
          daily_limit: number | null
          id: string
          last_health_check: string | null
          max_amount: number | null
          min_amount: number | null
          monthly_limit: number | null
          name: string
          notes: string | null
          priority: number
          provider: string
          settlement_type: string | null
          status: string
          success_rate: number | null
          supports_partial_refund: boolean | null
          supports_recurring: boolean | null
          supports_refund: boolean | null
          supports_split: boolean | null
          total_processed: number | null
          type: string
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          api_endpoint?: string | null
          api_version?: string | null
          avg_response_ms?: number | null
          created_at?: string
          credential_key?: string | null
          daily_limit?: number | null
          id?: string
          last_health_check?: string | null
          max_amount?: number | null
          min_amount?: number | null
          monthly_limit?: number | null
          name: string
          notes?: string | null
          priority?: number
          provider: string
          settlement_type?: string | null
          status?: string
          success_rate?: number | null
          supports_partial_refund?: boolean | null
          supports_recurring?: boolean | null
          supports_refund?: boolean | null
          supports_split?: boolean | null
          total_processed?: number | null
          type?: string
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          api_endpoint?: string | null
          api_version?: string | null
          avg_response_ms?: number | null
          created_at?: string
          credential_key?: string | null
          daily_limit?: number | null
          id?: string
          last_health_check?: string | null
          max_amount?: number | null
          min_amount?: number | null
          monthly_limit?: number | null
          name?: string
          notes?: string | null
          priority?: number
          provider?: string
          settlement_type?: string | null
          status?: string
          success_rate?: number | null
          supports_partial_refund?: boolean | null
          supports_recurring?: boolean | null
          supports_refund?: boolean | null
          supports_split?: boolean | null
          total_processed?: number | null
          type?: string
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      admin_audit_log: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          target_id: string | null
          target_type: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string
        }
        Relationships: []
      }
      blacklist: {
        Row: {
          added_by: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          reason: string | null
          type: string
          value: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          reason?: string | null
          type: string
          value: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          reason?: string | null
          type?: string
          value?: string
        }
        Relationships: []
      }
      checkout_domains: {
        Row: {
          configured_at: string
          created_at: string
          domain: string
          id: string
          status: string
          updated_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          configured_at?: string
          created_at?: string
          domain: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          configured_at?: string
          created_at?: string
          domain?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string | null
          cnpj: string | null
          complemento: string | null
          created_at: string
          id: string
          nome_fatura: string | null
          numero: string | null
          produtos_vendidos: string | null
          razao_social: string | null
          rua: string | null
          site: string | null
          updated_at: string
          user_id: string
          vende_fisicos: boolean | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          complemento?: string | null
          created_at?: string
          id?: string
          nome_fatura?: string | null
          numero?: string | null
          produtos_vendidos?: string | null
          razao_social?: string | null
          rua?: string | null
          site?: string | null
          updated_at?: string
          user_id: string
          vende_fisicos?: boolean | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          complemento?: string | null
          created_at?: string
          id?: string
          nome_fatura?: string | null
          numero?: string | null
          produtos_vendidos?: string | null
          razao_social?: string | null
          rua?: string | null
          site?: string | null
          updated_at?: string
          user_id?: string
          vende_fisicos?: boolean | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          city: string | null
          cpf_cnpj: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          state: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          state?: string | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          state?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      disputes: {
        Row: {
          acquirer_reference: string | null
          amount: number
          card_brand: string | null
          created_at: string
          currency: string | null
          evidence_due_date: string | null
          evidence_notes: string | null
          evidence_submitted: boolean | null
          id: string
          reason_code: string | null
          reason_description: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          transaction_id: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          acquirer_reference?: string | null
          amount?: number
          card_brand?: string | null
          created_at?: string
          currency?: string | null
          evidence_due_date?: string | null
          evidence_notes?: string | null
          evidence_submitted?: boolean | null
          id?: string
          reason_code?: string | null
          reason_description?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          transaction_id?: string | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          acquirer_reference?: string | null
          amount?: number
          card_brand?: string | null
          created_at?: string
          currency?: string | null
          evidence_due_date?: string | null
          evidence_notes?: string | null
          evidence_submitted?: boolean | null
          id?: string
          reason_code?: string | null
          reason_description?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          transaction_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_config: {
        Row: {
          created_at: string
          fixed_fee: number
          id: string
          is_active: boolean
          label: string
          method: string
          percentage_fee: number
          reserve_percentage: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          fixed_fee?: number
          id?: string
          is_active?: boolean
          label: string
          method: string
          percentage_fee?: number
          reserve_percentage?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          fixed_fee?: number
          id?: string
          is_active?: boolean
          label?: string
          method?: string
          percentage_fee?: number
          reserve_percentage?: number
          updated_at?: string
        }
        Relationships: []
      }
      gateway_credentials: {
        Row: {
          created_at: string
          gateway: string
          id: string
          is_active: boolean | null
          public_key: string | null
          secret_key: string | null
          updated_at: string
          user_id: string
          webhook_code: string | null
        }
        Insert: {
          created_at?: string
          gateway?: string
          id?: string
          is_active?: boolean | null
          public_key?: string | null
          secret_key?: string | null
          updated_at?: string
          user_id: string
          webhook_code?: string | null
        }
        Update: {
          created_at?: string
          gateway?: string
          id?: string
          is_active?: boolean | null
          public_key?: string | null
          secret_key?: string | null
          updated_at?: string
          user_id?: string
          webhook_code?: string | null
        }
        Relationships: []
      }
      merchant_configs: {
        Row: {
          api_key_hash: string | null
          auto_settlement: boolean | null
          block_international: boolean | null
          block_prepaid_cards: boolean | null
          boleto_fee_fixed: number | null
          boleto_fee_pct: number | null
          card_fee_fixed: number | null
          card_fee_pct: number | null
          created_at: string
          daily_transaction_limit: number | null
          global_api_key: string | null
          global_client_id: string | null
          id: string
          is_active: boolean | null
          is_sandbox: boolean | null
          max_chargeback_rate: number | null
          max_transactions_per_day: number | null
          max_transactions_per_hour: number | null
          min_transaction_amount: number | null
          monthly_transaction_limit: number | null
          notes: string | null
          pix_fee_fixed: number | null
          pix_fee_pct: number | null
          require_3ds: boolean | null
          require_avs: boolean | null
          risk_level: string | null
          risk_score: number | null
          settlement_account: string | null
          settlement_account_type: string | null
          settlement_agency: string | null
          settlement_bank_code: string | null
          settlement_cycle: string | null
          settlement_pix_key: string | null
          single_transaction_limit: number | null
          updated_at: string
          user_id: string
          velocity_check_enabled: boolean | null
          webhook_secret_hash: string | null
          webhook_url: string | null
        }
        Insert: {
          api_key_hash?: string | null
          auto_settlement?: boolean | null
          block_international?: boolean | null
          block_prepaid_cards?: boolean | null
          boleto_fee_fixed?: number | null
          boleto_fee_pct?: number | null
          card_fee_fixed?: number | null
          card_fee_pct?: number | null
          created_at?: string
          daily_transaction_limit?: number | null
          global_api_key?: string | null
          global_client_id?: string | null
          id?: string
          is_active?: boolean | null
          is_sandbox?: boolean | null
          max_chargeback_rate?: number | null
          max_transactions_per_day?: number | null
          max_transactions_per_hour?: number | null
          min_transaction_amount?: number | null
          monthly_transaction_limit?: number | null
          notes?: string | null
          pix_fee_fixed?: number | null
          pix_fee_pct?: number | null
          require_3ds?: boolean | null
          require_avs?: boolean | null
          risk_level?: string | null
          risk_score?: number | null
          settlement_account?: string | null
          settlement_account_type?: string | null
          settlement_agency?: string | null
          settlement_bank_code?: string | null
          settlement_cycle?: string | null
          settlement_pix_key?: string | null
          single_transaction_limit?: number | null
          updated_at?: string
          user_id: string
          velocity_check_enabled?: boolean | null
          webhook_secret_hash?: string | null
          webhook_url?: string | null
        }
        Update: {
          api_key_hash?: string | null
          auto_settlement?: boolean | null
          block_international?: boolean | null
          block_prepaid_cards?: boolean | null
          boleto_fee_fixed?: number | null
          boleto_fee_pct?: number | null
          card_fee_fixed?: number | null
          card_fee_pct?: number | null
          created_at?: string
          daily_transaction_limit?: number | null
          global_api_key?: string | null
          global_client_id?: string | null
          id?: string
          is_active?: boolean | null
          is_sandbox?: boolean | null
          max_chargeback_rate?: number | null
          max_transactions_per_day?: number | null
          max_transactions_per_hour?: number | null
          min_transaction_amount?: number | null
          monthly_transaction_limit?: number | null
          notes?: string | null
          pix_fee_fixed?: number | null
          pix_fee_pct?: number | null
          require_3ds?: boolean | null
          require_avs?: boolean | null
          risk_level?: string | null
          risk_score?: number | null
          settlement_account?: string | null
          settlement_account_type?: string | null
          settlement_agency?: string | null
          settlement_bank_code?: string | null
          settlement_cycle?: string | null
          settlement_pix_key?: string | null
          single_transaction_limit?: number | null
          updated_at?: string
          user_id?: string
          velocity_check_enabled?: boolean | null
          webhook_secret_hash?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      payment_links: {
        Row: {
          amount: number
          conversions: number
          created_at: string
          id: string
          slug: string
          status: string
          title: string
          user_id: string
          visits: number
        }
        Insert: {
          amount?: number
          conversions?: number
          created_at?: string
          id?: string
          slug: string
          status?: string
          title: string
          user_id: string
          visits?: number
        }
        Update: {
          amount?: number
          conversions?: number
          created_at?: string
          id?: string
          slug?: string
          status?: string
          title?: string
          user_id?: string
          visits?: number
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          buyer_document: string | null
          buyer_name: string | null
          buyer_phone: string | null
          created_at: string
          e2e_id: string | null
          external_id: string | null
          id: string
          liquid_amount: number | null
          paid_at: string | null
          payment_method: string
          pix_emv: string | null
          platform_tax: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          buyer_document?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          created_at?: string
          e2e_id?: string | null
          external_id?: string | null
          id?: string
          liquid_amount?: number | null
          paid_at?: string | null
          payment_method?: string
          pix_emv?: string | null
          platform_tax?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          buyer_document?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          created_at?: string
          e2e_id?: string | null
          external_id?: string | null
          id?: string
          liquid_amount?: number | null
          paid_at?: string | null
          payment_method?: string
          pix_emv?: string | null
          platform_tax?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_withdrawals: {
        Row: {
          amount: number
          created_at: string
          e2e_id: string | null
          external_id: string | null
          id: string
          liquid_amount: number | null
          paid_at: string | null
          pix_key: string
          pix_key_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          e2e_id?: string | null
          external_id?: string | null
          id?: string
          liquid_amount?: number | null
          paid_at?: string | null
          pix_key: string
          pix_key_type?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          e2e_id?: string | null
          external_id?: string | null
          id?: string
          liquid_amount?: number | null
          paid_at?: string | null
          pix_key?: string
          pix_key_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pix_keys: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          key_type: string
          key_value: string
          label: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          key_type?: string
          key_value: string
          label: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          key_type?: string
          key_value?: string
          label?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pixels: {
        Row: {
          api_key: string | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          pixel_id: string
          trigger_on_creation: boolean | null
          trigger_on_payment: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          pixel_id: string
          trigger_on_creation?: boolean | null
          trigger_on_payment?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          pixel_id?: string
          trigger_on_creation?: boolean | null
          trigger_on_payment?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_status: string
          approved_at: string | null
          avatar_url: string | null
          balance_card: number
          balance_pending: number
          balance_pix: number
          blocked_at: string | null
          cpf: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          kyc_notes: string | null
          kyc_status: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          account_status?: string
          approved_at?: string | null
          avatar_url?: string | null
          balance_card?: number
          balance_pending?: number
          balance_pix?: number
          blocked_at?: string | null
          cpf?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id: string
          kyc_notes?: string | null
          kyc_status?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          account_status?: string
          approved_at?: string | null
          avatar_url?: string | null
          balance_card?: number
          balance_pending?: number
          balance_pix?: number
          blocked_at?: string | null
          cpf?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          kyc_notes?: string | null
          kyc_status?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      risk_rules: {
        Row: {
          action: string
          applies_to: string | null
          conditions: Json
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          name: string
          priority: number | null
          severity: string | null
          triggers_count: number | null
          type: string
          updated_at: string
        }
        Insert: {
          action?: string
          applies_to?: string | null
          conditions?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          name: string
          priority?: number | null
          severity?: string | null
          triggers_count?: number | null
          type?: string
          updated_at?: string
        }
        Update: {
          action?: string
          applies_to?: string | null
          conditions?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          name?: string
          priority?: number | null
          severity?: string | null
          triggers_count?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      settlement_batches: {
        Row: {
          bank_reference: string | null
          batch_number: string
          boleto_amount: number | null
          card_amount: number | null
          chargeback_amount: number | null
          created_at: string
          id: string
          net_amount: number
          notes: string | null
          paid_at: string | null
          pix_amount: number | null
          refund_amount: number | null
          settlement_date: string
          status: string
          total_amount: number
          total_fees: number
          transaction_count: number
          updated_at: string
        }
        Insert: {
          bank_reference?: string | null
          batch_number: string
          boleto_amount?: number | null
          card_amount?: number | null
          chargeback_amount?: number | null
          created_at?: string
          id?: string
          net_amount?: number
          notes?: string | null
          paid_at?: string | null
          pix_amount?: number | null
          refund_amount?: number | null
          settlement_date: string
          status?: string
          total_amount?: number
          total_fees?: number
          transaction_count?: number
          updated_at?: string
        }
        Update: {
          bank_reference?: string | null
          batch_number?: string
          boleto_amount?: number | null
          card_amount?: number | null
          chargeback_amount?: number | null
          created_at?: string
          id?: string
          net_amount?: number
          notes?: string | null
          paid_at?: string | null
          pix_amount?: number | null
          refund_amount?: number | null
          settlement_date?: string
          status?: string
          total_amount?: number
          total_fees?: number
          transaction_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: string
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: string
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          customer_id: string | null
          description: string | null
          id: string
          method: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: string
          method?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: string
          method?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          event_id: string
          event_type: string
          id: string
          payload: Json | null
          processed_at: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          event_type: string
          id?: string
          payload?: Json | null
          processed_at?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          event_type?: string
          id?: string
          payload?: Json | null
          processed_at?: string | null
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          created_at: string
          event: string
          id: string
          status: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event?: string
          id?: string
          status?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          status?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number
          created_at: string
          fee: number
          id: string
          recipient: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          fee?: number
          id?: string
          recipient?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          fee?: number
          id?: string
          recipient?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      update_own_profile: {
        Args: {
          _avatar_url?: string
          _cpf?: string
          _full_name?: string
          _phone?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
