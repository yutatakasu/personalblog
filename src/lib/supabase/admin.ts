import type { SupabaseClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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
  if (typeof window === "undefined") {
    throw new Error("getAdminSupabaseClient must be used in a client component");
  }

  if (!client) {
    client = createClientComponentClient({
      supabaseUrl: supabaseUrl || "https://placeholder.supabase.co",
      supabaseKey: supabaseAnonKey || "placeholder-key",
    });
  }

  return client;
}

/**
 * Supabase環境変数が設定されているかチェック
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

