import Image from "next/image";

import { Footer } from "@/components/Footer";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative snap-start snap-always flex min-h-screen items-start justify-center text-white md:items-center"
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/trees_and_sky.jpg"
          alt="緑に囲まれた空"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-black/50 md:bg-black/60"
          aria-hidden
        />
      </div>
      <div className="relative z-10 flex h-full w-full items-start px-4 py-8 pb-24 sm:px-6 sm:py-12 sm:pb-28 md:items-center md:px-8 md:py-16 md:pb-32 lg:px-10 lg:py-20 lg:pb-36 xl:py-28 xl:pb-40 2xl:py-32 2xl:pb-44">
        <div className="mx-auto w-full max-w-5xl text-white">
          <div className="text-left">
            <p className="mb-4 font-mono uppercase tracking-[0.25em] text-[0.6rem] font-medium text-white/70 sm:mb-6 sm:text-[0.65rem] sm:tracking-[0.3em] md:mb-8 md:text-xs lg:mb-10 lg:text-sm xl:mb-14">
              Contact
            </p>
            <h2 className="mt-2 font-serif text-lg leading-tight text-white sm:mt-3 sm:text-xl md:mt-4 md:text-2xl lg:mt-6 lg:text-3xl lg:leading-[1.1]">
              Company Information
            </h2>
          </div>
          <dl className="mt-6 border-t border-white/20 text-xs font-medium sm:mt-8 sm:text-[0.9rem] md:mt-10 md:text-sm lg:mt-12 lg:text-base xl:mt-16">
            <div className="grid gap-3 border-b border-white/20 py-4 sm:gap-4 sm:py-5 md:gap-4 md:py-5 lg:py-6 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.2em] text-white/60 sm:tracking-[0.25em]">
                会社名
              </dt>
              <dd className="leading-relaxed wrap-break-word">
                Atlas株式会社（英字表記：Atlas Inc. / 読み：アトラス）
              </dd>
            </div>
            <div className="grid gap-3 border-b border-white/20 py-4 sm:gap-4 sm:py-5 md:gap-4 md:py-5 lg:py-6 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.2em] text-white/60 sm:tracking-[0.25em]">
                創業
              </dt>
              <dd className="leading-relaxed">2023年12月</dd>
            </div>
            <div className="grid gap-3 border-b border-white/20 py-4 sm:gap-4 sm:py-5 md:gap-4 md:py-5 lg:py-6 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.2em] text-white/60 sm:tracking-[0.25em]">
                代表
              </dt>
              <dd className="leading-relaxed">宮崎悠生</dd>
            </div>
            <div className="grid gap-3 border-b border-white/20 py-4 sm:gap-4 sm:py-5 md:gap-4 md:py-5 lg:py-6 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.2em] text-white/60 sm:tracking-[0.25em]">
                事業内容
              </dt>
              <dd className="leading-relaxed">AI技術を用いた事業開発</dd>
            </div>
            <div className="grid gap-3 border-b border-white/20 py-4 sm:gap-4 sm:py-5 md:gap-4 md:py-5 lg:py-6 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.2em] text-white/60 sm:tracking-[0.25em]">
                従業員数
              </dt>
              <dd className="leading-relaxed">約15名</dd>
            </div>
            <div className="grid gap-3 border-b border-white/20 py-4 sm:gap-4 sm:py-5 md:gap-4 md:py-5 lg:py-6 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.2em] text-white/60 sm:tracking-[0.25em]">
                資本金
              </dt>
              <dd className="leading-relaxed">1,000,000円</dd>
            </div>
            <div className="grid gap-3 py-4 sm:gap-4 sm:py-5 md:gap-4 md:py-5 lg:py-6 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.2em] text-white/60 sm:tracking-[0.25em]">
                所在地
              </dt>
              <dd className="leading-relaxed wrap-break-word">
                〒1500043 東京都渋谷区道玄坂 1丁目10番8号渋谷道玄坂東急ビル2F-C
              </dd>
            </div>
          </dl>
          <div className="mt-8 space-y-3 text-xs font-medium text-white/85 sm:mt-10 sm:space-y-3 md:mt-12 md:space-y-4 md:text-sm lg:mt-14 lg:text-base xl:mt-16">
            <p>
              メール：
              <a
                href="mailto:contact@atlas.inc"
                className="ml-1 underline decoration-white/60 decoration-dotted underline-offset-3 hover:decoration-white sm:underline-offset-4"
              >
                contact@atlas.inc
              </a>
            </p>
            <p>営業時間: 平日 10:00 - 18:00</p>
          </div>
        </div>
      </div>
      <Footer className="absolute bottom-0 left-0 right-0" />
    </section>
  );
}
