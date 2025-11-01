export function AboutSection() {
  return (
    <section
      id="about"
      className="bg-black text-white min-h-screen flex flex-col items-center justify-center snap-start snap-always"
    >
      <div className="max-w-3xl mx-auto text-center py-20 md:py-32">
        <p className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm text-white/50 mb-14">
          About
        </p>
        <h2 className="mt-6 font-serif text-3xl md:text-5xl">
          Atlas は、AI
          と人の協働を前提としたオペレーティングモデルを提供します。
        </h2>
        <p className="mt-8 text-sm md:text-base text-white/70 leading-relaxed">
          分散した知識、複雑化したプロセス、そして変化の激しい市場環境。Atlas
          は、これらの課題に対して「観測・予測・実行」をつなぐワークフローを再設計し、チーム全体の意思決定を加速させます。
        </p>
      </div>
    </section>
  );
}
