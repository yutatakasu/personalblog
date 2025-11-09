"use client";

import {
  Briefcase,
  Command,
  Handshake,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type AdminSidebarProps = {
  onLogout: () => Promise<void> | void;
  userEmail?: string | null;
  userName?: string | null;
  userAvatarUrl?: string | null;
  className?: string;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
  isCollapsed?: boolean;
};

function GoogleIcon({
  className,
  title = "Google ロゴ",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <title>{title}</title>
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
  );
}

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      {
        href: "/admin/hub",
        label: "ハブ",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "コンテンツ",
    items: [
      {
        href: "/admin/news",
        label: "ニュース",
        icon: Newspaper,
      },
      {
        href: "/admin/positions",
        label: "募集情報",
        icon: Briefcase,
      },
      {
        href: "/admin/team",
        label: "チームメンバー",
        icon: Users,
      },
      {
        href: "/admin/supporters",
        label: "サポーター",
        icon: Handshake,
      },
    ],
  },
];

export function AdminSidebar({
  onLogout,
  userEmail,
  userName,
  userAvatarUrl,
  className,
  variant = "desktop",
  onNavigate,
  isCollapsed = false,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const collapsed = variant === "desktop" && isCollapsed;
  const isMobile = variant === "mobile";
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName =
    (userName && userName.trim().length > 0 ? userName : undefined) ??
    userEmail?.split("@")[0] ??
    "Google アカウント";
  const displayEmail = userEmail ?? "admin@atlas.inc";

  useEffect(() => {
    if (!showLogoutDialog) {
      return undefined;
    }

    if (typeof document === "undefined") {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showLogoutDialog]);

  useEffect(() => {
    if (!showLogoutDialog) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowLogoutDialog(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showLogoutDialog]);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
      // ログアウトが成功した場合、リダイレクトが行われるので
      // ここで状態をリセットする必要はない（window.location.hrefでリダイレクトされる）
    } catch (error) {
      console.error("Logout error:", error);
      // エラーが発生した場合でも、リダイレクトが行われる可能性がある
      // エラーが発生した場合はダイアログを閉じる
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  const desktopWidthClass = collapsed ? "md:w-20" : "md:w-72";
  const rootClassName = [
    "flex flex-col bg-white/85 text-neutral-700 backdrop-blur",
    isMobile
      ? "h-full w-full max-w-xs shadow-xl"
      : [
          "hidden h-screen md:flex md:border-r md:border-neutral-200 md:shadow-sm",
          desktopWidthClass,
        ].join(" "),
    className ?? "",
  ]
    .join(" ")
    .trim();

  const renderNavItem = (item: NavItem) => {
    const isActive =
      pathname === item.href ||
      (pathname?.startsWith(item.href) && item.href !== "/admin/hub");

    const linkClassName = [
      "group flex items-center rounded-lg text-sm font-medium transition",
      collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
      isActive
        ? "bg-neutral-900 text-white shadow-sm"
        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
    ].join(" ");

    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={linkClassName}
        onClick={() => {
          if (onNavigate) {
            onNavigate();
          }
        }}
        title={collapsed ? item.label : undefined}
      >
        <Icon
          className={[
            "h-4 w-4",
            isActive
              ? "text-white"
              : "text-neutral-500 group-hover:text-neutral-900",
          ].join(" ")}
        />
        {collapsed ? (
          <span className="sr-only">{item.label}</span>
        ) : (
          <span className="truncate">{item.label}</span>
        )}
      </Link>
    );
  };

  return (
    <aside className={rootClassName}>
      <div className="border-b border-neutral-200 px-3 py-4">
        <Link
          href="/admin/hub"
          className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-neutral-100"
          onClick={() => {
            if (onNavigate) {
              onNavigate();
            }
          }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white">
            <Command className="h-4 w-4" />
          </div>
          {collapsed ? null : (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-900">Atlas</p>
              <p className="text-xs text-neutral-500">Admin</p>
            </div>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <nav className="space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-2">
              {collapsed ? null : (
                <p className="px-1 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map(renderNavItem)}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-neutral-200 px-3 py-4">
        {collapsed ? (
          <button
            type="button"
            onClick={handleLogoutClick}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900"
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">ログアウト</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white/80 p-3 shadow-sm">
            {userAvatarUrl ? (
              <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg">
                <Image
                  src={userAvatarUrl}
                  alt={displayName}
                  width={36}
                  height={36}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white">
                <GoogleIcon className="h-5 w-5" title={displayName} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <GoogleIcon className="h-3 w-3 text-neutral-400" />
                <p className="truncate text-sm font-medium text-neutral-900">
                  {displayName}
                </p>
              </div>
              <p className="truncate text-xs text-neutral-500">
                {displayEmail}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogoutClick}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
              title="ログアウト"
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {showLogoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleLogoutCancel}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-neutral-900">
              ログアウトしますか？
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              ログアウトすると、管理画面にアクセスできなくなります。再度ログインする必要があります。
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleLogoutCancel}
                disabled={isLoggingOut}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleLogoutConfirm}
                disabled={isLoggingOut}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? "ログアウト中..." : "ログアウト"}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
