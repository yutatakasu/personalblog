"use client";

import type { User } from "@supabase/supabase-js";
import { PanelLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // ユーザー情報を抽出する共通関数
  const extractUserInfo = useCallback((user: User | null | undefined) => {
    const metadata = user?.user_metadata || {};
    const identityData = user?.identities?.[0]?.identity_data || {};

    // デバッグ: ユーザーオブジェクトの構造を確認
    console.log("=== Extracting user info ===");
    console.log("User object:", user);
    console.log("user_metadata:", metadata);
    console.log("app_metadata:", user?.app_metadata);
    console.log("identities:", user?.identities);
    console.log("identity_data:", identityData);

    // ユーザー名を複数の場所から取得
    const name =
      metadata.full_name ||
      metadata.name ||
      identityData.full_name ||
      identityData.name ||
      user?.email?.split("@")[0] || // フォールバック: メールアドレスの@より前
      null;

    // アバター画像URLは複数の場所に保存される可能性がある
    const avatarUrl =
      metadata.avatar_url ||
      metadata.picture ||
      identityData.avatar_url ||
      identityData.picture ||
      user?.app_metadata?.avatar_url ||
      user?.app_metadata?.picture ||
      null;

    console.log("Extracted name:", name);
    console.log("Extracted avatarUrl:", avatarUrl);
    console.log("Extracted email:", user?.email);
    console.log("===========================");

    const email =
      user?.email ||
      metadata.email ||
      identityData.email ||
      user?.app_metadata?.email ||
      null;

    return {
      email,
      name,
      avatarUrl,
    };
  }, []);

  useEffect(() => {
    const adminSupabase = getAdminSupabaseClient();

    const checkSession = async () => {
      // Supabase環境変数のチェック
      if (!isSupabaseConfigured()) {
        router.push("/admin/setup");
        return;
      }

      try {
        // セッションとユーザー情報を取得
        const {
          data: { session },
        } = await adminSupabase.auth.getSession();

        if (session?.user) {
          const userInfo = extractUserInfo(session.user);
          setUserEmail(userInfo.email);
          setUserName(userInfo.name);
          setUserAvatarUrl(userInfo.avatarUrl);
        } else {
          // セッションがない場合、getUser()も試す
          const {
            data: { user },
          } = await adminSupabase.auth.getUser();

          if (user) {
            const userInfo = extractUserInfo(user);
            setUserEmail(userInfo.email);
            setUserName(userInfo.name);
            setUserAvatarUrl(userInfo.avatarUrl);
          }
        }
      } catch (error) {
        console.error("Error getting session/user:", error);
      }

      setLoading(false);
    };

    checkSession();

    // 認証状態の変更を監視（すべてのイベントを処理）
    const {
      data: { subscription },
    } = adminSupabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (event === "SIGNED_OUT" && !session) {
        setUserEmail(null);
        setUserName(null);
        setUserAvatarUrl(null);
        router.push("/admin/login");
      } else if (session?.user) {
        // SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED などのイベントでユーザー情報を更新
        const userInfo = extractUserInfo(session.user);
        setUserEmail(userInfo.email);
        setUserName(userInfo.name);
        setUserAvatarUrl(userInfo.avatarUrl);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, extractUserInfo]);

  const handleLogout = async () => {
    try {
      const adminSupabase = getAdminSupabaseClient();

      // セッションを確実にクリア
      const { error } = await adminSupabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        // エラーが発生してもログイン画面にリダイレクト
        window.location.href = "/admin/login";
        return;
      }

      setIsMobileSidebarOpen(false);

      // セッションがクリアされるのを少し待つ
      await new Promise((resolve) => setTimeout(resolve, 200));

      // 強制的にログイン画面にリダイレクト（ページ全体をリロードしてセッションを確実に更新）
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Failed to logout:", error);
      // エラーが発生してもログイン画面にリダイレクト
      window.location.href = "/admin/login";
    }
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
            userName={userName}
            userAvatarUrl={userAvatarUrl}
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
              userName={userName}
              userAvatarUrl={userAvatarUrl}
              onNavigate={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
