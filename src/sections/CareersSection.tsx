import Link from "next/link";

import { positions } from "@/models/positions";

const featuredPositions = positions.slice(0, 3);

export function CareersSection() {
  return (
    <section
      id="careers"
      className="snap-start snap-always flex min-h-svh items-center justify-center bg-white"
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-10 sm:py-24 md:py-28">
        <div className="rounded-[32px] border border-black/10 bg-white/80 p-8 shadow-[0_32px_120px_-60px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-12">
          <p className="font-mono uppercase tracking-[0.4em] text-[0.65rem] text-black/40 sm:text-xs">
            Careers
          </p>
          <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-start">
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                <h2 className="font-serif text-3xl text-black sm:text-4xl md:text-5xl">
                  Join us. Atlasと共に記憶レイヤーの未来をつくる。
                </h2>
                <p className="text-sm leading-relaxed text-black/70 sm:text-base">
                  Atlasでは、人とエージェントが協働する社会を前提にプロダクトを設計しています。
                  ミッションとバリューに共鳴し、自律的に挑戦できる仲間を歓迎します。
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Link
                  href="/positions#open-roles"
                  className="inline-flex items-center justify-center rounded-full border border-black bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-black"
                >
                  Open Positions
                </Link>
                <Link
                  href="mailto:careers@atlas.inc"
                  className="text-sm text-black/50 underline-offset-2 hover:text-black/80 hover:underline"
                >
                  careers@atlas.inc へ直接連絡する
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-5 rounded-3xl border border-black/10 bg-black/2 p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.35em] text-black/45">
                  Open Roles
                </p>
                <Link
                  href="/positions#open-roles"
                  className="text-xs font-medium text-black/60 underline-offset-4 hover:text-black"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {featuredPositions.map((role) => (
                  <Link
                    key={role.id}
                    href={`/positions#${role.id}`}
                    className="group block rounded-2xl border border-black/10 bg-white px-5 py-5 transition duration-200 hover:-translate-y-1 hover:border-black/80 hover:shadow-[0_20px_45px_-30px_rgba(0,0,0,0.55)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-lg text-black sm:text-xl">
                          {role.title}
                        </h3>
                        <p className="mt-1 text-sm text-black/60">
                          {role.location} ・ {role.department}
                        </p>
                      </div>
                      <span className="mt-1 inline-flex items-center rounded-full border border-black/20 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-black/50 transition group-hover:border-black group-hover:bg-black group-hover:text-white">
                        詳細
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-black/65">
                      {role.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
