"use client";

import { useState, useEffect } from "react";
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
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveSection(visible[0].target.id);
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
              className={`hidden lg:block absolute right-0 pr-4 top-1/2 -translate-y-1/2 text-base font-mono ${
                isDarkBackground ? "text-neutral-200" : "text-neutral-500"
              }`}
            >
              {currentTime}
            </div>
          )}

          {/* モバイル: Atlas と menu */}
          <div className="flex items-center justify-center gap-6 md:hidden text-base">
            <div
              className={`text-xl font-serif ${
                isDarkBackground ? "text-neutral-100" : "text-neutral-500"
              }`}
            >
              Atlas
            </div>
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className={`font-sans ${
                isDarkBackground ? "text-neutral-100" : "text-neutral-500"
              }`}
              aria-label="メニューを開く"
            >
              menu
            </button>
          </div>
        </nav>
      </header>

      {/* モバイルメニューオーバーレイ */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* 背景（ぼかし効果付き） */}
          <div
            className="absolute inset-0 bg-white/90 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* メニューパネル */}
          <div className="relative h-full w-full flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-sm bg-white border border-black rounded-lg p-8 flex flex-col items-center">
              {/* タイムスタンプ（上部中央） */}
              {currentTime && (
                <div className="text-xs text-gray-500 font-sans mb-8">
                  {currentTime}
                </div>
              )}

              {/* メニュー項目 */}
              <ul className="flex flex-col gap-6 mb-12">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`font-sans text-sm transition-colors ${
                          isActive
                            ? "text-black font-semibold"
                            : "text-gray-500 hover:text-black"
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

              {/* Close ボタン（下部中央） */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-sans text-black underline"
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
