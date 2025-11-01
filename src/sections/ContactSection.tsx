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
        <div className="mx-auto w-full max-w-5xl text-white">
          <div className="text-center md:text-left">
            <p className="font-mono uppercase tracking-[0.3em] text-xs font-medium text-white/70 md:text-sm">
              Contact
            </p>
            <h2 className="mt-6 font-serif text-3xl leading-tight md:text-5xl">
              Company Information
            </h2>
          </div>
          <dl className="mt-16 border-t border-white/20 text-sm font-medium md:text-base">
            <div className="grid gap-4 border-b border-white/20 py-6 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.25em] text-white/60">
                会社名
              </dt>
              <dd className="leading-relaxed">
                Atlas株式会社（英字表記：Atlas Inc. / 読み：アトラス）
              </dd>
            </div>
            <div className="grid gap-4 border-b border-white/20 py-6 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.25em] text-white/60">
                創業
              </dt>
              <dd className="leading-relaxed">2023年12月</dd>
            </div>
            <div className="grid gap-4 border-b border-white/20 py-6 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.25em] text-white/60">
                代表
              </dt>
              <dd className="leading-relaxed">宮崎悠生</dd>
            </div>
            <div className="grid gap-4 border-b border-white/20 py-6 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.25em] text-white/60">
                事業内容
              </dt>
              <dd className="leading-relaxed">AI技術を用いた事業開発</dd>
            </div>
            <div className="grid gap-4 border-b border-white/20 py-6 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.25em] text-white/60">
                従業員数
              </dt>
              <dd className="leading-relaxed">約15名</dd>
            </div>
            <div className="grid gap-4 border-b border-white/20 py-6 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.25em] text-white/60">
                資本金
              </dt>
              <dd className="leading-relaxed">1,000,000円</dd>
            </div>
            <div className="grid gap-4 py-6 md:grid-cols-[180px_1fr]">
              <dt className="font-semibold uppercase tracking-[0.25em] text-white/60">
                所在地
              </dt>
              <dd className="leading-relaxed">
                〒1500043 東京都渋谷区道玄坂 1丁目10番8号渋谷道玄坂東急ビル2F-C
              </dd>
            </div>
          </dl>
          <div className="mt-16 space-y-3 text-sm font-medium text-white/85 md:text-base">
            <p>
              メール:
              <a
                href="mailto:contact@atlas.inc"
                className="underline decoration-white/60 decoration-dotted underline-offset-4 hover:decoration-white"
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
