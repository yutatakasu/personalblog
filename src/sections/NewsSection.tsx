"use client";

import Link from "next/link";

import { NewsThumbnail } from "@/components/NewsThumbnail";
import { NEWS_CARD_HOVER_STYLES } from "@/lib/newsCardHover";
import type { NewsItem } from "@/models/news";
import { useLocale } from "@/providers/LanguageProvider";

const SECTION_CONTENT_OFFSET = "pt-24 sm:pt-32 md:pt-36 lg:pt-40";
const SECTION_HEADING_CLASS =
  "font-serif text-[1.1rem] leading-tight sm:text-[1.6rem] md:text-[1.95rem] lg:text-[2.4rem] lg:leading-[1.1]";
const NEWS_PREVIEW_COUNT = 3;

const translations = {
  en: {
    heading: "Stay updated on product evolution and partnership news.",
    viewAll: "View all news",
  },
  ja: {
    heading: "プロダクトの進化とパートナーシップの最新情報をお届けします。",
    viewAll: "ニュース一覧へ",
  },
} as const;

type NewsSectionProps = {
  newsItems: NewsItem[];
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
      className={`group flex items-center gap-3 rounded-xl border border-neutral-200 bg-background p-2.5 hover:border-neutral-300 hover:bg-[#f7f5ef] focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-4 sm:p-3 lg:gap-5 lg:p-4 xl:p-5 ${NEWS_CARD_HOVER_STYLES}`}
    >
      <NewsThumbnail
        src={thumbnailSrc}
        alt={item.thumbnailAlt}
        sizes="(min-width: 640px) 120px, 100px"
        className="w-24 shrink-0 rounded-xl overflow-hidden sm:w-28 md:w-32"
      />
      <div className="flex min-w-0 flex-col">
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-neutral-400 sm:text-[0.6rem] sm:tracking-[0.35em] md:text-xs">
          {item.date}
        </span>
        <span className="mt-0.5 font-serif text-sm leading-snug text-neutral-900 sm:mt-1 sm:text-base md:text-lg lg:text-xl">
          {item.title}
        </span>
      </div>
    </Link>
  );
}

export function NewsSection({ newsItems }: NewsSectionProps) {
  const { locale } = useLocale();
  const t = translations[locale];
  const previewNewsItems = newsItems.slice(0, NEWS_PREVIEW_COUNT);
  const hasAdditionalNews = newsItems.length > NEWS_PREVIEW_COUNT;

  return (
    <section
      id="news"
      className="relative snap-start snap-always flex min-h-screen min-h-dvh justify-center bg-background text-neutral-900"
    >
      <div
        className={`flex w-full justify-center px-6 pb-20 sm:px-6 sm:pb-24 md:px-8 md:pb-28 lg:px-10 lg:pb-32 xl:pb-36 2xl:pb-40 ${SECTION_CONTENT_OFFSET}`}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col justify-center gap-6 sm:gap-8 md:gap-10">
          <h2
            className={`-mt-4 mb-8 text-neutral-900 ${SECTION_HEADING_CLASS} sm:-mt-6 sm:mb-10 md:-mt-8 md:mb-12 lg:-mt-10 lg:mb-16`}
          >
            {t.heading}
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
                {t.viewAll}
                <span aria-hidden>&gt;</span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
