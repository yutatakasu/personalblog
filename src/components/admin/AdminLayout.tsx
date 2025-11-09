"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const adminSupabase = getAdminSupabaseClient();
    const checkSession = async () => {
      // Supabase環境変数のチェック
      if (!isSupabaseConfigured()) {
        router.push("/admin/setup");
        return;
      }

      // サーバー側で既に認証チェック済みなので、ユーザー情報のみ取得
      const {
        data: { user },
      } = await adminSupabase.auth.getUser();

      if (user) {
        setUserEmail(user.email ?? null);
      }

      setLoading(false);
    };

    checkSession();

    // 認証状態の変更を監視（ログアウト時のみリダイレクト）
    const {
      data: { subscription },
    } = adminSupabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" && !session) {
        router.push("/admin/login");
      } else if (session?.user) {
        setUserEmail(session.user.email ?? null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    const adminSupabase = getAdminSupabaseClient();
    await adminSupabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
    setIsMobileSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-neutral-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen bg-neutral-50">
        <AdminSidebar onLogout={handleLogout} userEmail={userEmail} />
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4 lg:hidden">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-sm transition hover:border-neutral-900 hover:text-neutral-900"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="14" y1="18" y2="18" />
                </svg>
              </button>
              <div>
                <p className="text-xs uppercase tracking-widest text-neutral-500">Atlas</p>
                <p className="font-serif text-lg text-neutral-900">Admin Hub</p>
                {userEmail ? <p className="text-xs text-neutral-500">{userEmail}</p> : null}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
              >
                ホームへ
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
              >
                ログアウト
              </button>
            </div>
          </div>
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
            <div className="mx-auto w-full max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </div>

      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[20rem] max-w-full bg-white shadow-xl">
            <AdminSidebar
              variant="mobile"
              className="h-full"
              onLogout={handleLogout}
              userEmail={userEmail}
              onNavigate={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

