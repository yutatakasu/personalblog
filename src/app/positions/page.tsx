import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { Breadcrumb } from "@/components/Breadcrumb";
import { SmoothScrollLink } from "@/components/SmoothScrollLink";
import { getPositions } from "@/models/positions";

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

export default async function PositionsPage() {
  noStore();
  const positions = await getPositions();

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto flex w-full max-w-5xl flex-col px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "Atlas", href: "/" },
              { label: "Careers", href: "/#careers" },
              { label: "Open Positions", current: true },
            ]}
            className="mb-0"
          />
        </div>
        <section id="open-roles" className="space-y-10">
          <div className="space-y-5">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.75rem]">
              Open Positions at Atlas
            </h1>
            <p className="max-w-3xl text-sm text-black/65 sm:text-base">
              余白のあるチームに、次の視点を迎えたい。肩書きよりも、 Atlas
              にどんな温度を足してくれるかを聞かせてください。
            </p>
            <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6">
              <Link
                href="mailto:info@atlas-official.net"
                className="inline-flex items-center gap-2 text-black/50 transition hover:text-black/80"
              >
                info@atlas-official.net
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          <nav className="border-t border-black/10">
            <ul className="divide-y divide-black/10">
              {positions.map((position) => (
                <li key={position.id}>
                  <SmoothScrollLink
                    targetId={position.id}
                    className="group flex w-full items-center justify-between py-4 text-sm text-black/60 transition hover:text-black"
                  >
                    <span className="font-serif text-lg text-black/80 group-hover:text-black">
                      {position.title}
                    </span>
                    <span
                      aria-hidden
                      className="text-base text-black/30 transition group-hover:translate-x-1 group-hover:text-black/60"
                    >
                      →
                    </span>
                  </SmoothScrollLink>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        <section className="mt-16 space-y-16 sm:mt-20">
          {positions.map((position) => (
            <article
              key={position.id}
              id={position.id}
              className="scroll-mt-32 border-t border-black/10 pt-12"
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
                  href={`mailto:${position.applyEmail ?? "info@atlas-official.net"}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-black/70 underline underline-offset-4 transition hover:text-black"
                >
                  Apply / Talk
                  <span aria-hidden>→</span>
                </Link>
              </header>

              <p className="mt-6 text-xs text-black/55 sm:text-sm">
                {position.teaser}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-black/70 sm:text-base">
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
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
