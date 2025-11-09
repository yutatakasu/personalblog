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
import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminSidebarProps = {
  onLogout: () => Promise<void> | void;
  userEmail?: string | null;
  className?: string;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
  isCollapsed?: boolean;
};

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
  className,
  variant = "desktop",
  onNavigate,
  isCollapsed = false,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const collapsed = variant === "desktop" && isCollapsed;
  const isMobile = variant === "mobile";

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
            onClick={() => {
              void onLogout();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">ログアウト</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white/80 p-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-sm font-semibold text-white">
              {userEmail?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-900">
                Admin
              </p>
              <p className="truncate text-xs text-neutral-500">
                {userEmail ?? "admin@atlas.inc"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                void onLogout();
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900"
              title="ログアウト"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
