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
      className="min-h-screen snap-start snap-always flex flex-col justify-center px-6 py-24"
    >
      <div className="max-w-4xl mx-auto w-full">
        <p className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm text-black/40">
          Careers
        </p>
        <div className="mt-6 flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <h2 className="font-serif text-3xl md:text-5xl text-black max-w-xl">
            AI
            時代のオペレーティングシステムを、ともに創る仲間を募集しています。
          </h2>
          <a
            href="#contact"
            className="self-start border border-black px-5 py-3 text-sm uppercase tracking-[0.2em] transition-colors hover:bg-black hover:text-white"
          >
            View Open Roles
          </a>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {openings.map((role) => (
            <div key={role.title} className="border border-black/15 p-5">
              <h3 className="font-serif text-xl text-black">{role.title}</h3>
              <p className="mt-2 text-sm text-black/60">{role.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
