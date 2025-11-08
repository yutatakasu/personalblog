"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { adminSupabase, isSupabaseConfigured } from "@/lib/supabase/admin";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      // Supabase環境変数のチェック
      if (!isSupabaseConfigured()) {
        router.push("/admin/setup");
        return;
      }

      const {
        data: { session },
      } = await adminSupabase.auth.getSession();

      if (!session) {
        router.push("/admin/login");
        return;
      }

      // 管理者チェック（メールアドレスで判定）
      const adminEmails =
        process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").map((email) => email.trim()) || [
          "admin@atlas.inc",
        ];
      const userEmail = session.user.email;

      if (!userEmail || !adminEmails.includes(userEmail)) {
        router.push("/admin/login?error=unauthorized");
        return;
      }

      setLoading(false);
    };

    checkSession();

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = adminSupabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/admin/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await adminSupabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-neutral-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-200 bg-white">
        <div className="sticky top-0 p-6">
          <div className="mb-8">
            <h1 className="font-serif text-xl text-neutral-900">Atlas Admin</h1>
            <p className="mt-1 text-xs text-neutral-500">管理画面</p>
          </div>

          <nav className="space-y-2">
            <Link
              href="/admin/news"
              className="block rounded-lg px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100"
            >
              ニュース
            </Link>
            <Link
              href="/admin/positions"
              className="block rounded-lg px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100"
            >
              募集情報
            </Link>
            <Link
              href="/admin/team"
              className="block rounded-lg px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100"
            >
              チームメンバー
            </Link>
            <Link
              href="/admin/investors"
              className="block rounded-lg px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100"
            >
              投資家グループ
            </Link>
          </nav>

          <div className="mt-8 border-t border-neutral-200 pt-4">
            <Link
              href="/"
              className="block rounded-lg px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100"
            >
              ← ホームページへ戻る
            </Link>
            <button
              onClick={handleLogout}
              className="mt-2 w-full rounded-lg px-4 py-2 text-left text-sm text-neutral-700 transition hover:bg-neutral-100"
            >
              ログアウト
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

