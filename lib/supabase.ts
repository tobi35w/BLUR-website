import { createClient } from '@supabase/supabase-js';

export type Database = {
  public: {
    Tables: {
      waitlist_signups: {
        Row: {
          id: string;
          email: string;
          source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          source?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          author_name: string;
          rating: number;
          review_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          author_name: string;
          rating: number;
          review_text: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          author_name?: string;
          rating?: number;
          review_text?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      review_votes: {
        Row: {
          review_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          review_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          review_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseClient() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );

  return supabaseInstance;
}
