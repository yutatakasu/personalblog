"use client";

import Link from "next/link";
import { useLocale } from "@/providers/LanguageProvider";

const translations = {
  en: {
    paragraph1:
      "Atlas is a research lab working to shift the power structure of the AI age from corporations back to individuals by building the Memory Layer for AI.",
    paragraph2:
      "We believe your memories belong solely to you. Our researchers, engineers, and designers are inventing the infrastructure that returns data sovereignty to every person.",
    paragraph3: "This is the way AI should always have been.",
    joinTeam: "Join our team",
  },
  ja: {
    paragraph1:
      "Atlasは、AIのためのMemory Layerを構築することで、AI時代の権力構造を企業から個人へとシフトさせる研究ラボです。",
    paragraph2:
      "私たちは、あなたの記憶はあなただけのものであるべきだと考えています。研究者、エンジニア、デザイナーが、すべての人にデータ主権を返すインフラを発明しています。",
    paragraph3: "これが、AIが常にそうあるべき姿です。",
    joinTeam: "チームに参加する",
  },
} as const;

export function AtlasHero() {
  const { locale } = useLocale();
  const t = translations[locale];

  return (
    <section
      id="atlas"
      className="relative snap-start snap-always flex min-h-screen min-h-dvh items-end justify-center"
    >
      <div className="flex w-full max-w-4xl flex-col px-6 pb-28 sm:px-8 sm:pb-24 md:px-12 md:pb-24 lg:px-16 lg:pb-32">
        <div className="space-y-6 sm:space-y-8 md:space-y-10">
          <p className="font-serif text-base leading-relaxed text-black sm:text-lg md:text-xl lg:text-2xl">
            <span className="italic">Atlas</span> {t.paragraph1}
          </p>
          <p className="font-serif text-base leading-relaxed text-black sm:text-lg md:text-xl lg:text-2xl">
            {t.paragraph2}
          </p>
          <p className="font-serif text-base leading-relaxed text-black sm:text-lg md:text-xl lg:text-2xl">
            {t.paragraph3}
          </p>
        </div>
        <div className="mt-4 flex w-full justify-end">
          <Link
            href="/positions#open-roles"
            className="inline-flex items-center gap-2 font-serif text-sm text-[#2a2a2a]/70 transition hover:text-[#2a2a2a] sm:text-base md:text-lg lg:text-xl"
          >
            {t.joinTeam}
            <span aria-hidden className="text-[#2a2a2a]/50">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
