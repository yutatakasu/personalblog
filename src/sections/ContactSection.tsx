import Image from "next/image";

import { Footer } from "@/components/Footer";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative flex min-h-screen flex-col items-center justify-start text-white snap-start snap-always"
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
      <div className="relative z-10 flex w-full flex-1 justify-center px-4 pb-24 pt-24 sm:px-6 sm:pb-28 sm:pt-28 md:px-8 md:pb-32 md:pt-32 lg:px-10 lg:pb-36 lg:pt-36 xl:pb-40 xl:pt-40 2xl:pb-44 2xl:pt-44">
        <div className="grid w-full max-w-5xl grid-rows-[auto_1fr] gap-6 text-left sm:gap-8 md:gap-10">
          <p className="shrink-0 font-mono uppercase tracking-[0.25em] text-[0.6rem] font-medium text-white/70 sm:text-[0.65rem] sm:tracking-[0.3em] md:text-xs lg:text-sm">
            Contact
          </p>
          <div className="flex flex-1 flex-col justify-center gap-6 sm:gap-8 md:gap-10">
            <h2 className="font-serif text-lg leading-tight text-white sm:text-xl md:text-2xl lg:text-3xl lg:leading-[1.1]">
              Company Information
            </h2>
            <dl className="border-t border-white/20 text-xs font-medium sm:text-[0.9rem] md:text-sm lg:text-base">
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
                  〒1500043 東京都渋谷区道玄坂
                  1丁目10番8号渋谷道玄坂東急ビル2F-C
                </dd>
              </div>
            </dl>
            <div className="space-y-3 text-xs font-medium text-white/85 sm:space-y-3 md:space-y-4 md:text-sm lg:text-base">
              <p>
                メール：
                <a
                  href="mailto:info@atlas-official.net"
                  className="ml-1 underline decoration-white/60 decoration-dotted underline-offset-3 hover:decoration-white sm:underline-offset-4"
                >
                  info@atlas-official.net
                </a>
              </p>
              <p>営業時間: 平日 10:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>
      <Footer className="relative mt-auto" />
    </section>
  );
}
