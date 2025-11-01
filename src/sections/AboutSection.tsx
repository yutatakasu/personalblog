import Image from "next/image";
import type { CSSProperties } from "react";
import {
  investorGroups,
  newsItems,
  type TeamMember,
  teamMembers,
} from "@/models/about";

type TeamCardProps = {
  member: TeamMember;
  className?: string;
  style?: CSSProperties;
};

function TeamCard({ member, className, style }: TeamCardProps) {
  return (
    <article
      className={`group flex w-full max-w-[180px] flex-col items-center gap-3 text-center sm:max-w-[160px] ${
        className ?? ""
      }`}
      style={style}
    >
      <div className="relative h-20 w-20 overflow-hidden rounded-[18px] border border-neutral-200 bg-neutral-100 sm:h-24 sm:w-24">
        <Image
          src={member.imageSrc}
          alt={member.imageAlt ?? `${member.name} portrait`}
          fill
          sizes="96px"
          className="h-full w-full object-cover"
        />
      </div>
      <p className="mt-1 font-serif text-sm text-neutral-900 sm:text-base">
        {member.name}
      </p>
      <p className="font-mono text-[0.5rem] uppercase tracking-[0.3em] text-neutral-500 sm:text-[0.55rem]">
        {member.title}
      </p>
      <p className="mt-3 max-w-[220px] text-xs leading-relaxed text-neutral-500 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
        {member.focus}
      </p>
    </article>
  );
}

export function AboutSection() {
  return (
    <>
      <section
        id="about"
        className="relative snap-start snap-always flex min-h-svh items-start justify-center text-white md:items-center"
      >
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/members_far_from.jpg"
            alt="Atlas team"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            aria-hidden
          />
        </div>
        <div className="relative z-10 w-full px-6 py-16 sm:px-8 sm:py-20 md:py-28 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-8 font-mono uppercase tracking-[0.3em] text-[0.65rem] text-white/60 sm:mb-10 sm:text-xs md:mb-14 md:text-sm">
              About
            </p>
            <h2 className="font-serif text-2xl leading-snug sm:text-3xl md:text-[3rem] md:leading-[1.1]">
              <span className="block">心躍る、ワクワクするAIを作ろう</span>
              <span className="mt-2 block sm:whitespace-nowrap">
                Atlasは Memory as a Service の会社です
              </span>
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-white/75 md:mt-10 md:text-base">
              分散した知識、複雑化したプロセス、そして変化の激しい市場環境。Atlas
              は、これらの課題に対して「観測・予測・実行」をつなぐワークフローを再設計し、チーム全体の意思決定を加速させます。
            </p>
          </div>
        </div>
      </section>

      <section
        id="about-team"
        className="snap-start snap-always flex min-h-svh items-start justify-center bg-white text-neutral-900 md:items-center"
      >
        <div className="w-full px-6 py-16 sm:px-8 sm:py-20 md:px-10 md:py-28 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <p className="mb-8 font-mono uppercase tracking-[0.3em] text-[0.65rem] text-neutral-400 sm:mb-10 sm:text-xs md:mb-14 md:text-sm">
              Team
            </p>
            <div className="mt-8 grid w-full place-items-center gap-8 md:hidden">
              {teamMembers.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>

            <div className="mt-12 hidden w-full md:grid lg:hidden md:grid-cols-2 md:gap-x-12 md:gap-y-12">
              {teamMembers.map((member) => (
                <TeamCard
                  key={member.id}
                  member={member}
                  className="!max-w-none"
                />
              ))}
            </div>

            <div className="mt-14 hidden w-full lg:grid mx-auto max-w-7xl grid-cols-5 grid-rows-3 gap-x-12 gap-y-14 justify-items-center">
              {teamMembers.map((member) => (
                <TeamCard
                  key={member.id}
                  member={member}
                  style={{
                    gridColumnStart: member.position.column,
                    gridRowStart: member.position.row,
                    marginTop: member.position.offsetY,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="about-backed"
        className="snap-start snap-always flex min-h-svh items-start justify-center text-neutral-900 md:items-center"
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20 md:px-10 md:py-28 lg:py-32">
          <p className="mb-8 font-mono uppercase tracking-[0.3em] text-[0.65rem] text-neutral-400 sm:mb-10 sm:text-xs md:mb-14 md:text-sm">
            We Are Backed By
          </p>
          <h2 className="font-serif text-2xl leading-snug text-neutral-900 sm:text-3xl md:text-5xl md:leading-[1.1]">
            信頼できるパートナーとともに、Atlas
            の記憶レイヤーは産業全体へと浸透します。
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3 xl:grid-cols-4">
            {investorGroups.map((group) => (
              <div
                key={group.category}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6"
              >
                <h3 className="font-serif text-lg text-neutral-900">
                  {group.category}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-neutral-600">
                  {group.supporters.map((supporter) => (
                    <li key={supporter} className="leading-relaxed">
                      {supporter}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="about-news"
        className="snap-start snap-always flex min-h-svh items-start justify-center text-neutral-900 md:items-center"
      >
        <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-8 sm:py-20 md:px-10 md:py-28 lg:py-32">
          <p className="mb-8 font-mono uppercase tracking-[0.3em] text-[0.65rem] text-neutral-400 sm:mb-10 sm:text-xs md:mb-14 md:text-sm">
            Current News
          </p>
          <h2 className="font-serif text-2xl leading-snug text-neutral-900 sm:text-3xl md:text-5xl md:leading-[1.1]">
            プロダクトの進化とパートナーシップの最新情報をお届けします。
          </h2>
          <div className="mt-8 space-y-8 md:mt-12">
            {newsItems.map((news) => (
              <article
                key={news.headline}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
                    {news.date}
                  </span>
                  <h3 className="font-serif text-2xl text-neutral-900 md:max-w-xl">
                    {news.headline}
                  </h3>
                </div>
                <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
                  {news.summary}
                </p>
                <span className="mt-5 inline-block font-mono text-[0.7rem] uppercase tracking-[0.4em] text-neutral-400">
                  {news.tag}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
