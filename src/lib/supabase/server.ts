import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Server-side Supabase client
 * Use this in Server Components and API routes
 *
 * 注意: 環境変数が設定されていない場合、ダミークライアントが作成されますが、
 * 実際の操作は失敗します。環境変数を設定してください。
 */
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: false,
    },
  },
);
