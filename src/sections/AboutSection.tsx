"use client";

import Image from "next/image";
import type { CSSProperties, HTMLAttributes } from "react";
import { useEffect, useState } from "react";

import type { InvestorGroup, Supporter } from "@/models/backed_by";
import type { TeamMember } from "@/models/team";
import { useLocale } from "@/providers/LanguageProvider";

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
  const detailOpacityClass = supportsHover
    ? "opacity-0 group-hover:opacity-100"
    : isDetailOpen
      ? "opacity-100"
      : "opacity-0";

  return (
    <article
      className={`group flex w-full flex-col items-center gap-1.5 text-center ${className ?? ""
        } ${!supportsHover && hasDetail ? "cursor-pointer touch-manipulation" : ""
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
      <div className="relative h-24 w-24 overflow-hidden rounded-full sm:h-28 sm:w-28 md:h-32 md:w-32">
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
          className={`mt-2 max-w-[200px] text-[0.65rem] leading-relaxed text-neutral-500 transition-opacity duration-200 ease-out sm:max-w-[240px] sm:text-sm ${detailOpacityClass}`}
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
  const detailOpacityClass = supportsHover
    ? "opacity-0 group-hover:opacity-100"
    : isDetailOpen
      ? "opacity-100"
      : "opacity-0";

  return (
    <article
      className={`group flex w-full flex-col items-center gap-1.5 text-center ${className ?? ""
        } ${!supportsHover && hasDetail ? "cursor-pointer touch-manipulation" : ""
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
      <div className="relative h-24 w-24 overflow-hidden rounded-full sm:h-28 sm:w-28 md:h-32 md:w-32">
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
          className={`mt-2 max-w-[200px] text-[0.65rem] leading-relaxed text-neutral-500 transition-opacity duration-200 ease-out sm:max-w-[240px] sm:text-sm ${detailOpacityClass}`}
        >
          {supporter.focus}
        </p>
      ) : null}
    </article>
  );
}

const SECTION_HEADING_CLASS =
  "font-serif text-[1.1rem] leading-tight sm:text-[1.6rem] md:text-[1.95rem] lg:text-[2.4rem] lg:leading-[1.1]";
const MOBILE_TEAM_VISIBLE_COUNT = 6;

const translations = {
  en: {
    ourTeam: "Our Team",
    backedBy:
      "Supported by...",
    showLess: "Show Less",
    showAll: (count: number) => `Show All (${count})`,
    teamAlt: "Atlas team",
  },
  ja: {
    ourTeam: "Our Team",
    backedBy:
      "Supported by...",
    showLess: "折りたたむ",
    showAll: (count: number) => `すべて表示 (${count})`,
    teamAlt: "Atlas Team",
  },
} as const;

type AboutSectionProps = {
  teamMembers: TeamMember[];
  investorGroups: InvestorGroup[];
};

export function AboutSection({
  teamMembers,
  investorGroups,
}: AboutSectionProps) {
  const { locale } = useLocale();
  const t = translations[locale];
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
        id="atlas-photo"
        className="relative snap-start snap-always flex min-h-screen min-h-dvh items-center justify-center bg-black"
      >
        <div className="flex w-full items-center justify-center px-6 pt-24 pb-32 sm:px-6 sm:pt-28 sm:pb-36 md:px-8 md:pt-32 md:pb-40 lg:px-10 lg:pt-36 lg:pb-44 xl:pt-40 xl:pb-48">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-center">
            <div className="relative w-full overflow-hidden rounded-3xl bg-neutral-900 shadow-[0_8px_30px_rgba(0,0,0,0.15)] sm:rounded-[2.2rem] sm:shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
              <Image
                src="/members_far_from.jpg"
                alt={t.teamAlt}
                priority
                width={1152}
                height={768}
                sizes="(min-width: 1280px) 960px, (min-width: 1024px) 880px, (min-width: 768px) 720px, 100vw"
                className="h-auto w-full object-cover"
                quality={95}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
            </div>
          </div>
        </div>
      </section>

      <section
        id="team"
        className="relative snap-start snap-always flex min-h-screen min-h-dvh items-center justify-center bg-background text-neutral-900"
      >
        <div className="flex w-full flex-col items-center justify-center px-6 pt-12 pb-20 sm:px-6 sm:pt-14 sm:pb-24 md:px-8 md:pt-16 md:pb-28 lg:px-10 lg:pt-20 lg:pb-32">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 sm:gap-10 md:gap-12 lg:gap-14">
            <h2
              className={`text-center text-neutral-900 ${SECTION_HEADING_CLASS}`}
            >
              {t.ourTeam}
            </h2>

            {/* モバイル表示 */}
            <div className="w-full md:hidden">
              <div className="grid grid-cols-3 justify-items-center gap-x-3 gap-y-4 sm:gap-x-5 sm:gap-y-6">
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
                      ? t.showLess
                      : t.showAll(remainingMobileMembers)}
                  </button>
                </div>
              ) : null}
            </div>

            {/* デスクトップ表示 */}
            <div className="hidden w-full md:block">
              <div className="grid grid-cols-5 justify-items-center gap-x-6 gap-y-8 lg:gap-x-8 lg:gap-y-10">
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
        id="team-supporters"
        className="relative snap-start snap-always flex min-h-screen min-h-dvh items-center justify-center bg-background text-neutral-900"
      >
        <div className="flex w-full flex-col items-center justify-center px-6 pt-12 pb-20 sm:px-6 sm:pt-14 sm:pb-24 md:px-8 md:pt-16 md:pb-28 lg:px-10 lg:pt-20 lg:pb-32">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 sm:gap-10 md:gap-12 lg:gap-14">
            <h2
              className={`text-center text-neutral-900 ${SECTION_HEADING_CLASS}`}
            >
              {t.backedBy}
            </h2>

            {/* モバイル表示 */}
            <div className="w-full md:hidden">
              <div className="grid grid-cols-3 justify-items-center gap-x-3 gap-y-4 sm:gap-x-5 sm:gap-y-6">
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
              <div className="grid grid-cols-5 justify-items-center gap-x-6 gap-y-8 lg:gap-x-8 lg:gap-y-10">
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
        id="team-photo"
        className="relative snap-start snap-always flex min-h-screen min-h-dvh items-center justify-center bg-black"
      >
        <div className="flex w-full items-center justify-center px-6 pt-24 pb-32 sm:px-6 sm:pt-28 sm:pb-36 md:px-8 md:pt-32 md:pb-40 lg:px-10 lg:pt-36 lg:pb-44 xl:pt-40 xl:pb-48">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-center">
            <div className="relative w-full overflow-hidden rounded-3xl bg-neutral-900 shadow-[0_8px_30px_rgba(0,0,0,0.15)] sm:rounded-[2.2rem] sm:shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
              <Image
                src="/members.jpg"
                alt={t.teamAlt}
                priority
                width={1152}
                height={768}
                sizes="(min-width: 1280px) 960px, (min-width: 1024px) 880px, (min-width: 768px) 720px, 100vw"
                className="h-auto w-full object-cover"
                quality={95}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
