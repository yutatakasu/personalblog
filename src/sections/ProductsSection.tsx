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
      <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-8 sm:py-20 md:py-24">
        <p className="mb-10 text-center font-mono font-medium capitalize tracking-[0.3em] text-[0.65rem] text-black/40 sm:mb-12 sm:text-xs md:mb-14 md:text-sm">
          Products
        </p>
        <h2 className="mt-4 text-center font-serif text-2xl text-black sm:mt-6 sm:text-3xl md:text-5xl">
          スケールする AI を支える、3 つのコアプロダクト
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 md:mt-12 md:grid-cols-3 md:gap-10">
          {products.map((product) => (
            <div
              key={product.title}
              className="border border-black/15 p-5 font-sans sm:p-6"
            >
              <h3 className="font-serif text-lg font-semibold text-black sm:text-xl">
                {product.title}
              </h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-black/70 sm:mt-4">
                {product.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
