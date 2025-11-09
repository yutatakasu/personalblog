import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Client-side Supabase client
 * Use this in Client Components
 *
 * 注意: 環境変数が設定されていない場合、ダミークライアントが作成されますが、
 * 実際の操作は失敗します。環境変数を設定してください。
 */
export const supabase = createBrowserClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      path: "/",
    },
  },
);
