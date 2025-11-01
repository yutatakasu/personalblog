export function AboutSection() {
  return (
    <section
      id="about"
      className="relative snap-start snap-always flex h-screen items-center justify-center text-white"
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/members_far_from.jpg"
          alt="Atlas team"
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-black/55 backdrop-blur-md"
          aria-hidden
        />
      </div>
      <div className="relative z-10 w-full px-6 py-24 md:py-32">
        <div className="max-w-3xl text-center mx-auto">
          <p className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm text-white/60 mb-14">
            About
          </p>
          <h2 className="mt-6 font-serif text-3xl md:text-5xl">
            Atlas は、AI
            と人の協働を前提としたオペレーティングモデルを提供します。
          </h2>
          <p className="mt-10 text-sm md:text-base text-white/75 leading-relaxed">
            分散した知識、複雑化したプロセス、そして変化の激しい市場環境。Atlas
            は、これらの課題に対して「観測・予測・実行」をつなぐワークフローを再設計し、チーム全体の意思決定を加速させます。
          </p>
        </div>
      </div>
    </section>
  );
}
