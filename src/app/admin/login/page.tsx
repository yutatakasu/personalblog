"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

function AdminLoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  // URLパラメータからエラーを取得
  useEffect(() => {
    const errorParam = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const rateLimitMessage = searchParams.get("rate_limit_message");

    if (rateLimitMessage) {
      setRateLimitError(decodeURIComponent(rateLimitMessage));
    } else if (errorParam === "unauthorized") {
      setError(
        errorDescription
          ? decodeURIComponent(errorDescription)
          : "このアカウントには管理画面へのアクセス権限がありません。",
      );
    } else if (errorParam === "rate_limited") {
      setRateLimitError(
        errorDescription
          ? decodeURIComponent(errorDescription)
          : "ログイン試行回数が上限に達しました。しばらくしてから再試行してください。",
      );
    } else if (errorParam === "exchange_failed") {
      setError(
        errorDescription
          ? decodeURIComponent(errorDescription)
          : "認証に失敗しました。もう一度お試しください。",
      );
    } else if (errorParam === "oauth_start_failed") {
      setError(
        errorDescription
          ? decodeURIComponent(errorDescription)
          : "ログインの開始に失敗しました。もう一度お試しください。",
      );
    }
  }, [searchParams]);

  // Supabase環境変数のチェック
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      router.push("/admin/setup");
    }
  }, [router]);

  // Google OAuthログイン
  const handleGoogleLogin = async () => {
    setError(null);
    setRateLimitError(null);
    setLoading(true);

    try {
      // サーバー側の /admin/login/start ルートにリダイレクト
      // サーバー側でレート制限チェックが行われる
      window.location.href = "/admin/login/start";
    } catch (_err) {
      setError("ログインに失敗しました。もう一度お試しください。");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl text-neutral-900">Atlas Admin</h1>
          <p className="mt-2 text-sm text-neutral-600">
            許可されたGoogleアカウントでログインしてください
          </p>
        </div>

        <div className="space-y-6">
          {(error || rateLimitError) && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {rateLimitError || error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 font-medium text-neutral-700 transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <title>Google ロゴ</title>
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {loading ? "ログイン中..." : "Googleでログイン"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginPageInner />
    </Suspense>
  );
}
