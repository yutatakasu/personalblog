export function ContactSection() {
  return (
    <section
      id="contact"
      className="min-h-screen snap-start snap-always flex flex-col justify-center px-6 py-24"
    >
      <div className="max-w-3xl mx-auto w-full text-center">
        <p className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm text-neutral-400">
          Contact
        </p>
        <h2 className="mt-6 font-serif text-3xl md:text-5xl text-neutral-900">
          パートナーシップ、導入相談、デモリクエストを受け付けています。
        </h2>
        <div className="mt-10 space-y-4 text-sm md:text-base text-neutral-600">
          <p>メール: contact@atlas.inc</p>
          <p>所在地: 東京都渋谷区 XX-XX-XX</p>
          <p>営業時間: 平日 10:00 - 18:00</p>
        </div>
      </div>
    </section>
  );
}
