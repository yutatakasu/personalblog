const products = [
  {
    title: "Atlas OS",
    description:
      "企業全体でエージェントを統合するオペレーティングレイヤー。権限管理と知識共有を一元化します。",
  },
  {
    title: "Atlas Studio",
    description:
      "ノーコードで業務特化の AI エージェントを設計・デプロイできるビルダー。リアルタイム監視と継続学習に対応。",
  },
  {
    title: "Atlas Insights",
    description:
      "組織データを横断的に分析し、意思決定のトリガーとなるインサイトを通知します。",
  },
];

export function ProductsSection() {
  return (
    <section
      id="products"
      className="snap-start snap-always flex min-h-svh items-center justify-center"
    >
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:py-20 xl:py-24">
        <p className="mb-6 text-left font-mono font-medium capitalize tracking-[0.25em] text-[0.6rem] text-black/40 sm:mb-8 sm:text-[0.65rem] sm:tracking-[0.3em] md:mb-10 md:text-xs lg:mb-12 xl:mb-14 xl:text-sm">
          Products
        </p>
        <h2 className="mt-2 text-left font-serif text-xl text-black sm:mt-3 sm:text-2xl md:mt-4 md:text-3xl lg:mt-6 lg:text-5xl">
          スケールする AI を支える、3 つのコアプロダクト
        </h2>
        <div className="mt-6 grid gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-6 md:mt-10 md:gap-8 lg:mt-12 lg:grid-cols-3 lg:gap-10">
          {products.map((product) => (
            <div
              key={product.title}
              className="border border-black/15 p-4 font-sans sm:p-5 md:p-6"
            >
              <h3 className="font-serif text-base font-semibold text-black sm:text-lg md:text-xl">
                {product.title}
              </h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-black/70 sm:mt-3 sm:text-sm md:mt-4">
                {product.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
