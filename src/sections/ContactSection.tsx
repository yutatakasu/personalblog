import { Footer } from "@/components/Footer";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative snap-start snap-always flex h-screen items-center justify-center text-white"
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/trees_and_sky.jpg"
          alt="緑に囲まれた空"
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-black/50 md:bg-black/60"
          aria-hidden
        />
      </div>
      <div className="relative z-10 flex h-full w-full items-center px-6 py-24 md:py-32">
        <div className="mx-auto w-full max-w-4xl space-y-12 text-white">
          <div className="text-center">
            <p className="font-mono uppercase tracking-[0.3em] text-xs font-medium text-white/70 md:text-sm">
              Contact
            </p>
            <h2 className="mt-6 font-serif text-3xl leading-tight md:text-5xl">
              Company Information
            </h2>
          </div>
          <dl className="grid gap-8 border-y border-white/30 py-12 text-sm font-medium tracking-wide md:text-base">
            <div className="flex flex-col gap-3 border-t border-white/20 pt-8 first:border-t-0 first:pt-0 md:flex-row md:items-start md:justify-between">
              <dt className="font-semibold uppercase tracking-[0.25em] text-white/70 md:w-48">
                会社名
              </dt>
              <dd className="text-left md:flex-1">
                Atlas株式会社（英字表記：Atlas Inc. / 読み：アトラス）
              </dd>
            </div>
            <div className="flex flex-col gap-3 border-t border-white/20 pt-8 first:border-t-0 first:pt-0 md:flex-row md:items-start md:justify-between">
              <dt className="font-semibold uppercase tracking-[0.25em] text-white/70 md:w-48">
                創業
              </dt>
              <dd className="text-left md:flex-1">2023年12月</dd>
            </div>
            <div className="flex flex-col gap-3 border-t border-white/20 pt-8 first:border-t-0 first:pt-0 md:flex-row md:items-start md:justify-between">
              <dt className="font-semibold uppercase tracking-[0.25em] text-white/70 md:w-48">
                代表
              </dt>
              <dd className="text-left md:flex-1">宮崎悠生</dd>
            </div>
            <div className="flex flex-col gap-3 border-t border-white/20 pt-8 first:border-t-0 first:pt-0 md:flex-row md:items-start md:justify-between">
              <dt className="font-semibold uppercase tracking-[0.25em] text-white/70 md:w-48">
                事業内容
              </dt>
              <dd className="text-left md:flex-1">AI技術を用いた事業開発</dd>
            </div>
            <div className="flex flex-col gap-3 border-t border-white/20 pt-8 first:border-t-0 first:pt-0 md:flex-row md:items-start md:justify-between">
              <dt className="font-semibold uppercase tracking-[0.25em] text-white/70 md:w-48">
                従業員数
              </dt>
              <dd className="text-left md:flex-1">約15名</dd>
            </div>
            <div className="flex flex-col gap-3 border-t border-white/20 pt-8 first:border-t-0 first:pt-0 md:flex-row md:items-start md:justify-between">
              <dt className="font-semibold uppercase tracking-[0.25em] text-white/70 md:w-48">
                資本金
              </dt>
              <dd className="text-left md:flex-1">1,000,000円</dd>
            </div>
            <div className="flex flex-col gap-3 border-t border-white/20 pt-8 first:border-t-0 first:pt-0 md:flex-row md:items-start md:justify-between">
              <dt className="font-semibold uppercase tracking-[0.25em] text-white/70 md:w-48">
                所在地
              </dt>
              <dd className="text-left md:flex-1">
                〒1500043 東京都渋谷区道玄坂 1丁目10番8号渋谷道玄坂東急ビル2F-C
              </dd>
            </div>
          </dl>
          <div className="space-y-3 text-center text-sm font-medium text-white/85 md:text-base">
            <p>メール: contact@atlas.inc</p>
            <p>営業時間: 平日 10:00 - 18:00</p>
          </div>
        </div>
      </div>
      <Footer className="absolute bottom-0 left-0 right-0" />
    </section>
  );
}
