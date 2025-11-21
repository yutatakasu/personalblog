"use client";

import Image from "next/image";

import { Footer } from "@/components/Footer";
import { useLocale } from "@/providers/LanguageProvider";

const SECTION_CONTENT_OFFSET = "pt-32 sm:pt-40 md:pt-44 lg:pt-48";
const SECTION_HEADING_CLASS =
  "font-serif text-[1.1rem] leading-tight sm:text-[1.6rem] md:text-[1.95rem] lg:text-[2.4rem] lg:leading-[1.1]";

const translations = {
  en: {
    heading: "Company Information",
    companyName: "Company Name",
    companyNameValue: "Atlas Inc. (Japanese: アトラス)",
    founded: "Founded",
    foundedValue: "December 2023",
    ceo: "CEO",
    ceoValue: "Yuki Miyazaki",
    business: "Business",
    businessValue: "Research and development of AI long-term memory technology / Business development",
    employees: "Employees",
    employeesValue: "Approximately 15",
    capital: "Capital",
    capitalValue: "¥1,000,000",
    location: "Location",
    locationValue: "〒153-0042 4-5-12 Aobadai, Meguro-ku, Tokyo a place by wa 100",
    email: "Email:",
    imageAlt: "Sky surrounded by greenery",
  },
  ja: {
    heading: "会社情報",
    companyName: "会社名",
    companyNameValue: "Atlas株式会社（英字表記：Atlas Inc. / 読み：アトラス）",
    founded: "創業",
    foundedValue: "2023年12月",
    ceo: "代表取締役",
    ceoValue: "宮崎悠生",
    business: "事業内容",
    businessValue: "AIの長期記憶技術の研究開発/事業開発",
    employees: "従業員数",
    employeesValue: "約15名",
    capital: "資本金",
    capitalValue: "1,000,000円",
    location: "所在地",
    locationValue: "〒153-0042 東京都目黒区青葉台４丁目５−１２ a place by wa 100",
    email: "メール：",
    imageAlt: "緑に囲まれた空",
  },
} as const;

export function ContactSection() {
  const { locale } = useLocale();
  const t = translations[locale];

  return (
    <section
      id="contact"
      className="relative flex min-h-screen min-h-dvh flex-col items-center justify-start text-white snap-start snap-always"
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/trees_and_sky.jpg"
          alt={t.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          quality={95}
        />
        <div
          className="absolute inset-0 bg-black/50 md:bg-black/60"
          aria-hidden
        />
      </div>
      <div
        className={`relative z-10 flex w-full flex-1 justify-center px-6 pb-16 sm:px-6 sm:pb-20 md:px-8 md:pb-24 lg:px-10 lg:pb-28 xl:pb-32 2xl:pb-36 ${SECTION_CONTENT_OFFSET}`}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col justify-center gap-6 text-left sm:gap-8 md:gap-10">
          <h2 className={`${SECTION_HEADING_CLASS} text-white`}>
            {t.heading}
          </h2>
          <dl className="border-t border-white/20 text-xs font-medium sm:text-[0.9rem] md:text-sm lg:text-base">
            <div className="grid gap-3 border-b border-white/20 py-3 sm:gap-4 sm:py-4 md:gap-4 md:py-5 lg:py-4 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.2em] text-white/60 sm:tracking-[0.25em]">
                {t.companyName}
              </dt>
              <dd className="leading-relaxed wrap-break-word">
                {t.companyNameValue}
              </dd>
            </div>
            <div className="grid gap-3 border-b border-white/20 py-3 sm:gap-4 sm:py-4 md:gap-4 md:py-5 lg:py-4 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.2em] text-white/60 sm:tracking-[0.25em]">
                {t.founded}
              </dt>
              <dd className="leading-relaxed">{t.foundedValue}</dd>
            </div>
            <div className="grid gap-3 border-b border-white/20 py-3 sm:gap-4 sm:py-4 md:gap-4 md:py-5 lg:py-4 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.2em] text-white/60 sm:tracking-[0.25em]">
                {t.ceo}
              </dt>
              <dd className="leading-relaxed">{t.ceoValue}</dd>
            </div>
            <div className="grid gap-3 border-b border-white/20 py-3 sm:gap-4 sm:py-4 md:gap-4 md:py-5 lg:py-4 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.2em] text-white/60 sm:tracking-[0.25em]">
                {t.business}
              </dt>
              <dd className="leading-relaxed">{t.businessValue}</dd>
            </div>
            <div className="grid gap-3 border-b border-white/20 py-3 sm:gap-4 sm:py-4 md:gap-4 md:py-5 lg:py-4 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.2em] text-white/60 sm:tracking-[0.25em]">
                {t.employees}
              </dt>
              <dd className="leading-relaxed">{t.employeesValue}</dd>
            </div>
            <div className="grid gap-3 border-b border-white/20 py-3 sm:gap-4 sm:py-4 md:gap-4 md:py-5 lg:py-4 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.2em] text-white/60 sm:tracking-[0.25em]">
                {t.capital}
              </dt>
              <dd className="leading-relaxed">{t.capitalValue}</dd>
            </div>
            <div className="grid gap-3 py-3 sm:gap-4 sm:py-4 md:gap-4 md:py-5 lg:py-4 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.2em] text-white/60 sm:tracking-[0.25em]">
                {t.location}
              </dt>
              <dd className="leading-relaxed wrap-break-word">
                {t.locationValue}
              </dd>
            </div>
          </dl>
          <div className="space-y-2.5 text-xs font-medium text-white/85 sm:space-y-3 md:space-y-3.5 md:text-sm lg:text-base">
            <p>
              {t.email}
              <a
                href="mailto:info@atlas-official.net"
                className="ml-1 underline decoration-white/60 decoration-dotted underline-offset-3 hover:decoration-white sm:underline-offset-4"
              >
                info@atlas-official.net
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer className="relative mt-auto mb-16 sm:mb-20 md:mb-24 lg:mb-28 xl:mb-32 2xl:mb-36" />
    </section>
  );
}
