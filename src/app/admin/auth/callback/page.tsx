"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminSupabase } from "@/lib/supabase/admin";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URLパラメータからcodeまたはerrorを取得
        const code = searchParams.get("code");
        const errorParam = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        // エラーパラメータがある場合
        if (errorParam) {
          setError(
            errorDescription
              ? decodeURIComponent(errorDescription)
              : "認証に失敗しました。",
          );
          setLoading(false);
          return;
        }

        // codeがある場合は、セッションを交換
        let session;
        if (code) {
          const {
            data: { session: exchangedSession },
            error: exchangeError,
          } = await adminSupabase.auth.exchangeCodeForSession(code);

          if (exchangeError || !exchangedSession) {
            setError("認証コードの交換に失敗しました。");
            setLoading(false);
            return;
          }
          session = exchangedSession;
        } else {
          // codeがない場合は、既存のセッションを確認
          const {
            data: { session: existingSession },
            error: sessionError,
          } = await adminSupabase.auth.getSession();

          if (sessionError || !existingSession) {
            setError("認証コードが取得できませんでした。");
            setLoading(false);
            return;
          }
          session = existingSession;
        }

        // 管理者チェック（環境変数に設定されたメールアドレスのみ）
        const adminEmails =
          process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").map((email) => email.trim()) || [
            "admin@atlas.inc",
          ];
        const userEmail = session.user.email;

        if (!userEmail || !adminEmails.includes(userEmail)) {
          await adminSupabase.auth.signOut();
          router.push("/admin/login?error=unauthorized");
          return;
        }

        // レート制限をリセット
        await fetch("/api/admin/login/rate-limit", {
          method: "DELETE",
        });

        router.push("/admin/news");
        router.refresh();
      } catch (err) {
        setError("認証処理中にエラーが発生しました。");
        setLoading(false);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="mb-4 text-neutral-600">認証中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
          <div className="text-center">
            <h1 className="font-serif text-xl text-red-900">認証エラー</h1>
            <p className="mt-2 text-sm text-red-800">{error}</p>
            <button
              onClick={() => router.push("/admin/login")}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              ログインページに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

