export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string;
          event_name: string;
          event_type: string;
          id: string;
          payload: Json | null;
          referrer: string | null;
          session_id: string | null;
          url: string | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          event_name: string;
          event_type: string;
          id?: string;
          payload?: Json | null;
          referrer?: string | null;
          session_id?: string | null;
          url?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          event_name?: string;
          event_type?: string;
          id?: string;
          payload?: Json | null;
          referrer?: string | null;
          session_id?: string | null;
          url?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      benchmark_results: {
        Row: {
          benchmark_id: string;
          created_at: string;
          id: string;
          metrics: Json;
          model_id: string;
          output: Json | null;
          run_id: string | null;
          score: number | null;
          status: string;
          user_id: string;
        };
        Insert: {
          benchmark_id: string;
          created_at?: string;
          id?: string;
          metrics?: Json;
          model_id: string;
          output?: Json | null;
          run_id?: string | null;
          score?: number | null;
          status?: string;
          user_id: string;
        };
        Update: {
          benchmark_id?: string;
          created_at?: string;
          id?: string;
          metrics?: Json;
          model_id?: string;
          output?: Json | null;
          run_id?: string | null;
          score?: number | null;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'benchmark_results_run_id_fkey';
            columns: ['run_id'];
            isOneToOne: false;
            referencedRelation: 'benchmark_runs';
            referencedColumns: ['id'];
          },
        ];
      };
      benchmark_runs: {
        Row: {
          benchmark_id: string;
          completed_at: string | null;
          config: Json;
          created_at: string;
          error: string | null;
          id: string;
          models: Json;
          started_at: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          benchmark_id: string;
          completed_at?: string | null;
          config?: Json;
          created_at?: string;
          error?: string | null;
          id?: string;
          models?: Json;
          started_at?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          benchmark_id?: string;
          completed_at?: string | null;
          config?: Json;
          created_at?: string;
          error?: string | null;
          id?: string;
          models?: Json;
          started_at?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      encryption_keys: {
        Row: {
          created_at: string;
          expires_at: string | null;
          id: string;
          is_active: boolean;
          key_hash: string | null;
          key_name: string | null;
          key_version: number;
          retired_at: string | null;
          rotated_at: string | null;
        };
        Insert: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean;
          key_hash?: string | null;
          key_name?: string | null;
          key_version: number;
          retired_at?: string | null;
          rotated_at?: string | null;
        };
        Update: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean;
          key_hash?: string | null;
          key_name?: string | null;
          key_version?: number;
          retired_at?: string | null;
          rotated_at?: string | null;
        };
        Relationships: [];
      };
      evaluations: {
        Row: {
          completed_at: string | null;
          config: Json;
          created_at: string;
          description: string | null;
          id: string;
          metrics: Json | null;
          mode: string;
          results: Json | null;
          started_at: string | null;
          status: string;
          title: string;
          type: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          config?: Json;
          created_at?: string;
          description?: string | null;
          id?: string;
          metrics?: Json | null;
          mode: string;
          results?: Json | null;
          started_at?: string | null;
          status?: string;
          title: string;
          type: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          config?: Json;
          created_at?: string;
          description?: string | null;
          id?: string;
          metrics?: Json | null;
          mode?: string;
          results?: Json | null;
          started_at?: string | null;
          status?: string;
          title?: string;
          type?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      models: {
        Row: {
          access_level: string | null;
          access_logs: Json | null;
          api_key_encrypted: string | null;
          api_key_hash: string | null;
          config: Json;
          created_at: string;
          id: string;
          is_active: boolean;
          key_created_at: string | null;
          key_last_used: string | null;
          last_rotated: string | null;
          model_id: string;
          name: string;
          provider: string;
          rotation_required: boolean | null;
          security_level: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          access_level?: string | null;
          access_logs?: Json | null;
          api_key_encrypted?: string | null;
          api_key_hash?: string | null;
          config?: Json;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          key_created_at?: string | null;
          key_last_used?: string | null;
          last_rotated?: string | null;
          model_id: string;
          name: string;
          provider: string;
          rotation_required?: boolean | null;
          security_level?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          access_level?: string | null;
          access_logs?: Json | null;
          api_key_encrypted?: string | null;
          api_key_hash?: string | null;
          config?: Json;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          key_created_at?: string | null;
          key_last_used?: string | null;
          last_rotated?: string | null;
          model_id?: string;
          name?: string;
          provider?: string;
          rotation_required?: boolean | null;
          security_level?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          organization: string | null;
          role: string | null;
          role_assigned_at: string | null;
          role_assigned_by: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          organization?: string | null;
          role?: string | null;
          role_assigned_at?: string | null;
          role_assigned_by?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          organization?: string | null;
          role?: string | null;
          role_assigned_at?: string | null;
          role_assigned_by?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      security_audit_log: {
        Row: {
          action: string;
          created_at: string;
          details: Json | null;
          id: string;
          ip_address: unknown;
          resource_id: string | null;
          resource_type: string;
          severity: string;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          created_at?: string;
          details?: Json | null;
          id?: string;
          ip_address?: unknown;
          resource_id?: string | null;
          resource_type: string;
          severity?: string;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          created_at?: string;
          details?: Json | null;
          id?: string;
          ip_address?: unknown;
          resource_id?: string | null;
          resource_type?: string;
          severity?: string;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          expires_at: string | null;
          granted_at: string;
          granted_by: string | null;
          id: string;
          is_active: boolean;
          role: string;
          user_id: string;
        };
        Insert: {
          expires_at?: string | null;
          granted_at?: string;
          granted_by?: string | null;
          id?: string;
          is_active?: boolean;
          role: string;
          user_id: string;
        };
        Update: {
          expires_at?: string | null;
          granted_at?: string;
          granted_by?: string | null;
          id?: string;
          is_active?: boolean;
          role?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      analytics_admin_view: {
        Row: {
          created_at: string | null;
          event_name: string | null;
          event_type: string | null;
          id: string | null;
          payload: Json | null;
          referrer: string | null;
          session_id: string | null;
          url: string | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_name?: string | null;
          event_type?: string | null;
          id?: string | null;
          payload?: Json | null;
          referrer?: string | null;
          session_id?: string | null;
          url?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_name?: string | null;
          event_type?: string | null;
          id?: string | null;
          payload?: Json | null;
          referrer?: string | null;
          session_id?: string | null;
          url?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      analytics_summary: {
        Row: {
          event_count: number | null;
          event_name: string | null;
          event_type: string | null;
          time_bucket: string | null;
          unique_sessions: number | null;
        };
        Relationships: [];
      };
      analytics_summary_safe: {
        Row: {
          day: string | null;
          event_count: number | null;
          event_name: string | null;
          event_type: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      check_auth_config: { Args: never; Returns: Json };
      is_admin: { Args: { user_uuid?: string }; Returns: boolean };
      log_api_key_access: { Args: { model_id: string }; Returns: undefined };
      log_security_event:
        | {
            Args: {
              p_action: string;
              p_details?: Json;
              p_resource_id?: string;
              p_resource_type: string;
            };
            Returns: undefined;
          }
        | {
            Args: {
              p_action: string;
              p_details?: Json;
              p_resource_id?: string;
              p_resource_type: string;
              p_severity?: string;
            };
            Returns: undefined;
          };
      set_initial_admin: { Args: { admin_email: string }; Returns: undefined };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
