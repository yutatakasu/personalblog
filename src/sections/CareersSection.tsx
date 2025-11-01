import Link from "next/link";

import { positions } from "@/models/positions";

const highlightedPositions = positions.slice(0, 3);

export function CareersSection() {
  return (
    <section
      id="careers"
      className="snap-start snap-always flex min-h-svh items-center justify-center bg-white"
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-10 sm:py-24 md:py-28">
        <div className="grid gap-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
          <div className="flex flex-col gap-8">
            <div className="space-y-5">
              <p className="font-mono uppercase tracking-[0.4em] text-[0.65rem] text-black/40 sm:text-xs">
                Careers
              </p>
              <h2 className="font-serif text-3xl text-black sm:text-4xl md:text-5xl">
                Atlasに、温度のある視点を持ち込んでください。
              </h2>
              <p className="text-sm text-black/65 sm:text-base">
                仕組みを研ぎ澄ましながらも、人が安心して挑戦できる余白を残したい——
                そんな想いを大切にしています。
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6">
              <Link
                href="/positions#open-roles"
                className="inline-flex items-center gap-2 text-black/80 underline underline-offset-4 transition hover:text-black"
              >
                Open positions
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="mailto:careers@atlas.inc"
                className="inline-flex items-center gap-2 text-black/50 transition hover:text-black/80"
              >
                careers@atlas.inc
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-black/45">
              <span className="font-mono">Open roles</span>
              <Link
                href="/positions#open-roles"
                className="text-[0.7rem] lowercase tracking-[0.2em] text-black/40 transition hover:text-black/80"
              >
                view all
              </Link>
            </div>
            <div className="border-t border-black/10" />
            <ul className="space-y-0 divide-y divide-black/10">
              {highlightedPositions.map((role) => (
                <li key={role.id} className="py-5">
                  <Link
                    href={`/positions#${role.id}`}
                    className="group flex flex-col gap-1 text-black/70 transition hover:text-black"
                  >
                    <span className="font-serif text-lg text-black group-hover:translate-x-0.5 group-hover:text-black">
                      {role.title}
                    </span>
                    <span className="text-xs uppercase tracking-[0.35em] text-black/40">
                      {role.department}
                    </span>
                    <span className="text-sm text-black/55">{role.teaser}</span>
                    <span className="text-xs text-black/35 group-hover:text-black/60">
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
