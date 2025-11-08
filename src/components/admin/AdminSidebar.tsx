"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminSidebarProps = {
  onLogout: () => Promise<void> | void;
  userEmail?: string | null;
  className?: string;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

type NavItem = {
  href: string;
  label: string;
  description?: string;
  icon: ReactNode;
};

function SidebarIcon({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-sm">
      {children}
    </span>
  );
}

function DashboardIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="15" rx="1" />
    </svg>
  );
}

function NewsIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <path d="M12 4v18" />
      <path d="M8 8h2" />
      <path d="M8 12h2" />
      <path d="M8 16h2" />
      <path d="M14 8h2" />
      <path d="M14 12h2" />
      <path d="M14 16h2" />
    </svg>
  );
}

function PositionsIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12V5h12v7" />
      <path d="M6 19h12" />
      <path d="M10 9h4" />
      <path d="m12 5 .4-2h3.2l.4 2" />
      <path d="M5 12h6v7H5z" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M8 21v-2a4 4 0 0 1 3-3.87" />
      <circle cx="12" cy="7" r="4" />
      <path d="M6 8a3 3 0 1 1-2-2" />
      <path d="M18 8a3 3 0 1 0 2-2" />
    </svg>
  );
}

function InvestorsIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 21h10" />
      <path d="M12 17v4" />
      <path d="M9 7h6" />
      <path d="M10 11h4" />
      <path d="M5 21V6L12 3l7 3v15" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      {
        href: "/admin/hub",
        label: "ダッシュボード",
        description: "更新状況と主要リンク",
        icon: (
          <SidebarIcon>
            <DashboardIcon />
          </SidebarIcon>
        ),
      },
    ],
  },
  {
    title: "コンテンツ",
    items: [
      {
        href: "/admin/news",
        label: "ニュース",
        description: "ニュース配信の管理",
        icon: (
          <SidebarIcon>
            <NewsIcon />
          </SidebarIcon>
        ),
      },
      {
        href: "/admin/positions",
        label: "募集情報",
        description: "採用ポジション管理",
        icon: (
          <SidebarIcon>
            <PositionsIcon />
          </SidebarIcon>
        ),
      },
      {
        href: "/admin/team",
        label: "チームメンバー",
        description: "メンバー紹介の編集",
        icon: (
          <SidebarIcon>
            <TeamIcon />
          </SidebarIcon>
        ),
      },
      {
        href: "/admin/investors",
        label: "投資家グループ",
        description: "支援者リスト管理",
        icon: (
          <SidebarIcon>
            <InvestorsIcon />
          </SidebarIcon>
        ),
      },
    ],
  },
];

export function AdminSidebar({
  onLogout,
  userEmail,
  className,
  variant = "desktop",
  onNavigate,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const activeMap = useMemo(() => {
    return new Map(
      navSections
        .flatMap((section) => section.items)
        .map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname?.startsWith(item.href) && item.href !== "/admin/hub");
          return [item.href, isActive] as const;
        }),
    );
  }, [pathname]);

  const isMobile = variant === "mobile";
  const rootClassName = [
    "flex flex-col border-neutral-200 bg-white",
    isMobile ? "h-full w-full" : "hidden h-screen w-72 border-r lg:flex",
    className ?? "",
  ]
    .join(" ")
    .trim();

  return (
    <aside className={rootClassName}>
      <div className="flex h-16 items-center border-b border-neutral-200 px-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500">Atlas</p>
          <p className="font-serif text-xl text-neutral-900">Admin Hub</p>
        </div>
      </div>

      <div className="border-b border-neutral-200 px-6 py-4">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21 21-4.35-4.35" />
              <circle cx="11" cy="11" r="8" />
            </svg>
          </span>
          <input
            type="search"
            placeholder="セクションを検索"
            className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-3 text-sm text-neutral-700 outline-none transition focus:border-neutral-900 focus:bg-white focus:ring-2 focus:ring-neutral-900/10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-8">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="px-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                {section.title}
              </p>
              <div className="mt-3 space-y-2">
                {section.items.map((item) => {
                  const isActive = activeMap.get(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "flex items-center gap-3 rounded-xl border border-transparent bg-white p-3 text-left transition",
                        isActive
                          ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                          : "hover:border-neutral-200 hover:bg-neutral-50",
                      ].join(" ")}
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate();
                        }
                      }}
                    >
                      <span
                        className={[
                          "flex h-12 w-12 items-center justify-center rounded-lg border text-neutral-600",
                          isActive
                            ? "border-neutral-800 bg-neutral-800/70 text-white"
                            : "border-neutral-200 bg-white",
                        ].join(" ")}
                      >
                        {item.icon}
                      </span>
                      <span className="flex-1">
                        <span
                          className={[
                            "block text-sm font-medium",
                            isActive ? "text-white" : "text-neutral-900",
                          ].join(" ")}
                        >
                          {item.label}
                        </span>
                        {item.description ? (
                          <span
                            className={[
                              "mt-1 block text-xs",
                              isActive ? "text-neutral-100/80" : "text-neutral-500",
                            ].join(" ")}
                          >
                            {item.description}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-neutral-200 px-6 py-5">
        <Link
          href="/"
          className="group flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
        >
          <span>Atlas サイトへ</span>
          <span className="text-neutral-400 group-hover:text-white">
            <ExternalIcon />
          </span>
        </Link>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-neutral-500">ログイン中</p>
              <p className="mt-1 text-sm font-medium text-neutral-900">
                {userEmail ?? "admin@atlas.inc"}
              </p>
            </div>
            <button
              onClick={() => onLogout()}
              className="inline-flex items-center gap-1 rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
            >
              <LogoutIcon />
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
