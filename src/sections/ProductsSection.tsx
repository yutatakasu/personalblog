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
      className="snap-start snap-always flex h-screen items-center justify-center"
    >
      <div className="max-w-4xl mx-auto w-full px-6 py-24">
        <p className="font-mono font-medium capitalize tracking-[0.3em] text-xs md:text-sm text-black/40 mb-14 text-center">
          Products
        </p>
        <h2 className="mt-6 font-serif text-3xl md:text-5xl text-black text-center">
          スケールする AI を支える、3 つのコアプロダクト
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.title}
              className="border border-black/15 p-6 font-sans"
            >
              <h3 className="font-serif text-xl font-semibold text-black">
                {product.title}
              </h3>
              <p className="mt-4 text-sm font-medium text-black/70">
                {product.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
