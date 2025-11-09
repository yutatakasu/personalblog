import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * 管理画面用のSupabaseクライアント
 * 認証機能を使用する
 *
 * 注意: 環境変数が設定されていない場合、ダミークライアントが作成されますが、
 * 実際の操作は失敗します。環境変数を設定してください。
 */
let client: SupabaseClient | null = null;

export function getAdminSupabaseClient(): SupabaseClient {
  if (!client) {
    client = createBrowserClient(
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
  }

  return client;
}

/**
 * Supabase環境変数が設定されているかチェック
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
