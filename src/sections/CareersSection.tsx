import Link from "next/link";

import { positions } from "@/models/positions";

const highlightedPositions = positions.slice(0, 3);

export function CareersSection() {
  return (
    <section
      id="careers"
      className="snap-start snap-always flex min-h-svh items-center justify-center bg-white"
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-10 lg:py-20 xl:py-24 2xl:py-28">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12 lg:gap-16 md:items-start">
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              <p className="font-mono uppercase tracking-[0.3em] text-[0.6rem] text-black/40 sm:text-[0.65rem] sm:tracking-[0.4em] md:text-xs">
                Careers
              </p>
              <h2 className="font-serif text-2xl text-black sm:text-3xl md:text-4xl lg:text-5xl">
                Atlasに、温度のある視点を持ち込んでください。
              </h2>
              <p className="text-xs text-black/65 sm:text-sm md:text-base">
                仕組みを研ぎ澄ましながらも、人が安心して挑戦できる余白を残したい——
                そんな想いを大切にしています。
              </p>
            </div>
            <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:gap-4 sm:text-sm md:gap-6">
              <Link
                href="/positions#open-roles"
                className="inline-flex items-center gap-1.5 text-black/80 underline underline-offset-3 transition hover:text-black sm:gap-2 sm:underline-offset-4"
              >
                Open positions
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="mailto:careers@atlas.inc"
                className="inline-flex items-center gap-1.5 text-black/50 transition hover:text-black/80 sm:gap-2"
              >
                careers@atlas.inc
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
            <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.25em] text-black/45 sm:text-xs sm:tracking-[0.3em]">
              <span className="font-mono">Open roles</span>
              <Link
                href="/positions#open-roles"
                className="text-[0.6rem] lowercase tracking-[0.15em] text-black/40 transition hover:text-black/80 sm:text-[0.7rem] sm:tracking-[0.2em]"
              >
                view all
              </Link>
            </div>
            <div className="border-t border-black/10" />
            <ul className="space-y-0 divide-y divide-black/10">
              {highlightedPositions.map((role) => (
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
                    <span className="text-xs text-black/55 sm:text-sm">{role.teaser}</span>
                    <span className="text-[0.65rem] text-black/35 group-hover:text-black/60 sm:text-xs">
                      {role.location}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
