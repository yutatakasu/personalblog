"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, HTMLAttributes } from "react";
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
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
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

  const interactiveProps: HTMLAttributes<HTMLElement> | undefined =
    !supportsHover && canToggleDetail
      ? {
          role: "button",
          tabIndex: 0,
          "aria-expanded": isDetailOpen,
        }
      : undefined;

  return (
    <article
      className={`group flex w-full max-w-[120px] flex-col items-center gap-1.5 text-center sm:max-w-[140px] sm:gap-2 md:max-w-[160px] md:gap-3 lg:max-w-[180px] ${
        !supportsHover && canToggleDetail
          ? "cursor-pointer touch-manipulation"
          : ""
      } ${className ?? ""}`}
      style={style}
      {...(interactiveProps ?? {})}
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

  const interactiveProps: HTMLAttributes<HTMLElement> | undefined =
    !supportsHover && hasDetail
      ? {
          role: "button",
          tabIndex: 0,
          "aria-expanded": isDetailOpen,
        }
      : undefined;

  return (
    <article
      className={`group flex w-full max-w-[120px] flex-col items-center gap-1.5 text-center sm:max-w-[140px] sm:gap-2 md:max-w-[160px] md:gap-3 lg:max-w-[180px] ${
        !supportsHover && hasDetail ? "cursor-pointer touch-manipulation" : ""
      } ${className ?? ""}`}
      {...(interactiveProps ?? {})}
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

const SECTION_LABEL_SHARED_CLASSES =
  "font-mono uppercase tracking-[0.25em] text-[0.6rem] sm:text-[0.65rem] sm:tracking-[0.3em] md:text-xs lg:text-base xl:text-lg";
const SECTION_LABEL_POSITION =
  "pointer-events-none absolute left-12 sm:left-44 md:left-52 lg:left-60 top-16 sm:top-24 md:top-28 lg:top-32";
const SECTION_CONTENT_OFFSET = "pt-32 sm:pt-40 md:pt-44 lg:pt-48";
const MOBILE_TEAM_VISIBLE_COUNT = 6;
const NEWS_PREVIEW_COUNT = 3;

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
      className="group flex items-center gap-3 rounded-xl border border-neutral-200 bg-background p-2.5 transition hover:border-neutral-300 hover:bg-[#f7f5ef] focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-4 sm:rounded-2xl sm:p-3"
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
      }))
  );

  return (
    <>
      <section
        id="about"
        className="relative snap-start snap-always flex min-h-screen min-h-dvh justify-center text-white"
      >
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/members_far_from.jpg"
            alt="Atlas team"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            quality={95}
          />
          <div className="absolute inset-0 bg-black/40" aria-hidden />
        </div>
        <p
          className={`${SECTION_LABEL_POSITION} ${SECTION_LABEL_SHARED_CLASSES} z-20 text-white/60`}
        >
          About
        </p>
        <div className="relative z-10 flex w-full min-h-dvh items-center justify-center px-4 py-24 sm:px-6 sm:py-28 md:px-8 md:py-32 lg:px-10 lg:py-36 xl:py-40">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center sm:gap-6 md:gap-8 lg:gap-10">
            <h2 className="font-serif text-lg leading-tight sm:text-xl md:text-2xl lg:text-[3rem] lg:leading-[1.1] xl:text-[3.5rem]">
              <span className="block">Memory as a Sovereignty</span>
              <span className="mt-1 block sm:mt-2 sm:whitespace-nowrap">
                Atlas は MaaS の会社です
              </span>
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base md:text-lg">
              人類を調和に導くAI社会を作るために、コンテクストと呼ばれる"記憶"の主権を人間に取り戻すことが我が社の使命です。Atlasは、AIの持つ「記憶」を適切に発展させるインフラを開発・提供します。
            </p>
          </div>
        </div>
      </section>

      <section
        id="about-team"
        className="relative snap-start snap-always flex min-h-screen min-h-dvh justify-center bg-background text-neutral-900"
      >
        <p
          className={`${SECTION_LABEL_POSITION} ${SECTION_LABEL_SHARED_CLASSES} text-neutral-400`}
        >
          Team
        </p>
        <div
          className={`flex w-full justify-center px-4 pb-12 sm:px-6 sm:pb-14 md:px-8 md:pb-16 lg:px-10 lg:pb-16 xl:pb-16 2xl:pb-16 ${SECTION_CONTENT_OFFSET}`}
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col justify-center gap-6 sm:gap-8 md:gap-10">
            <div className="grid w-full grid-cols-2 justify-items-center gap-x-3 gap-y-4 sm:gap-x-4 sm:gap-y-5 md:hidden">
              {mobileVisibleMembers.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
              {hasAdditionalMembers ? (
                <button
                  type="button"
                  onClick={() => setIsTeamExpanded((previous) => !previous)}
                  aria-expanded={isTeamExpanded}
                  className="col-span-2 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-background text-base text-neutral-400 transition hover:border-neutral-300 hover:text-neutral-600 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-10 sm:w-10 sm:text-lg md:h-12 md:w-12 md:text-xl"
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

            <div className="hidden w-full md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-8 lg:hidden">
              {teamMembers.map((member) => (
                <TeamCard
                  key={member.id}
                  member={member}
                  className="max-w-none"
                />
              ))}
            </div>

            <div className="mx-auto hidden w-full max-w-7xl grid-cols-5 grid-rows-3 gap-x-10 gap-y-10 lg:grid xl:gap-x-12 xl:gap-y-12">
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
        className="relative snap-start snap-always flex min-h-screen min-h-dvh justify-center bg-background text-neutral-900"
      >
        <p
          className={`${SECTION_LABEL_POSITION} ${SECTION_LABEL_SHARED_CLASSES} text-neutral-400`}
        >
          Backed By
        </p>
        <div
          className={`flex w-full justify-center px-4 pb-12 sm:px-6 sm:pb-14 md:px-8 md:pb-16 lg:px-10 lg:pb-16 xl:pb-16 2xl:pb-16 ${SECTION_CONTENT_OFFSET}`}
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col justify-center gap-6 sm:gap-8 md:gap-10">
            <h2 className="-mt-4 mb-8 font-serif text-base leading-snug text-neutral-900 sm:-mt-6 sm:mb-10 sm:text-lg md:-mt-8 md:mb-12 md:text-xl lg:-mt-10 lg:mb-16 lg:text-[2.75rem] lg:leading-[1.1] xl:text-[3.25rem]">
              信頼できるパートナーとともに、Atlasの技術で記憶レイヤの主権を個人に取り戻します。
            </h2>
            <div className="grid w-full grid-cols-2 justify-items-center gap-x-3 gap-y-4 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-5 md:hidden">
              {categorizedSupporters.map((supporter) => (
                <SupporterCard
                  key={`${supporter.category}-${supporter.name}`}
                  supporter={supporter}
                />
              ))}
            </div>
            <div className="hidden w-full md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-8 lg:hidden">
              {categorizedSupporters.map((supporter) => (
                <SupporterCard
                  key={`${supporter.category}-${supporter.name}`}
                  supporter={supporter}
                  className="max-w-none"
                />
              ))}
            </div>
            <div className="mx-auto hidden w-full max-w-7xl grid-cols-5 gap-x-10 gap-y-10 justify-items-center lg:grid xl:gap-x-12 xl:gap-y-12">
              {categorizedSupporters.map((supporter) => (
                <SupporterCard
                  key={`${supporter.category}-${supporter.name}`}
                  supporter={supporter}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="about-news"
        className="relative snap-start snap-always flex min-h-screen min-h-dvh justify-center bg-background text-neutral-900"
      >
        <p
          className={`${SECTION_LABEL_POSITION} ${SECTION_LABEL_SHARED_CLASSES} text-neutral-400`}
        >
          Current News
        </p>
        <div
          className={`flex w-full justify-center px-4 pb-12 sm:px-6 sm:pb-14 md:px-8 md:pb-16 lg:px-10 lg:pb-16 xl:pb-16 2xl:pb-16 ${SECTION_CONTENT_OFFSET}`}
        >
          <div className="mx-auto flex w-full max-w-5xl flex-col justify-center gap-6 sm:gap-8 md:gap-10">
            <h2 className="-mt-4 mb-8 font-serif text-base leading-snug text-neutral-900 sm:-mt-6 sm:mb-10 sm:text-lg md:-mt-8 md:mb-12 md:text-xl lg:-mt-10 lg:mb-16 lg:text-[2.75rem] lg:leading-[1.1] xl:text-[3.25rem]">
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
      </section>
    </>
  );
}
