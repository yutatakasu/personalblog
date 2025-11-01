"use client";

"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useState } from "react";

import { investorGroups, type TeamMember, teamMembers } from "@/models/about";
import { type NewsItem, newsItems } from "@/models/news";

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

const MOBILE_TEAM_VISIBLE_COUNT = 5;
const NEWS_PREVIEW_COUNT = 5;

type NewsPreviewCardProps = {
  item: NewsItem;
};

function NewsPreviewCard({ item }: NewsPreviewCardProps) {
  return (
    <Link
      href={item.link}
      prefetch={false}
      className="group flex items-center gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-3 transition hover:border-neutral-300 hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50"
    >
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200">
        <Image
          src={item.thumbnailSrc}
          alt={item.thumbnailAlt}
          fill
          sizes="96px"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-neutral-400 sm:text-xs">
          {item.date}
        </span>
        <span className="mt-1 font-serif text-base leading-snug text-neutral-900 sm:text-lg">
          {item.title}
        </span>
      </div>
    </Link>
  );
}

export function AboutSection() {
  const [isTeamExpanded, setIsTeamExpanded] = useState(false);
  const mobileVisibleMembers = isTeamExpanded
    ? teamMembers
    : teamMembers.slice(0, MOBILE_TEAM_VISIBLE_COUNT);
  const hasAdditionalMembers = teamMembers.length > MOBILE_TEAM_VISIBLE_COUNT;
  const previewNewsItems = newsItems.slice(0, NEWS_PREVIEW_COUNT);
  const hasAdditionalNews = newsItems.length > NEWS_PREVIEW_COUNT;

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
              {mobileVisibleMembers.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
              {hasAdditionalMembers ? (
                <button
                  type="button"
                  onClick={() => setIsTeamExpanded((previous) => !previous)}
                  aria-expanded={isTeamExpanded}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-xl text-neutral-400 transition hover:border-neutral-300 hover:text-neutral-600 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <span aria-hidden>{isTeamExpanded ? "X" : "..."}</span>
                  <span className="sr-only">
                    {isTeamExpanded
                      ? "チームメンバーを折りたたむ"
                      : "すべてのチームメンバーを表示"}
                  </span>
                </button>
              ) : null}
            </div>

            <div className="mt-12 hidden w-full md:grid lg:hidden md:grid-cols-2 md:gap-x-12 md:gap-y-12">
              {teamMembers.map((member) => (
                <TeamCard
                  key={member.id}
                  member={member}
                  className="max-w-none!"
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
          <div className="mt-8 space-y-4 md:mt-12">
            {previewNewsItems.map((news) => (
              <NewsPreviewCard key={news.id} item={news} />
            ))}
          </div>
          {hasAdditionalNews ? (
            <div className="mt-6">
              <Link
                href="/news"
                prefetch={false}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                ニュース一覧へ
                <span aria-hidden>&gt;</span>
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
