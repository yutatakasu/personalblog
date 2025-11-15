const productPositions = [
  { column: 1, row: 1, offsetY: "-20px" },
  { column: 2, row: 2, offsetY: "-60px" },
  { column: 3, row: 1, offsetY: "-40px" },
];

const SECTION_CONTENT_OFFSET = "pt-32 sm:pt-40 md:pt-44 lg:pt-48";
const SECTION_HEADING_CLASS =
  "font-serif text-[1.5rem] leading-tight sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] lg:leading-[1.1]";

const productMobileLayoutClasses = [
  "-mt-1 sm:mt-0 justify-self-start",
  "mt-10 sm:mt-12 justify-self-end",
  "col-span-2 mt-6 sm:mt-8 justify-self-center",
];

function ProductItem({
  position,
  className,
}: {
  position?: { column: number; row: number; offsetY: string };
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${className ?? ""}`}
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
      className="relative snap-start snap-always flex min-h-screen min-h-dvh justify-center bg-background"
    >
      <div
        className={`flex w-full justify-center px-6 pb-12 sm:px-6 sm:pb-16 md:px-8 md:pb-20 lg:px-10 lg:pb-24 xl:pb-32 2xl:pb-36 ${SECTION_CONTENT_OFFSET}`}
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-6 text-left sm:gap-8 md:gap-10">
          <h2
            className={`mb-8 text-[#2a2a2a] ${SECTION_HEADING_CLASS} sm:mb-10 md:mb-12 lg:mb-16`}
          >
            スケールするAIを支えるAtlasのコア技術
          </h2>
          <div className="grid w-full grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:hidden">
            {[1, 2, 3].map((index, mobileIndex) => (
              <ProductItem
                key={index}
                className={productMobileLayoutClasses[mobileIndex]}
              />
            ))}
          </div>
          <div className="hidden w-full lg:grid lg:grid-cols-3 lg:grid-rows-2 lg:gap-x-16 lg:gap-y-12 xl:gap-x-20 xl:gap-y-14">
            {[1, 2, 3].map((index, i) => (
              <ProductItem key={index} position={productPositions[i]} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
