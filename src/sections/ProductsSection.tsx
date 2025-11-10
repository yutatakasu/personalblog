const productPositions = [
  { column: 1, row: 1, offsetY: "-20px" },
  { column: 2, row: 2, offsetY: "-60px" },
  { column: 3, row: 1, offsetY: "-40px" },
];

function ProductItem({
  index,
  position,
}: {
  index: number;
  position?: { column: number; row: number; offsetY: string };
}) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={
        position
          ? {
              gridColumnStart: position.column,
              gridRowStart: position.row,
              marginTop: position.offsetY,
            }
          : undefined
      }
    >
      <div className="flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24">
        <div className="flex flex-col items-center justify-center gap-2 text-[#2a2a2a]/40">
          <span className="text-4xl font-light sm:text-5xl md:text-6xl">?</span>
          <span className="font-mono text-[0.5rem] uppercase tracking-[0.3em] sm:text-[0.55rem] md:text-xs">
            coming soon...
          </span>
        </div>
      </div>
    </div>
  );
}

export function ProductsSection() {
  return (
    <section
      id="products"
      className="snap-start snap-always flex min-h-screen items-start justify-center bg-[#f8f7f4] md:items-center"
    >
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-10 lg:py-20 xl:py-28 2xl:py-32">
        <p className="mb-4 text-center font-mono font-medium capitalize tracking-[0.25em] text-[0.6rem] text-[#2a2a2a]/40 sm:mb-6 sm:text-[0.65rem] sm:tracking-[0.3em] md:mb-8 md:text-xs lg:mb-10 lg:text-sm xl:mb-12 xl:text-sm">
          Products
        </p>
        <h2 className="mt-2 text-center font-serif text-xl leading-snug text-[#2a2a2a] sm:mt-3 sm:text-2xl md:mt-4 md:text-3xl lg:mt-6 lg:text-5xl lg:leading-[1.1]">
          スケールする AI を支える、3 つのコアプロダクト
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-6 sm:mt-8 sm:gap-8 md:mt-10 md:gap-10 lg:hidden">
          {[1, 2, 3].map((index) => (
            <ProductItem key={index} index={index} />
          ))}
        </div>
        <div className="mt-6 hidden w-full lg:grid lg:mt-12 xl:mt-14 grid-cols-3 grid-rows-2 gap-x-16 gap-y-12 xl:gap-x-20 xl:gap-y-14 justify-items-center">
          {[1, 2, 3].map((index, i) => (
            <ProductItem
              key={index}
              index={index}
              position={productPositions[i]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
