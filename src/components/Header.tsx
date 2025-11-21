"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "@/providers/LanguageProvider";

const sectionIds = [
  "atlas",
  "atlas-photo",
  "team",
  "team-supporters",
  "team-photo",
  "careers",
  "news",
  "contact",
] as const;

const sectionThemes: Record<string, "dark" | "light"> = {
  atlas: "light",
  "atlas-photo": "dark",
  news: "light",
  team: "light",
  "team-supporters": "light",
  "team-photo": "dark",
  careers: "light",
  contact: "dark",
};

const normalizeSectionId = (sectionId: string) => {
  if (sectionId === "atlas-photo") {
    return "atlas";
  }
  if (sectionId.startsWith("team-")) {
    return "team";
  }
  return sectionId;
};

const SECTION_FOCUS_RATIO = 0.35;
const LABEL_TRANSITION_DURATION = 100;

const languageSwitchLabels = {
  en: {
    switchToJapanese: "Switch to Japanese",
    switchToEnglish: "Switch to English",
  },
  ja: {
    switchToJapanese: "日本語に切り替え",
    switchToEnglish: "英語に切り替え",
  },
} as const;

// セクションIDからモバイル表示用のラベルを取得
const getSectionLabel = (sectionId: string): string => {
  if (sectionId === "atlas" || sectionId === "atlas-photo") {
    return "Atlas";
  }
  if (sectionId === "news") {
    return "News";
  }
  if (
    sectionId === "team" ||
    sectionId === "team-supporters" ||
    sectionId === "team-photo"
  ) {
    return "Team";
  }
  if (sectionId === "careers") {
    return "Careers";
  }
  if (sectionId === "contact") {
    return "Contact";
  }
  return "Atlas"; // デフォルト
};

export function Header() {
  const { locale, toggleLocale } = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [surfaceSection, setSurfaceSection] = useState<string>("atlas");
  const [activeSection, setActiveSection] = useState<string>("atlas");
  const [displayLabel, setDisplayLabel] = useState<string>("Atlas");
  const [isLabelChanging, setIsLabelChanging] = useState(false);
  const displayLabelRef = useRef<string>("Atlas");
  const labelTransitionTimeoutRef = useRef<number | null>(null);
  const surfaceSectionRef = useRef<string>("atlas");
  const sectionElementsRef = useRef<HTMLElement[]>([]);

  const scheduleLabelUpdate = useCallback((nextLabel: string) => {
    if (labelTransitionTimeoutRef.current !== null) {
      window.clearTimeout(labelTransitionTimeoutRef.current);
    }

    setIsLabelChanging(true);
    setDisplayLabel(nextLabel);
    displayLabelRef.current = nextLabel;
    labelTransitionTimeoutRef.current = window.setTimeout(() => {
      setIsLabelChanging(false);
      labelTransitionTimeoutRef.current = null;
    }, LABEL_TRANSITION_DURATION);
  }, []);

  const applySectionState = useCallback(
    (nextId: string) => {
      const nextLabel = getSectionLabel(nextId);
      const shouldUpdateLabel = nextLabel !== displayLabelRef.current;
      const shouldUpdateSection = surfaceSectionRef.current !== nextId;

      if (!shouldUpdateSection && !shouldUpdateLabel) {
        return;
      }

      if (shouldUpdateSection) {
        surfaceSectionRef.current = nextId;
        setSurfaceSection(nextId);
        setActiveSection(normalizeSectionId(nextId));
      }

      if (shouldUpdateLabel) {
        scheduleLabelUpdate(nextLabel);
      }
    },
    [scheduleLabelUpdate]
  );

  // メニューが開いている時はbodyのスクロールを無効化
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!(main instanceof HTMLElement)) {
      return;
    }

    const resolveSectionElements = () => {
      sectionElementsRef.current = sectionIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);
    };

    const determineCurrentSection = () => {
      if (sectionElementsRef.current.length === 0) {
        return;
      }

      const mainRect = main.getBoundingClientRect();
      const focusPosition =
        main.scrollTop + main.clientHeight * SECTION_FOCUS_RATIO;
      let nextId = sectionElementsRef.current[0]?.id ?? "atlas";

      for (const section of sectionElementsRef.current) {
        const sectionRect = section.getBoundingClientRect();
        const relativeOffset = sectionRect.top - mainRect.top + main.scrollTop;
        if (focusPosition >= relativeOffset) {
          nextId = section.id;
          continue;
        }
        break;
      }

      applySectionState(nextId);
    };

    let scrollFrame: number | null = null;
    let hydrateRetryId: number | null = null;
    const handleScroll = () => {
      if (scrollFrame !== null) {
        return;
      }
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = null;
        determineCurrentSection();
      });
    };

    const handleResize = () => {
      resolveSectionElements();
      determineCurrentSection();
    };

    resolveSectionElements();
    determineCurrentSection();
    if (sectionElementsRef.current.length === 0) {
      hydrateRetryId = window.requestAnimationFrame(() => {
        resolveSectionElements();
        determineCurrentSection();
      });
    }

    main.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      main.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (scrollFrame !== null) {
        window.cancelAnimationFrame(scrollFrame);
      }
      if (hydrateRetryId !== null) {
        window.cancelAnimationFrame(hydrateRetryId);
      }
    };
  }, [applySectionState]);

  useEffect(() => {
    return () => {
      if (labelTransitionTimeoutRef.current !== null) {
        window.clearTimeout(labelTransitionTimeoutRef.current);
      }
    };
  }, []);

  const navItems = [
    { id: "atlas", label: "Atlas", href: "#atlas" },
    { id: "team", label: "Team", href: "#team" },
    { id: "careers", label: "Careers", href: "#careers" },
    { id: "news", label: "News", href: "#news" },
    { id: "contact", label: "Contact", href: "#contact" },
  ];
  const isSectionDark = (section: string) => sectionThemes[section] === "dark";

  const isDarkBackground = isSectionDark(surfaceSection);
  const baseHeaderTextClass = isDarkBackground
    ? "text-white"
    : "text-neutral-900";
  const overlayActiveColor = isDarkBackground
    ? "text-white"
    : "text-neutral-900";
  const overlayInactiveColor = isDarkBackground
    ? "text-white/65 hover:text-white/85"
    : "text-neutral-500 hover:text-neutral-800";
  const overlayCloseColor = isDarkBackground
    ? "text-white"
    : "text-neutral-800";
  const overlayBackdropColor = isDarkBackground ? "bg-black/45" : "bg-white/35";
  const overlayGlowColor = isDarkBackground ? "bg-white/15" : "bg-black/5";
  const mobileNavTextClass = isDarkBackground
    ? "text-neutral-100"
    : "text-neutral-900";

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const handleScrollToAtlas = () => {
    if (typeof window === "undefined") {
      return;
    }

    const main = document.querySelector("main");
    if (main instanceof HTMLElement) {
      main.scrollTo({ top: 0, behavior: "smooth" });
    }

    const atlasSection = document.getElementById("atlas");
    if (atlasSection instanceof HTMLElement) {
      atlasSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.hash = "#atlas";
    }

    applySectionState("atlas");
    setIsMenuOpen(false);
  };

  const MENU_OVERLAY_ID = "site-menu-overlay";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="w-full snap-none fixed top-0 left-0 right-0 z-100">
        {/* ナビゲーションバー */}
        <nav
          className={`relative flex h-14 items-center justify-center px-4 md:h-16 md:px-8 lg:h-18 lg:px-10 transition-colors duration-300 ${baseHeaderTextClass}`}
        >
          <div className="hidden lg:flex absolute right-3 pr-5 top-1/2 -translate-y-1/2 items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (locale !== "en") {
                  toggleLocale();
                }
              }}
              aria-pressed={locale === "en"}
              aria-label={languageSwitchLabels[locale].switchToEnglish}
              className={`text-sm font-medium transition-colors ${
                locale === "en"
                  ? isDarkBackground
                    ? "text-white"
                    : "text-neutral-900"
                  : isDarkBackground
                  ? "text-white/50 hover:text-white/70"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              EN
            </button>
            <span
              className={`text-xs ${
                isDarkBackground ? "text-white/40" : "text-neutral-400"
              }`}
              aria-hidden
            >
              /
            </span>
            <button
              type="button"
              onClick={() => {
                if (locale !== "ja") {
                  toggleLocale();
                }
              }}
              aria-pressed={locale === "ja"}
              aria-label={languageSwitchLabels[locale].switchToJapanese}
              className={`text-sm font-medium transition-colors ${
                locale === "ja"
                  ? isDarkBackground
                    ? "text-white"
                    : "text-neutral-900"
                  : isDarkBackground
                  ? "text-white/50 hover:text-white/70"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              JP
            </button>
          </div>
          <div className="mx-auto flex w-full max-w-5xl items-center justify-center gap-0 text-base font-serif font-medium md:gap-px md:text-lg">
            <button
              type="button"
              onClick={handleScrollToAtlas}
              className={`transition-colors duration-300 relative w-[60px] text-center ${mobileNavTextClass} md:w-[80px] md:text-xl`}
              aria-label={`Scroll to ${displayLabel} section`}
            >
              <span
                className={`section-label inline-block transform transition-all duration-120 ease-out ${
                  isLabelChanging
                    ? "opacity-80 translate-y-[0.5px] scale-[0.995]"
                    : "opacity-100 translate-y-0 scale-100"
                }`}
              >
                ({displayLabel})
              </span>
            </button>
            <button
              type="button"
              onClick={handleOpenMenu}
              className={`transition-colors duration-300 w-[60px] text-center ${mobileNavTextClass} text-base md:w-[80px] md:text-lg`}
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              aria-controls={MENU_OVERLAY_ID}
            >
              menu
            </button>
          </div>
        </nav>
      </header>

      {/* メニューオーバーレイ */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50"
          id={MENU_OVERLAY_ID}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`absolute inset-0 backdrop-blur-xl ${overlayBackdropColor}`}
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="relative flex h-full w-full flex-col items-center justify-between py-16 px-6 md:px-8">
            <div className="relative flex w-full flex-1 flex-col items-center justify-center">
              <div
                className={`absolute top-14 h-24 w-24 rounded-full ${overlayGlowColor} blur-[60px]`}
                aria-hidden
              />
              <div className="relative flex w-full max-w-[28rem] flex-col items-center gap-8 text-2xl font-serif md:text-3xl">
                <div
                  className={`absolute -inset-x-28 -top-20 -bottom-20 rounded-[200px] ${overlayGlowColor} blur-[70px]`}
                  aria-hidden
                />
                <ul className="relative flex flex-col items-center gap-6 text-center">
                  {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`transition-colors ${
                            isActive
                              ? `font-semibold ${overlayActiveColor}`
                              : `font-medium ${overlayInactiveColor}`
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="relative flex w-full flex-col items-center gap-6">
              <div
                className={`absolute inset-x-8 bottom-0 h-24 rounded-full ${overlayGlowColor} blur-[60px]`}
                aria-hidden
              />
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className={`relative text-sm font-sans font-medium underline ${overlayCloseColor}`}
                aria-label="Close menu"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
