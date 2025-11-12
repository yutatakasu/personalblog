import Link from "next/link";

import type { Position } from "@/models/positions";

type CareersSectionProps = {
  positions: Position[];
};

const SECTION_LABEL_POSITION =
  "pointer-events-none absolute left-32 sm:left-44 md:left-52 lg:left-60 top-16 sm:top-24 md:top-28 lg:top-32";
const SECTION_LABEL_SHARED_CLASSES =
  "font-mono uppercase tracking-[0.25em] text-[0.6rem] sm:text-[0.65rem] sm:tracking-[0.3em] md:text-xs lg:text-base xl:text-lg";
const SECTION_CONTENT_OFFSET = "pt-32 sm:pt-40 md:pt-44 lg:pt-48";
const VISIBLE_POSITIONS_COUNT = 3;

export function CareersSection({ positions }: CareersSectionProps) {
  const visiblePositions = positions.slice(0, VISIBLE_POSITIONS_COUNT);
  const hasMorePositions = positions.length > VISIBLE_POSITIONS_COUNT;
  const hasAnyPositions = positions.length > 0;

  return (
    <section
      id="careers"
      className="relative snap-start snap-always flex min-h-screen min-h-dvh justify-center bg-background"
    >
      <p
        className={`${SECTION_LABEL_POSITION} ${SECTION_LABEL_SHARED_CLASSES} text-black/40`}
      >
        Careers
      </p>
      <div
        className={`flex w-full justify-center px-4 pb-12 sm:px-6 sm:pb-16 md:px-8 md:pb-20 lg:px-10 lg:pb-24 xl:pb-28 2xl:pb-32 ${SECTION_CONTENT_OFFSET}`}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col justify-center gap-14 md:gap-16 lg:gap-20">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center lg:gap-16">
            <div className="flex flex-col gap-6 sm:gap-7 md:gap-8">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-black/35 sm:text-[0.65rem] md:text-xs">
                Careers at Atlas
              </span>
              <h2 className="font-serif text-[1.75rem] leading-tight text-black sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] lg:leading-[1.1]">
                Atlasに、温度のある視点を持ち込んでください。
              </h2>
              <p className="max-w-xl text-xs leading-relaxed text-black/65 sm:text-sm md:text-base">
                仕組みを研ぎ澄ましながらも、人が安心して挑戦できる余白を残したい——
                そんな想いを大切にしています。
              </p>
              <div className="flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:gap-4 sm:text-sm md:gap-5">
                <Link
                  href="/positions#open-roles"
                  className="inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-black/80 transition hover:border-black/40 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Open positions
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
            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] backdrop-blur-sm sm:p-7 md:p-8">
                <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.35em] text-black/35 sm:text-[0.65rem] sm:tracking-[0.4em] md:text-xs">
                  <span className="font-mono">Open roles</span>
                  {hasAnyPositions ? (
                    <span className="font-mono text-[0.6rem] tracking-[0.35em] text-black/25 sm:text-[0.65rem] md:text-[0.7rem]">
                      {positions.length.toString().padStart(2, "0")}
                    </span>
                  ) : null}
                </div>
                <div className="mt-5 divide-y divide-black/10">
                  {hasAnyPositions ? (
                    visiblePositions.map((role) => (
                      <Link
                        key={role.id}
                        href={`/positions#${role.id}`}
                        className="group flex items-center justify-between gap-4 py-4 text-sm text-black/65 transition hover:text-black sm:text-base"
                      >
                        <span className="font-serif text-lg text-black/80 group-hover:text-black">
                          {role.title}
                        </span>
                        <span
                          aria-hidden
                          className="font-mono text-sm text-black/30 transition group-hover:translate-x-1 group-hover:text-black/60"
                        >
                          →
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p className="py-4 text-sm text-black/45 sm:text-base">
                      現在募集中のポジションはありません。
                    </p>
                  )}
                </div>
              </div>
              {hasMorePositions ? (
                <div>
                  <Link
                    href="/positions"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-black/45 transition hover:text-black sm:text-sm sm:tracking-[0.35em]"
                  >
                    すべての募集を見る
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