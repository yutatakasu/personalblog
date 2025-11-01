const openings = [
  {
    title: "AI Systems Engineer",
    location: "Tokyo / Remote",
  },
  {
    title: "Product Designer",
    location: "Tokyo / Remote",
  },
  {
    title: "Solutions Architect",
    location: "Tokyo / Remote",
  },
];

export function CareersSection() {
  return (
    <section
      id="careers"
      className="snap-start snap-always flex min-h-svh items-center justify-center"
    >
      <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-8 sm:py-20 md:py-24">
        <p className="mb-10 font-mono uppercase tracking-[0.3em] text-[0.65rem] text-black/40 sm:mb-12 sm:text-xs md:mb-14 md:text-sm">
          Careers
        </p>
        <div className="mt-4 flex flex-col gap-8 md:mt-6 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-xl font-serif text-2xl text-black sm:text-3xl md:text-5xl">
            Atlasが目指すのは誰もがその人らしく働ける社会。
            ミッション・バリューへの共感を何よりも大切に考え、
            一緒に働くメンバーを探しています。
          </h2>
          <a
            href="#contact"
            className="self-start border border-black px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors hover:bg-black hover:text-white sm:px-5 sm:py-3 sm:text-sm"
          >
            View Open Roles
          </a>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:mt-12 md:grid-cols-3">
          {openings.map((role) => (
            <div key={role.title} className="border border-black/15 p-5">
              <h3 className="font-serif text-lg text-black sm:text-xl">
                {role.title}
              </h3>
              <p className="mt-2 text-sm text-black/60">{role.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
