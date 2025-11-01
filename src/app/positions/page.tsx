import type { Metadata } from "next";
import Link from "next/link";

import { positions } from "@/models/positions";

export const metadata: Metadata = {
  title: "Open Positions | Atlas, Inc",
  description:
    "Atlas, Inc の採用情報。AI Systems Engineer、Product Designer、Solutions Architect などの募集ポジションを確認できます。",
};

const workStyleLabel = {
  Onsite: "Onsite",
  Hybrid: "Hybrid",
  Remote: "Remote",
} as const;

export default function PositionsPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto flex w-full max-w-5xl flex-col px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
        <section
          id="open-roles"
          className="rounded-[36px] border border-black/10 bg-white/90 p-8 shadow-[0_32px_120px_-60px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-12"
        >
          <p className="font-mono uppercase tracking-[0.35em] text-[0.65rem] text-black/45 sm:text-xs">
            Atlas Careers
          </p>
          <div className="mt-8 flex flex-col gap-6 sm:gap-8">
            <div className="space-y-4">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl">
                Open Positions at Atlas
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-black/70 sm:text-base">
                私たちは記憶レイヤーの未来を共に描く仲間を募集しています。Atlas
                のミッションに共感し、自律的に課題へ向き合える方とぜひ対話させてください。
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Link
                href={`#${positions[0]?.id ?? "ai-systems-engineer"}`}
                className="inline-flex items-center justify-center rounded-full border border-black bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-black"
              >
                Explore Roles
              </Link>
              <Link
                href="mailto:careers@atlas.inc"
                className="text-sm text-black/50 underline-offset-2 hover:text-black/80 hover:underline"
              >
                careers@atlas.inc へ連絡する
              </Link>
            </div>
          </div>
          <nav className="mt-10 grid gap-3 sm:grid-cols-2">
            {positions.map((position) => (
              <Link
                key={position.id}
                href={`#${position.id}`}
                className="group flex items-center justify-between rounded-2xl border border-black/10 bg-black/2 px-5 py-4 text-sm text-black/60 transition hover:border-black/80 hover:text-black"
              >
                <span className="font-medium text-black/80 group-hover:text-black">
                  {position.title}
                </span>
                <span className="text-[0.65rem] uppercase tracking-[0.35em] text-black/40 group-hover:text-black/70">
                  Jump
                </span>
              </Link>
            ))}
          </nav>
        </section>

        <section className="mt-16 space-y-16 sm:mt-20">
          {positions.map((position) => (
            <article
              key={position.id}
              id={position.id}
              className="scroll-mt-32 rounded-[30px] border border-black/10 bg-white/95 p-8 shadow-[0_28px_80px_-60px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-10"
            >
              <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-black/40">
                    {position.department}
                  </p>
                  <h2 className="font-serif text-2xl text-black sm:text-3xl">
                    {position.title}
                  </h2>
                  <p className="text-sm text-black/55">
                    {position.location} ・ {workStyleLabel[position.workStyle]}
                  </p>
                </div>
                <Link
                  href={`mailto:${position.applyEmail ?? "careers@atlas.inc"}`}
                  className="inline-flex items-center justify-center rounded-full border border-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:-translate-y-0.5 hover:bg-black hover:text-white"
                >
                  Apply
                </Link>
              </header>

              <p className="mt-6 text-sm leading-relaxed text-black/70 sm:text-base">
                {position.summary}
              </p>

              <div className="mt-8 grid gap-8 sm:grid-cols-2 sm:gap-10">
                <div>
                  <h3 className="font-serif text-lg text-black">
                    Responsibilities
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-black/70">
                    {position.responsibilities.map((item) => (
                      <li key={item} className="relative pl-5">
                        <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-black/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-black">
                    Requirements
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-black/70">
                    {position.requirements.map((item) => (
                      <li key={item} className="relative pl-5">
                        <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-black/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-black/10 bg-black/2 px-5 py-4 text-sm text-black/60">
                <p>
                  質問やカジュアル面談の希望があれば、
                  <Link
                    href="mailto:careers@atlas.inc"
                    className="ml-1 inline-flex items-center gap-1 font-medium text-black underline-offset-2 hover:text-black/80 hover:underline"
                  >
                    careers@atlas.inc
                  </Link>
                  までお気軽にご連絡ください。
                </p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
