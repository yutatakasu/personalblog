"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminSupabase, isSupabaseConfigured } from "@/lib/supabase/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // URLパラメータからエラーを取得
  useEffect(() => {
    if (searchParams.get("error") === "unauthorized") {
      setError("このアカウントには管理画面へのアクセス権限がありません。");
    }
  }, [searchParams]);

  // Supabase環境変数のチェック
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      router.push("/admin/setup");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await adminSupabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // 管理者チェック
        const adminEmails =
          process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").map((email) => email.trim()) || [
            "admin@atlas.inc",
          ];
        const userEmail = data.user.email;

        if (!userEmail || !adminEmails.includes(userEmail)) {
          await adminSupabase.auth.signOut();
          setError("このアカウントには管理画面へのアクセス権限がありません。");
          setLoading(false);
          return;
        }

        router.push("/admin/news");
        router.refresh();
      }
    } catch (err) {
      setError("ログインに失敗しました。もう一度お試しください。");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl text-neutral-900">Atlas Admin</h1>
          <p className="mt-2 text-sm text-neutral-600">管理画面にログイン</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-700">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              placeholder="admin@atlas.inc"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-neutral-700">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-neutral-900 px-4 py-2 font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
}

