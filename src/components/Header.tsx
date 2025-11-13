"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const sectionIds = [
  "atlas",
  "products",
  "about",
  "about-team",
  "about-backed",
  "about-news",
  "careers",
  "contact",
] as const;

const sectionThemes: Record<string, "dark" | "light"> = {
  atlas: "light",
  products: "light",
  about: "dark",
  "about-team": "light",
  "about-backed": "light",
  "about-news": "light",
  careers: "light",
  contact: "dark",
};

const normalizeSectionId = (sectionId: string) => {
  if (sectionId.startsWith("about-")) {
    return "about";
  }
  return sectionId;
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [surfaceSection, setSurfaceSection] = useState<string>("atlas");
  const [activeSection, setActiveSection] = useState<string>("atlas");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      setCurrentTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

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
    setActiveSection("atlas");

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const nextId = visible[0].target.id || "atlas";
          setSurfaceSection(nextId);
          setActiveSection(normalizeSectionId(nextId));
        }
      },
      {
        threshold: 0.4,
        rootMargin: "-72px 0px -25% 0px",
      },
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    for (const element of elements) {
      observer.observe(element);
    }

    return () => {
      for (const element of elements) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, []);

  const navItems = [
    { id: "atlas", label: "Atlas", href: "#atlas" },
    { id: "products", label: "Products", href: "#products" },
    { id: "about", label: "About", href: "#about" },
    { id: "careers", label: "Careers", href: "#careers" },
    { id: "contact", label: "Contact", href: "#contact" },
  ];
  const isSectionDark = (section: string) => sectionThemes[section] === "dark";

  const isDarkBackground = isSectionDark(surfaceSection);
  const baseHeaderTextClass = isDarkBackground
    ? "text-white"
    : "text-neutral-900";
  const inactiveLinkClass = isDarkBackground
    ? "text-neutral-400 hover:text-neutral-200"
    : "text-neutral-400 hover:text-neutral-600";
  const overlayActiveColor = isDarkBackground
    ? "text-white"
    : "text-neutral-900";
  const overlayInactiveColor = isDarkBackground
    ? "text-white/65 hover:text-white/85"
    : "text-neutral-500 hover:text-neutral-800";
  const overlayTimestampColor = isDarkBackground
    ? "text-white/70"
    : "text-neutral-500";
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

    setSurfaceSection("atlas");
    setActiveSection("atlas");
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="w-full snap-none fixed top-0 left-0 right-0 z-100">
        {/* ナビゲーションバー */}
        <nav
          className={`relative w-full px-4 py-4 transition-colors duration-300 ${baseHeaderTextClass}`}
        >
          {/* デスクトップナビゲーション */}
          <div className="hidden md:flex justify-center">
            <ul className="flex items-center text-sm font-serif md:text-base">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.id;
                const activeSurfaceId = isActive ? surfaceSection : item.id;
                const isActiveOnDark = isSectionDark(activeSurfaceId);
                const activeColor = isActiveOnDark
                  ? "text-white"
                  : "text-neutral-950";
                const linkClass = isActive
                  ? `${activeColor} font-semibold`
                  : `${inactiveLinkClass}`;
                const commaClass = isSectionDark(surfaceSection)
                  ? "text-white/60"
                  : "text-neutral-400";
                const isLast = index === navItems.length - 1;
                return (
                  <li key={item.href} className="flex items-center">
                    <Link
                      href={item.href}
                      className={`px-2 transition-colors ${linkClass}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                    {!isLast ? (
                      <span className={`px-1 ${commaClass}`} aria-hidden>
                        ,
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* タイムスタンプ（右側に絶対配置） */}
          {currentTime && (
            <div
              className={`hidden lg:block absolute right-3 pr-5 top-1/2 -translate-y-1/2 text-base font-mono ${
                isDarkBackground ? "text-neutral-200" : "text-neutral-500"
              }`}
            >
              {currentTime}
            </div>
          )}

          {/* モバイル: Atlas と menu */}
          <div className="flex items-center justify-center gap-5 md:hidden text-base font-serif font-medium">
            <button
              type="button"
              onClick={handleScrollToAtlas}
              className={`${mobileNavTextClass} transition-colors duration-300`}
              aria-label="Atlasセクションへ移動"
            >
              (Atlas)
            </button>
            <button
              type="button"
              onClick={handleOpenMenu}
              className={`${mobileNavTextClass} transition-colors duration-300`}
              aria-label="メニューを開く"
            >
              menu
            </button>
          </div>
        </nav>
      </header>

      {/* メニューオーバーレイ */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className={`absolute inset-0 backdrop-blur-xl ${overlayBackdropColor}`}
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="relative flex h-full w-full flex-col items-center justify-between py-16">
            {currentTime && (
              <div
                className={`text-xs font-sans uppercase tracking-[0.4em] ${overlayTimestampColor}`}
              >
                {currentTime}
              </div>
            )}

            <div className="relative flex w-full flex-1 flex-col items-center justify-center">
              <div
                className={`absolute top-14 h-24 w-24 rounded-full ${overlayGlowColor} blur-[60px]`}
                aria-hidden
              />
              <div className="relative flex flex-col items-center gap-8 text-2xl font-serif md:text-3xl">
                <div
                  className={`absolute -inset-x-28 -top-20 -bottom-20 rounded-[200px] ${overlayGlowColor} blur-[70px]`}
                  aria-hidden
                />
                <ul className="relative flex flex-col items-center gap-6 text-center">
                  {navItems.map((item) => {
                    if (item.id === "atlas") {
                      return null;
                    }
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
                aria-label="メニューを閉じる"
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
