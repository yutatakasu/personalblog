"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const sectionIds = [
  "atlas",
  "products",
  "about",
  "careers",
  "contact",
] as const;
const darkSections = new Set(["about"]);

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
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
    // 初期表示は常に atlas を維持
    setActiveSection("atlas");

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const next = visible[0].target.id || "atlas";
          setActiveSection(next);
        }
      },
      {
        threshold: 0.55,
        rootMargin: "-72px 0px -25% 0px",
      }
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
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

  const isDarkBackground = darkSections.has(activeSection);
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

  return (
    <>
      <header className="w-full snap-none fixed top-0 left-0 right-0 z-50">
        {/* ナビゲーションバー */}
        <nav className="relative w-full px-4 py-4">
          {/* デスクトップナビゲーション */}
          <div className="hidden md:flex justify-center">
            <ul className="flex items-center gap-10 text-base font-sans">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                const isActiveOnDark = darkSections.has(item.id);
                const activeColor = isActiveOnDark
                  ? "text-white"
                  : "text-neutral-950";
                const underlineClass = isActive
                  ? isActiveOnDark
                    ? "after:bg-white"
                    : "after:bg-neutral-950"
                  : "after:bg-transparent";
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`relative inline-flex items-center transition-colors after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-full after:content-[''] ${
                        isActive
                          ? `${activeColor} font-semibold ${underlineClass}`
                          : inactiveLinkClass
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
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
          <div className="flex items-center justify-center gap-4 md:hidden text-base font-sans">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className={`${
                isDarkBackground ? "text-neutral-100" : "text-neutral-500"
              }`}
              aria-label="メニューを開く"
            >
              (Atlas)&nbsp;&nbsp;&nbsp;menu
            </button>
          </div>
        </nav>
      </header>

      {/* モバイルメニューオーバーレイ */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
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
              <div className="relative flex flex-col items-center gap-8 text-2xl font-serif">
                <div
                  className={`absolute -inset-x-28 -top-20 -bottom-20 rounded-[200px] ${overlayGlowColor} blur-[70px]`}
                  aria-hidden
                />
                <ul className="relative flex flex-col items-center gap-6">
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
                            isActive ? overlayActiveColor : overlayInactiveColor
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
                className={`relative text-sm font-sans underline ${overlayCloseColor}`}
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
