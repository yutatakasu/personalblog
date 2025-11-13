const productPositions = [
  { column: 1, row: 1, offsetY: "-20px" },
  { column: 2, row: 2, offsetY: "-60px" },
  { column: 3, row: 1, offsetY: "-40px" },
];

const SECTION_LABEL_POSITION =
  "pointer-events-none absolute left-12 sm:left-44 md:left-52 lg:left-60 top-16 sm:top-24 md:top-28 lg:top-32";
const SECTION_LABEL_SHARED_CLASSES =
  "font-mono font-medium capitalize tracking-[0.25em] text-[0.6rem] sm:text-[0.65rem] sm:tracking-[0.3em] md:text-xs lg:text-base xl:text-lg";
const SECTION_CONTENT_OFFSET = "pt-32 sm:pt-40 md:pt-44 lg:pt-48";

const productMobileLayoutClasses = [
  "-mt-1 sm:mt-0 justify-self-start",
  "mt-10 sm:mt-12 justify-self-end",
  "col-span-2 mt-6 sm:mt-8 justify-self-center",
];

function ProductItem({
  index,
  position,
  className,
}: {
  index: number;
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
      <p
        className={`${SECTION_LABEL_POSITION} ${SECTION_LABEL_SHARED_CLASSES} text-[#2a2a2a]/40`}
      >
        Products
      </p>
      <div
        className={`flex w-full justify-center px-4 pb-8 sm:px-6 sm:pb-12 md:px-8 md:pb-16 lg:px-10 lg:pb-20 xl:pb-28 2xl:pb-32 ${SECTION_CONTENT_OFFSET}`}
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-6 text-left sm:gap-8 md:gap-10">
          <h2 className="mb-8 font-serif text-base leading-snug text-[#2a2a2a] sm:mb-10 sm:text-lg md:mb-12 md:text-xl lg:mb-16 lg:text-[2.75rem] lg:leading-[1.1] xl:text-[3.25rem]">
            スケールするAIを支えるAtlasのコア技術
          </h2>
          <div className="grid w-full grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:hidden">
            {[1, 2, 3].map((index, mobileIndex) => (
              <ProductItem
                key={index}
                index={index}
                className={productMobileLayoutClasses[mobileIndex]}
              />
            ))}
          </div>
          <div className="hidden w-full lg:grid lg:grid-cols-3 lg:grid-rows-2 lg:gap-x-16 lg:gap-y-12 xl:gap-x-20 xl:gap-y-14">
            {[1, 2, 3].map((index, i) => (
              <ProductItem
                key={index}
                index={index}
                position={productPositions[i]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
