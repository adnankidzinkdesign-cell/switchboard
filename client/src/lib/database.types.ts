// Hand-written to match server/migrations/0001_init.sql -- there's no
// Supabase CLI/project link available in this environment to run
// `supabase gen types typescript` and generate this automatically. If that
// ever becomes possible, prefer the generated file over this one; until
// then, keep this in sync by hand whenever the schema changes.

export interface Database {
  public: {
    // `Record<never, never>` (not `Record<string, never>`) -- an index
    // signature of `never` would intersect into every real table's row type
    // and collapse it to `never` too (see TablesAndViews's `Tables & Views`
    // in postgrest-js). This form has no keys at all, so it doesn't collide.
    Views: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
    Tables: {
      switchboard_users: {
        Row: {
          email: string;
          display_name: string | null;
          auth_user_id: string | null;
          role: 'user' | 'admin';
          created_at: string;
          last_sign_in_at: string | null;
        };
        Insert: {
          email: string;
          display_name?: string | null;
          auth_user_id?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
          last_sign_in_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['switchboard_users']['Insert']>;
        Relationships: [];
      };
      app_access: {
        Row: {
          email: string;
          app_id: string;
          can_access: boolean;
          updated_at: string;
        };
        Insert: {
          email: string;
          app_id: string;
          can_access?: boolean;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['app_access']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'app_access_email_fkey';
            columns: ['email'];
            isOneToOne: false;
            referencedRelation: 'switchboard_users';
            referencedColumns: ['email'];
          },
        ];
      };
    };
    Functions: {
      claim_profile: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
  };
}

export type SwitchboardUser = Database['public']['Tables']['switchboard_users']['Row'];
export type AppAccessRow = Database['public']['Tables']['app_access']['Row'];
