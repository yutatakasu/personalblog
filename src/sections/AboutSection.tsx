"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, HTMLAttributes } from "react";
import { useEffect, useState } from "react";

import { NewsThumbnail } from "@/components/NewsThumbnail";
import type { InvestorGroup, Supporter } from "@/models/backed_by";
import type { NewsItem } from "@/models/news";
import type { TeamMember } from "@/models/team";

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

type TeamCardProps = {
  member: TeamMember;
  className?: string;
  style?: CSSProperties;
};

function TeamCard({ member, className, style }: TeamCardProps) {
  const supportsHover = useSupportsHover();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const hasDetail = Boolean(member.focus);

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
      className={`group flex w-full flex-col items-center gap-1.5 text-center ${
        className ?? ""
      } ${
        !supportsHover && hasDetail ? "cursor-pointer touch-manipulation" : ""
      }`}
      style={style}
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
      {...(interactiveProps ?? {})}
    >
      <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 sm:h-20 sm:w-20 md:h-24 md:w-24">
        <Image
          src={member.imageSrc}
          alt={member.imageAlt ?? `${member.name} portrait`}
          fill
          sizes="(min-width: 768px) 96px, (min-width: 640px) 80px, 64px"
          className="h-full w-full object-cover"
        />
      </div>
      <p className="mt-1 font-serif text-xs font-medium text-neutral-900 sm:text-sm">
        {member.name}
      </p>
      <p className="font-sans text-[0.6rem] text-neutral-500 sm:text-[0.65rem]">
        {member.title}
      </p>
      {member.focus ? (
        <p
          className={`mt-2 max-w-[200px] text-[0.65rem] leading-relaxed text-neutral-500 transition-opacity duration-200 ease-out sm:max-w-[240px] sm:text-sm ${
            supportsHover
              ? "opacity-0 group-hover:opacity-100"
              : isDetailOpen
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          {member.focus}
        </p>
      ) : null}
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
  const imageSrc = supporter.imageSrc ?? "/favicon.svg";
  const supportsHover = useSupportsHover();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const hasDetail = Boolean(supporter.focus);

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
      className={`group flex w-full flex-col items-center gap-1.5 text-center ${
        className ?? ""
      } ${
        !supportsHover && hasDetail ? "cursor-pointer touch-manipulation" : ""
      }`}
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
      {...(interactiveProps ?? {})}
    >
      <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 sm:h-20 sm:w-20 md:h-24 md:w-24">
        <Image
          src={imageSrc}
          alt={`${supporter.name} logo`}
          fill
          sizes="(min-width: 768px) 96px, (min-width: 640px) 80px, 64px"
          className="h-full w-full object-cover"
        />
      </div>
      <p className="mt-1 font-serif text-xs font-medium text-neutral-900 sm:text-sm">
        {supporter.name}
      </p>
      <p className="font-sans text-[0.6rem] text-neutral-500 sm:text-[0.65rem]">
        {supporter.category}
      </p>
      {supporter.focus ? (
        <p
          className={`mt-2 max-w-[200px] text-[0.65rem] leading-relaxed text-neutral-500 transition-opacity duration-200 ease-out sm:max-w-[240px] sm:text-sm ${
            supportsHover
              ? "opacity-0 group-hover:opacity-100"
              : isDetailOpen
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          {supporter.focus}
        </p>
      ) : null}
    </article>
  );
}

const SECTION_CONTENT_OFFSET = "pt-24 sm:pt-32 md:pt-36 lg:pt-40";
const SECTION_HEADING_CLASS =
  "font-serif text-[1.5rem] leading-tight sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] lg:leading-[1.1]";
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
  const thumbnailSrc = item.thumbnailSrc ?? "/favicon.svg";
  return (
    <Link
      href={item.link}
      prefetch={false}
      className="group flex items-center gap-3 rounded-xl border border-neutral-200 bg-background p-2.5 transition hover:border-neutral-300 hover:bg-[#f7f5ef] focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-4 sm:rounded-2xl sm:p-3"
    >
      <NewsThumbnail
        src={thumbnailSrc}
        alt={item.thumbnailAlt}
        sizes="(min-width: 640px) 96px, 80px"
        fallbackAspectRatio={16 / 9}
        className="w-20 shrink-0 rounded-lg border border-neutral-200 bg-neutral-200 sm:w-24 sm:rounded-xl"
      />
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
  const [isTeamExpandedMobile, setIsTeamExpandedMobile] = useState(false);
  const mobileVisibleMembers = isTeamExpandedMobile
    ? teamMembers
    : teamMembers.slice(0, MOBILE_TEAM_VISIBLE_COUNT);
  const desktopVisibleMembers = teamMembers;
  const getDesktopCardStyle = (member: TeamMember): CSSProperties => ({
    gridRowStart: member.position.row,
    gridColumnStart: member.position.column,
    marginTop: member.position.offsetY ?? undefined,
  });
  const hasAdditionalMembersMobile =
    teamMembers.length > MOBILE_TEAM_VISIBLE_COUNT;
  const remainingMobileMembers = Math.max(
    0,
    teamMembers.length - MOBILE_TEAM_VISIBLE_COUNT,
  );
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
        <div className="relative z-10 flex w-full min-h-dvh items-center justify-center px-6 pt-24 pb-32 sm:px-6 sm:pt-28 sm:pb-36 md:px-8 md:pt-32 md:pb-40 lg:px-10 lg:pt-36 lg:pb-44 xl:pt-40 xl:pb-48">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center sm:gap-6 md:gap-8 lg:gap-10">
            <h2 className={`${SECTION_HEADING_CLASS} text-center text-white`}>
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
        className="relative snap-start snap-always flex min-h-screen min-h-dvh items-center justify-center bg-background text-neutral-900"
      >
        <div className="flex w-full flex-col items-center justify-center px-6 pt-12 pb-20 sm:px-6 sm:pt-14 sm:pb-24 md:px-8 md:pt-16 md:pb-28 lg:px-10 lg:pt-20 lg:pb-32">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 sm:gap-10 md:gap-12 lg:gap-14">
            <h2
              className={`text-center text-neutral-900 ${SECTION_HEADING_CLASS}`}
            >
              Our Team
            </h2>

            {/* モバイル表示 */}
            <div className="w-full md:hidden">
              <div className="grid grid-cols-3 justify-items-center gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8">
                {mobileVisibleMembers.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
              {hasAdditionalMembersMobile ? (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setIsTeamExpandedMobile((previous) => !previous)
                    }
                    aria-expanded={isTeamExpandedMobile}
                    className="rounded-full border border-neutral-300 bg-background px-6 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {isTeamExpandedMobile
                    ? "Show Less"
                    : `Show All (${remainingMobileMembers})`}
                  </button>
                </div>
              ) : null}
            </div>

            {/* デスクトップ表示 */}
            <div className="hidden w-full md:block">
              <div className="grid grid-cols-6 justify-items-center gap-x-6 gap-y-8 lg:gap-x-8 lg:gap-y-10">
                {desktopVisibleMembers.map((member) => (
                  <TeamCard
                    key={member.id}
                    member={member}
                    style={getDesktopCardStyle(member)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about-backed"
        className="relative snap-start snap-always flex min-h-screen min-h-dvh items-center justify-center bg-background text-neutral-900"
      >
        <div className="flex w-full flex-col items-center justify-center px-6 pt-12 pb-20 sm:px-6 sm:pt-14 sm:pb-24 md:px-8 md:pt-16 md:pb-28 lg:px-10 lg:pt-20 lg:pb-32">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 sm:gap-10 md:gap-12 lg:gap-14">
            <h2
              className={`text-center text-neutral-900 ${SECTION_HEADING_CLASS}`}
            >
              Backed by people who are excited about a world that is becoming
              increasingly personalized.
            </h2>

            {/* モバイル表示 */}
            <div className="w-full md:hidden">
              <div className="grid grid-cols-3 justify-items-center gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8">
                {categorizedSupporters.map((supporter) => (
                  <SupporterCard
                    key={`${supporter.category}-${supporter.name}`}
                    supporter={supporter}
                  />
                ))}
              </div>
            </div>

            {/* デスクトップ表示 */}
            <div className="hidden w-full md:block">
              <div className="grid grid-cols-6 justify-items-center gap-x-6 gap-y-8 lg:gap-x-8 lg:gap-y-10">
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
        className="relative snap-start snap-always flex min-h-screen min-h-dvh justify-center bg-background text-neutral-900"
      >
        <div
          className={`flex w-full justify-center px-6 pb-20 sm:px-6 sm:pb-24 md:px-8 md:pb-28 lg:px-10 lg:pb-32 xl:pb-36 2xl:pb-40 ${SECTION_CONTENT_OFFSET}`}
        >
          <div className="mx-auto flex w-full max-w-5xl flex-col justify-center gap-6 sm:gap-8 md:gap-10">
            <h2
              className={`-mt-4 mb-8 text-neutral-900 ${SECTION_HEADING_CLASS} sm:-mt-6 sm:mb-10 md:-mt-8 md:mb-12 lg:-mt-10 lg:mb-16`}
            >
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
