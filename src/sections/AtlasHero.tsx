import Link from "next/link";

export function AtlasHero() {
  return (
    <section
      id="atlas"
      className="relative snap-start snap-always flex min-h-screen min-h-dvh items-end justify-center"
    >
      <div className="flex w-full max-w-4xl flex-col px-6 pb-16 sm:px-8 sm:pb-20 md:px-12 md:pb-24 lg:px-16 lg:pb-32">
        <div className="space-y-6 sm:space-y-8 md:space-y-10">
          <p className="font-serif text-base leading-relaxed text-black sm:text-lg md:text-xl lg:text-2xl">
            <span className="italic">Atlas</span> is a research lab working to shift the power structure of the AI age from corporations back to individuals by building the Memory Layer for AI.
          </p>
          
          <p className="font-serif text-base leading-relaxed text-black sm:text-lg md:text-xl lg:text-2xl">
            We believe your memories belong solely to you. Our researchers, engineers, and designers are inventing the infrastructure that returns data sovereignty to every person.
          </p>
          
          <p className="font-serif text-base leading-relaxed text-black sm:text-lg md:text-xl lg:text-2xl">
            This is the way AI should always have been.
          </p>
        </div>
        
        <div className="mt-4 flex w-full justify-end">
          <Link
            href="/positions#open-roles"
            className="inline-flex items-center gap-2 font-serif text-sm text-[#2a2a2a]/70 transition hover:text-[#2a2a2a] sm:text-base md:text-lg lg:text-xl"
          >
            Join our team
            <span aria-hidden className="text-[#2a2a2a]/50">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
