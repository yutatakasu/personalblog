"use client";

import Link from "next/link";

import type { Position } from "@/models/positions";
import { useLocale } from "@/providers/LanguageProvider";

type CareersSectionProps = {
  positions: Position[];
};

const SECTION_CONTENT_OFFSET = "pt-24 sm:pt-32 md:pt-36 lg:pt-40";
const SECTION_HEADING_CLASS =
  "font-serif text-[1.1rem] leading-tight sm:text-[1.6rem] md:text-[1.95rem] lg:text-[2.4rem] lg:leading-[1.1]";
const VISIBLE_POSITIONS_COUNT = 3;

const translations = {
  en: {
    heading: "Join Us.",
    description:
      "Everyone carries a unique history and a one-of-a-kind memory of the world. A collection of that under a bold vision shall provide a better future for all.",
    openPositions: "Open positions",
    openRoles: "Open roles",
    closed: "Closed",
    apply: "Apply +",
    noPositions: "There are currently no open positions.",
    viewAll: "View all positions",
  },
  ja: {
    heading: "Join Us.",
    description:
      "一人ひとりの経験と記憶を持ち寄り、ひとつの大胆なビジョンのもとで未来を作っていく。この道のりを共にする仲間を探しています。",
    openPositions: "Open positions",
    openRoles: "Open roles",
    closed: "Closed",
    apply: "Apply +",
    noPositions: "現在募集中のポジションはありません。",
    viewAll: "すべての募集を見る",
  },
} as const;

export function CareersSection({ positions }: CareersSectionProps) {
  const { locale } = useLocale();
  const t = translations[locale];
  const visiblePositions = positions.slice(0, VISIBLE_POSITIONS_COUNT);
  const hasMorePositions = positions.length > VISIBLE_POSITIONS_COUNT;
  const hasAnyPositions = positions.length > 0;

  return (
    <section
      id="careers"
      className="relative snap-start snap-always flex min-h-screen min-h-dvh justify-center bg-background"
    >
      <div
        className={`flex w-full justify-center px-6 pb-20 sm:px-6 sm:pb-24 md:px-8 md:pb-28 lg:px-10 lg:pb-32 xl:pb-36 2xl:pb-40 ${SECTION_CONTENT_OFFSET}`}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col justify-center gap-14 md:gap-16 lg:gap-20">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center lg:gap-16">
            <div className="flex flex-col gap-6 sm:gap-7 md:gap-8">
              <h2 className={`${SECTION_HEADING_CLASS} text-black`}>
                {t.heading}
              </h2>
              <p className="max-w-xl text-xs leading-relaxed text-black/65 sm:text-sm md:text-base">
                {t.description}
              </p>
              <div className="flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:gap-4 sm:text-sm md:gap-5">
                <Link
                  href="/positions#open-roles"
                  className="inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-black/80 transition hover:border-black/40 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {t.openPositions}
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="mailto:info@atlas-official.net"
                  className="inline-flex items-center gap-1.5 text-black/50 transition hover:text-black sm:gap-2"
                >
                  info@atlas-official.net
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <div className="flex items-baseline justify-between text-[0.55rem] uppercase tracking-[0.35em] text-black/40 sm:text-[0.6rem] sm:tracking-[0.4em] md:text-[0.65rem]">
                  <span className="font-mono">{t.openRoles}</span>
                  {hasAnyPositions ? (
                    <span className="font-mono text-black/30">
                      {positions.length.toString().padStart(2, "0")}
                    </span>
                  ) : (
                    <span className="font-mono text-black/30">{t.closed}</span>
                  )}
                </div>
                <div className="mt-3 h-px bg-black/10" />
                <div className="mt-2">
                  {hasAnyPositions ? (
                    <ul className="divide-y divide-black/10">
                      {visiblePositions.map((role) => (
                        <li key={role.id}>
                          <Link
                            href={`/positions#${role.id}`}
                            className="group grid grid-cols-[minmax(0,1fr)_auto_auto] items-baseline gap-4 py-4 text-sm text-black/70 transition hover:text-black sm:gap-6 sm:py-5 sm:text-base"
                          >
                            <span className="font-serif text-lg leading-tight text-black/85 group-hover:text-black">
                              {role.title}
                            </span>
                            <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-black/35 sm:text-[0.65rem]">
                              {role.location}
                            </span>
                            <span className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-black/40 transition group-hover:text-black sm:text-[0.65rem]">
                              {t.apply}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="py-6 text-sm text-black/45 sm:text-base">
                      {t.noPositions}
                    </p>
                  )}
                </div>
              </div>
              {hasMorePositions ? (
                <div>
                  <Link
                    href="/positions"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-black/55 transition hover:text-black sm:text-sm sm:tracking-[0.35em]"
                  >
                    {t.viewAll}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
