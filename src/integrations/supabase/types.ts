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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
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
          is_active: boolean
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
          is_active?: boolean
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
          is_active?: boolean
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
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
