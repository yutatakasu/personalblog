import Link from "next/link";

import type { Position } from "@/models/positions";

type CareersSectionProps = {
  positions: Position[];
};

const SECTION_LABEL_POSITION =
  "pointer-events-none absolute left-6 sm:left-8 md:left-10 lg:left-12 top-16 sm:top-24 md:top-28 lg:top-32";
const SECTION_CONTENT_OFFSET =
  "pt-32 sm:pt-40 md:pt-44 lg:pt-48";
const VISIBLE_POSITIONS_COUNT = 2;

export function CareersSection({ positions }: CareersSectionProps) {
  const visiblePositions = positions.slice(0, VISIBLE_POSITIONS_COUNT);
  const hasMorePositions = positions.length > VISIBLE_POSITIONS_COUNT;
  return (
    <section
      id="careers"
      className="relative snap-start snap-always flex min-h-screen min-h-dvh justify-center bg-[#f8f7f4]"
    >
      <p
        className={`${SECTION_LABEL_POSITION} font-mono uppercase tracking-[0.25em] text-[0.6rem] text-black/40 sm:text-[0.65rem] sm:tracking-[0.3em] md:text-xs lg:text-sm`}
      >
        Careers
      </p>
      <div
        className={`flex w-full justify-center px-4 pb-8 sm:px-6 sm:pb-12 md:px-8 md:pb-16 lg:px-10 lg:pb-20 xl:pb-28 2xl:pb-32 ${SECTION_CONTENT_OFFSET}`}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col justify-center gap-10 md:gap-12 lg:gap-16">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12 lg:gap-16 md:items-start">
            <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
              <h2 className="font-serif text-xl leading-snug text-black sm:text-2xl md:text-3xl lg:text-[3.25rem] lg:leading-[1.1] xl:text-[3.75rem]">
                Atlasに、温度のある視点を持ち込んでください。
              </h2>
              <p className="text-xs leading-relaxed text-black/65 sm:text-sm md:text-base">
                仕組みを研ぎ澄ましながらも、人が安心して挑戦できる余白を残したい——
                そんな想いを大切にしています。
              </p>
              <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:gap-4 sm:text-sm md:gap-6">
                <Link
                  href="/positions#open-roles"
                  className="inline-flex items-center gap-1.5 text-black/80 underline underline-offset-3 transition hover:text-black sm:gap-2 sm:underline-offset-4"
                >
                  Open positions
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="mailto:info@atlas-official.net"
                  className="inline-flex items-center gap-1.5 text-black/50 transition hover:text-black/80 sm:gap-2"
                >
                  info@atlas-official.net
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
              <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.25em] text-black/45 sm:text-xs sm:tracking-[0.3em]">
                <span className="font-mono">Open positions</span>
              </div>
              <div className="border-t border-black/10" />
              <ul className="space-y-0 divide-y divide-black/10">
                {visiblePositions.map((role) => (
                  <li key={role.id} className="py-3 sm:py-4 md:py-5">
                    <Link
                      href={`/positions#${role.id}`}
                      className="group flex flex-col gap-0.5 text-black/70 transition hover:text-black sm:gap-1"
                    >
                      <span className="font-serif text-base text-black group-hover:translate-x-0.5 group-hover:text-black sm:text-lg">
                        {role.title}
                      </span>
                      <span className="text-[0.65rem] uppercase tracking-[0.3em] text-black/40 sm:text-xs sm:tracking-[0.35em]">
                        {role.department}
                      </span>
                      <span className="text-xs text-black/55 sm:text-sm">
                        {role.teaser}
                      </span>
                      <span className="text-[0.65rem] text-black/35 group-hover:text-black/60 sm:text-xs">
                        {role.location}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {hasMorePositions ? (
                <Link
                  href="/positions#open-roles"
                  className="group mt-3 inline-flex items-center justify-between rounded-full border border-black/15 px-4 py-2 text-[0.65rem] uppercase tracking-[0.2em] text-black/50 transition hover:border-black/30 hover:text-black/80 sm:mt-4 sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-[0.25em]"
                >
                  <span className="font-mono">View all positions</span>
                  <span
                    aria-hidden
                    className="text-[0.7rem] transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
