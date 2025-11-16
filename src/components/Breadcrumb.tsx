"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type BreadcrumbItem = {
  label: string;
  href?: string;
  current?: boolean;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="パンくずリスト"
      className={`flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 ${className ?? ""}`}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const content: ReactNode = item.href && !item.current ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-neutral-900 hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span
              aria-current={item.current ? "page" : undefined}
              className="text-neutral-800"
            >
              {item.label}
            </span>
          );

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-2 text-[0.55rem] sm:text-[0.65rem]"
            >
              {content}
              {!isLast ? (
                <span aria-hidden="true" className="text-neutral-400">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

