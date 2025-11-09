"use client";

import { PanelLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  getAdminSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/admin";
import { AdminSidebar } from "./AdminSidebar";

const segmentLabels: Record<string, string> = {
  hub: "ハブ",
  news: "ニュース",
  positions: "採用ポジション",
  team: "チームメンバー",
  supporters: "サポーター",
  new: "新規作成",
  edit: "編集",
};

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const toggleSidebar = () => {
    setIsSidebarCollapsed((previous) => !previous);
  };

  const breadcrumbItems = useMemo(() => {
    const baseItems: BreadcrumbItem[] = [
      { label: "Atlas Admin", href: "/admin/hub" },
    ];
    if (!pathname) {
      return baseItems;
    }

    const segments = pathname.split("/").filter(Boolean);
    let accumulatedPath = "";

    segments.forEach((segment, index) => {
      accumulatedPath += `/${segment}`;
      if (segment === "admin") {
        return;
      }

      const isLast = index === segments.length - 1;
      const label = segmentLabels[segment] ?? "詳細";

      baseItems.push({
        label,
        href: isLast ? undefined : accumulatedPath,
      });
    });

    const normalized: BreadcrumbItem[] = [];
    for (const item of baseItems) {
      const previous = normalized.at(-1);
      if (previous?.label === item.label) {
        continue;
      }
      normalized.push(item);
    }

    return normalized;
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-500">
        読み込み中...
      </div>
    );
  }

  return (
    <>
      <div className="relative flex h-screen overflow-hidden bg-neutral-100 text-neutral-900">
        <div
          className={[
            "hidden md:flex md:flex-col md:border-r md:border-neutral-200 md:bg-white/90 md:shadow-sm md:backdrop-blur md:sticky md:top-0 md:h-screen transition-all duration-300",
            isSidebarCollapsed ? "md:w-20" : "md:w-72",
          ].join(" ")}
        >
          <AdminSidebar
            onLogout={handleLogout}
            userEmail={userEmail}
            isCollapsed={isSidebarCollapsed}
          />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden p-2 sm:p-3 lg:p-5">
          <div className="flex h-full flex-col rounded-3xl border border-neutral-200 bg-white/95 shadow-[0_45px_90px_-40px_rgba(15,23,42,0.35)] backdrop-blur">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-3 rounded-t-3xl border-b border-neutral-200 bg-white/95 px-3 sm:px-5 backdrop-blur">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="hidden h-9 w-9 items-center justify-center rounded-md border border-transparent text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 md:inline-flex"
                  aria-label={
                    isSidebarCollapsed
                      ? "サイドバーを展開する"
                      : "サイドバーを折りたたむ"
                  }
                >
                  <PanelLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 md:hidden"
                  aria-label="サイドバーを開く"
                >
                  <PanelLeft className="h-4 w-4" />
                </button>
                <span
                  className="hidden h-6 w-px bg-neutral-200 md:block"
                  aria-hidden="true"
                />
                <nav
                  aria-label="パンくずリスト"
                  className="flex items-center text-sm text-neutral-500"
                >
                  <ol className="flex items-center gap-1">
                    {breadcrumbItems.map((item, index) => {
                      const isLast = index === breadcrumbItems.length - 1;
                      return (
                        <li
                          key={`${item.label}-${index}`}
                          className="flex items-center gap-1"
                        >
                          {item.href && !isLast ? (
                            <Link
                              href={item.href}
                              className="transition hover:text-neutral-900"
                              onClick={() => setIsMobileSidebarOpen(false)}
                            >
                              {item.label}
                            </Link>
                          ) : (
                            <span
                              className={
                                isLast
                                  ? "font-semibold text-neutral-900"
                                  : undefined
                              }
                            >
                              {item.label}
                            </span>
                          )}
                          {isLast ? null : (
                            <span className="text-neutral-300">/</span>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </nav>
              </div>
              <div className="ml-auto">
                {userEmail ? (
                  <span className="hidden text-xs text-neutral-400 md:inline">
                    {userEmail}
                  </span>
                ) : null}
              </div>
            </header>
            <main className="flex-1 overflow-y-auto px-3 pb-6 sm:px-5 sm:pb-8 md:px-6">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 pt-5">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>

      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="モバイルサイドバーを閉じる"
            className="absolute inset-0 h-full w-full bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[18.5rem] max-w-full bg-white shadow-2xl">
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
