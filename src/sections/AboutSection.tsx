"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import type { InvestorGroup, Supporter } from "@/models/backed_by";
import type { NewsItem } from "@/models/news";
import type { TeamMember } from "@/models/team";

type TeamCardProps = {
  member: TeamMember;
  className?: string;
  style?: CSSProperties;
};

function useSupportsHover() {
  const [supportsHover, setSupportsHover] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(hover: hover)");
    const handleChange = (event: MediaQueryListEvent) => {
      setSupportsHover(event.matches);
    };

    setSupportsHover(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return supportsHover;
}

function TeamCard({ member, className, style }: TeamCardProps) {
  const supportsHover = useSupportsHover();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const canToggleDetail = Boolean(member.focus);

  useEffect(() => {
    if (supportsHover && isDetailOpen) {
      setIsDetailOpen(false);
    }
  }, [supportsHover, isDetailOpen]);

  const handleToggleDetail = () => {
    if (supportsHover || !canToggleDetail) {
      return;
    }
    setIsDetailOpen((previous) => !previous);
  };

  return (
    <article
      className={`group flex w-full max-w-[120px] flex-col items-center gap-1.5 text-center sm:max-w-[140px] sm:gap-2 md:max-w-[160px] md:gap-3 lg:max-w-[180px] ${!supportsHover && canToggleDetail ? "cursor-pointer touch-manipulation" : ""} ${
        className ?? ""
      }`}
      style={style}
      role={!supportsHover && canToggleDetail ? "button" : undefined}
      tabIndex={!supportsHover && canToggleDetail ? 0 : undefined}
      aria-expanded={!supportsHover && canToggleDetail ? isDetailOpen : undefined}
      onClick={handleToggleDetail}
      onKeyDown={(event) => {
        if (
          supportsHover ||
          !canToggleDetail ||
          (event.key !== "Enter" && event.key !== " ")
        ) {
          return;
        }
        event.preventDefault();
        setIsDetailOpen((previous) => !previous);
      }}
    >
      <div className="relative h-14 w-14 overflow-hidden rounded-[14px] border border-neutral-200 bg-neutral-100 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24">
        <Image
          src={member.imageSrc}
          alt={member.imageAlt ?? `${member.name} portrait`}
          fill
          sizes="(min-width: 1024px) 96px, (min-width: 768px) 80px, (min-width: 640px) 64px, 56px"
          className="h-full w-full object-cover"
        />
      </div>
      <p className="mt-0.5 font-serif text-xs text-neutral-900 sm:text-sm md:text-base">
        {member.name}
      </p>
      <p className="font-mono text-[0.45rem] uppercase tracking-[0.25em] text-neutral-500 sm:text-[0.5rem] sm:tracking-[0.3em]">
        {member.title}
      </p>
      <p
        className={`mt-1.5 max-w-[200px] text-[0.65rem] leading-relaxed text-neutral-500 transition-opacity duration-200 ease-out sm:mt-2 sm:max-w-[220px] sm:text-xs ${
          supportsHover
            ? "opacity-0 group-hover:opacity-100"
            : canToggleDetail
              ? isDetailOpen
                ? "opacity-100"
                : "opacity-0"
              : "opacity-100"
        }`}
      >
        {member.focus}
      </p>
    </article>
  );
}

type CategorizedSupporter = Supporter & {
  category: string;
};

type SupporterCardProps = {
  supporter: CategorizedSupporter;
  className?: string;
};

function SupporterCard({ supporter, className }: SupporterCardProps) {
  const supportsHover = useSupportsHover();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const hasDetail = Boolean(supporter.focus);
  const imageSrc = supporter.imageSrc ?? "/favicon.svg";

  useEffect(() => {
    if (supportsHover && isDetailOpen) {
      setIsDetailOpen(false);
    }
  }, [supportsHover, isDetailOpen]);

  const handleToggleDetail = () => {
    if (supportsHover || !hasDetail) {
      return;
    }
    setIsDetailOpen((previous) => !previous);
  };

  return (
    <article
      className={`group flex w-full max-w-[120px] flex-col items-center gap-1.5 text-center sm:max-w-[140px] sm:gap-2 md:max-w-[160px] md:gap-3 lg:max-w-[180px] ${!supportsHover && hasDetail ? "cursor-pointer touch-manipulation" : ""} ${
        className ?? ""
      }`}
      role={!supportsHover && hasDetail ? "button" : undefined}
      tabIndex={!supportsHover && hasDetail ? 0 : undefined}
      aria-expanded={!supportsHover && hasDetail ? isDetailOpen : undefined}
      onClick={handleToggleDetail}
      onKeyDown={(event) => {
        if (
          supportsHover ||
          !hasDetail ||
          (event.key !== "Enter" && event.key !== " ")
        ) {
          return;
        }
        event.preventDefault();
        setIsDetailOpen((previous) => !previous);
      }}
    >
      <div className="relative h-14 w-14 overflow-hidden rounded-[14px] border border-neutral-200 bg-neutral-100 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24">
        <Image
          src={imageSrc}
          alt={`${supporter.name} logo`}
          fill
          sizes="(min-width: 1024px) 96px, (min-width: 768px) 80px, (min-width: 640px) 64px, 56px"
          className="h-full w-full object-cover"
        />
      </div>
      <p className="mt-0.5 font-serif text-xs text-neutral-900 sm:text-sm md:text-base">
        {supporter.name}
      </p>
      {supporter.title ? (
        <p className="font-mono text-[0.45rem] uppercase tracking-[0.25em] text-neutral-500 sm:text-[0.5rem] sm:tracking-[0.3em]">
          {supporter.title}
        </p>
      ) : null}
      {supporter.focus ? (
        <p
          className={`mt-1.5 max-w-[200px] text-[0.65rem] leading-relaxed text-neutral-500 transition-opacity duration-200 ease-out sm:mt-2 sm:max-w-[220px] sm:text-xs ${
            supportsHover
              ? "opacity-0 group-hover:opacity-100"
              : isDetailOpen
                ? "opacity-100"
                : "opacity-0"
          }`}
        >
          <span className="block font-mono text-[0.45rem] uppercase tracking-[0.25em] text-neutral-400 sm:text-[0.5rem] sm:tracking-[0.3em]">
            {supporter.category}
          </span>
          {supporter.focus}
        </p>
      ) : null}
    </article>
  );
}

const MOBILE_TEAM_VISIBLE_COUNT = 6;
const NEWS_PREVIEW_COUNT = 5;

type AboutSectionProps = {
  newsItems: NewsItem[];
  teamMembers: TeamMember[];
  investorGroups: InvestorGroup[];
};

type NewsPreviewCardProps = {
  item: NewsItem;
};

function NewsPreviewCard({ item }: NewsPreviewCardProps) {
  return (
    <Link
      href={item.link}
      prefetch={false}
      className="group flex items-center gap-3 rounded-xl border border-neutral-200 bg-[#f8f7f4] p-2.5 transition hover:border-neutral-300 hover:bg-[#f5f4f1] focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f7f4] sm:gap-4 sm:rounded-2xl sm:p-3"
    >
      <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200 sm:h-16 sm:w-24 sm:rounded-xl">
        <Image
          src={item.thumbnailSrc}
          alt={item.thumbnailAlt}
          fill
          sizes="(min-width: 640px) 96px, 80px"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-neutral-400 sm:text-[0.6rem] sm:tracking-[0.35em] md:text-xs">
          {item.date}
        </span>
        <span className="mt-0.5 font-serif text-sm leading-snug text-neutral-900 sm:mt-1 sm:text-base md:text-lg">
          {item.title}
        </span>
      </div>
    </Link>
  );
}

export function AboutSection({
  newsItems,
  teamMembers,
  investorGroups,
}: AboutSectionProps) {
  const [isTeamExpanded, setIsTeamExpanded] = useState(false);
  const mobileVisibleMembers = isTeamExpanded
    ? teamMembers
    : teamMembers.slice(0, MOBILE_TEAM_VISIBLE_COUNT);
  const hasAdditionalMembers = teamMembers.length > MOBILE_TEAM_VISIBLE_COUNT;
  const previewNewsItems = newsItems.slice(0, NEWS_PREVIEW_COUNT);
  const hasAdditionalNews = newsItems.length > NEWS_PREVIEW_COUNT;
  const categorizedSupporters: CategorizedSupporter[] = investorGroups.flatMap(
    (group) =>
      group.supporters.map((supporter) => ({
        ...supporter,
        category: group.category,
      })),
  );

  return (
    <>
      <section
        id="about"
        className="relative snap-start snap-always flex min-h-screen justify-center text-white"
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
            className="absolute inset-0 bg-black/40"
            aria-hidden
          />
        </div>
        <div className="relative z-10 flex w-full justify-center px-4 pb-8 pt-24 sm:px-6 sm:pb-12 sm:pt-28 md:px-8 md:pb-16 md:pt-32 lg:px-10 lg:pb-20 lg:pt-36 xl:pb-28 xl:pt-40 2xl:pb-32 2xl:pt-44">
          <div className="grid w-full max-w-4xl grid-rows-[auto_1fr] gap-6 text-left sm:gap-8 md:gap-10">
            <p className="shrink-0 font-mono uppercase tracking-[0.25em] text-[0.6rem] text-white/60 sm:text-[0.65rem] sm:tracking-[0.3em] md:text-xs lg:text-sm">
              About
            </p>
            <div className="flex flex-1 flex-col justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              <h2 className="font-serif text-xl leading-snug sm:text-2xl md:text-3xl lg:text-[3rem] lg:leading-[1.1]">
                <span className="block">心躍る、ワクワクするAIを作ろう</span>
                <span className="mt-1 block sm:mt-2 sm:whitespace-nowrap">
                  Atlasは Memory as a Service の会社です
                </span>
              </h2>
              <p className="text-xs leading-relaxed text-white/75 sm:text-sm md:text-base">
                分散した知識、複雑化したプロセス、そして変化の激しい市場環境。Atlas
                は、これらの課題に対して「観測・予測・実行」をつなぐワークフローを再設計し、チーム全体の意思決定を加速させます。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about-team"
        className="snap-start snap-always flex min-h-screen justify-center bg-[#f8f7f4] text-neutral-900"
      >
        <div className="w-full px-4 pb-8 pt-24 sm:px-6 sm:pb-12 sm:pt-28 md:px-8 md:pb-16 md:pt-32 lg:px-10 lg:pb-20 lg:pt-36 xl:pb-28 xl:pt-40 2xl:pb-32 2xl:pt-44">
          <div className="mx-auto grid w-full max-w-6xl grid-rows-[auto_1fr] gap-6 sm:gap-8 md:gap-10">
            <p className="shrink-0 font-mono uppercase tracking-[0.25em] text-[0.6rem] text-neutral-400 sm:text-[0.65rem] sm:tracking-[0.3em] md:text-xs lg:text-sm">
              Team
            </p>
            <div className="flex flex-1 flex-col justify-center gap-6 sm:gap-8 md:gap-10">
              <div className="grid w-full grid-cols-2 justify-items-center gap-x-3 gap-y-4 sm:gap-x-4 sm:gap-y-5 md:hidden">
                {mobileVisibleMembers.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
                {hasAdditionalMembers ? (
                  <button
                    type="button"
                    onClick={() => setIsTeamExpanded((previous) => !previous)}
                    aria-expanded={isTeamExpanded}
                    className="col-span-2 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-[#f8f7f4] text-base text-neutral-400 transition hover:border-neutral-300 hover:text-neutral-600 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f7f4] sm:h-10 sm:w-10 sm:text-lg md:h-12 md:w-12 md:text-xl"
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

              <div className="hidden w-full md:grid lg:hidden md:grid-cols-2 md:gap-x-10 md:gap-y-10">
                {teamMembers.map((member) => (
                  <TeamCard
                    key={member.id}
                    member={member}
                    className="max-w-none"
                  />
                ))}
              </div>

              <div className="hidden w-full lg:grid mx-auto max-w-7xl grid-cols-5 grid-rows-3 gap-x-10 gap-y-12 xl:gap-x-12 xl:gap-y-14 justify-items-center">
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
        </div>
      </section>

      <section
        id="about-backed"
        className="snap-start snap-always flex min-h-screen justify-center bg-[#f8f7f4] text-neutral-900"
      >
        <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-24 sm:px-6 sm:pb-12 sm:pt-28 md:px-8 md:pb-16 md:pt-32 lg:px-10 lg:pb-20 lg:pt-36 xl:pb-28 xl:pt-40 2xl:pb-32 2xl:pt-44">
          <div className="grid w-full grid-rows-[auto_1fr] gap-6 sm:gap-8 md:gap-10">
            <p className="shrink-0 font-mono uppercase tracking-[0.25em] text-[0.6rem] text-neutral-400 sm:text-[0.65rem] sm:tracking-[0.3em] md:text-xs lg:text-sm">
              We Are Backed By
            </p>
            <div className="flex flex-1 flex-col justify-center gap-6 sm:gap-8 md:gap-10">
              <h2 className="font-serif text-xl leading-snug text-neutral-900 sm:text-2xl md:text-3xl lg:text-5xl lg:leading-[1.1]">
                信頼できるパートナーとともに、Atlas
                の記憶レイヤーは産業全体へと浸透します。
              </h2>
              <div className="grid w-full grid-cols-2 justify-items-center gap-x-3 gap-y-4 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-5 md:hidden">
                {categorizedSupporters.map((supporter) => (
                  <SupporterCard key={`${supporter.category}-${supporter.name}`} supporter={supporter} />
                ))}
              </div>
              <div className="hidden w-full md:grid lg:hidden md:grid-cols-2 md:gap-x-10 md:gap-y-10">
                {categorizedSupporters.map((supporter) => (
                  <SupporterCard
                    key={`${supporter.category}-${supporter.name}`}
                    supporter={supporter}
                    className="max-w-none"
                  />
                ))}
              </div>
              <div className="hidden w-full lg:grid mx-auto max-w-7xl grid-cols-5 gap-x-10 gap-y-12 justify-items-center xl:gap-x-12 xl:gap-y-14">
                {categorizedSupporters.map((supporter) => (
                  <SupporterCard
                    key={`${supporter.category}-${supporter.name}`}
                    supporter={supporter}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about-news"
        className="snap-start snap-always flex min-h-screen justify-center bg-[#f8f7f4] text-neutral-900"
      >
        <div className="mx-auto w-full max-w-5xl px-4 pb-8 pt-24 sm:px-6 sm:pb-12 sm:pt-28 md:px-8 md:pb-16 md:pt-32 lg:px-10 lg:pb-20 lg:pt-36 xl:pb-28 xl:pt-40 2xl:pb-32 2xl:pt-44">
          <div className="grid w-full grid-rows-[auto_1fr] gap-6 sm:gap-8 md:gap-10">
            <p className="shrink-0 font-mono uppercase tracking-[0.25em] text-[0.6rem] text-neutral-400 sm:text-[0.65rem] sm:tracking-[0.3em] md:text-xs lg:text-sm">
              Current News
            </p>
            <div className="flex flex-1 flex-col justify-center gap-6 sm:gap-8 md:gap-10">
              <h2 className="font-serif text-xl leading-snug text-neutral-900 sm:text-2xl md:text-3xl lg:text-5xl lg:leading-[1.1]">
                プロダクトの進化とパートナーシップの最新情報をお届けします。
              </h2>
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                {previewNewsItems.map((news) => (
                  <NewsPreviewCard key={news.id} item={news} />
                ))}
              </div>
              {hasAdditionalNews ? (
                <div>
                  <Link
                    href="/news"
                    prefetch={false}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:px-5 sm:py-2 sm:text-sm"
                  >
                    ニュース一覧へ
                    <span aria-hidden>&gt;</span>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
