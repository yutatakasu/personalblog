import { investorGroups, newsItems, teamMembers } from "@/models/about";

export function AboutSection() {
  return (
    <>
      <section
        id="about"
        className="relative snap-start snap-always flex h-screen items-center justify-center text-white"
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/members_far_from.jpg"
            alt="Atlas team"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            aria-hidden
          />
        </div>
        <div className="relative z-10 w-full px-6 py-24 md:py-32">
          <div className="max-w-3xl text-center mx-auto">
            <p className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm text-white/60 mb-14">
              About
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight space-y-4">
              <span className="block">
                誰もが長期記憶を保持したAIサービスを作れるような、記憶レイヤーを普及させよう。
              </span>
              <span className="block">
                Atlasは Memory as a Service の会社になります。
              </span>
            </h2>
            <p className="mt-10 text-sm md:text-base text-white/75 leading-relaxed">
              分散した知識、複雑化したプロセス、そして変化の激しい市場環境。Atlas
              は、これらの課題に対して「観測・予測・実行」をつなぐワークフローを再設計し、チーム全体の意思決定を加速させます。
            </p>
          </div>
        </div>
      </section>

      <section
        id="about-team"
        className="snap-start snap-always flex h-screen items-center justify-center bg-white text-neutral-900"
      >
        <div className="w-full px-6 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm text-neutral-400 mb-14">
              Team
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight text-neutral-900">
              記憶レイヤーの実装と運用を専門とするクロスファンクショナルなチームです。
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={member.imageSrc}
                      alt={member.imageAlt ?? `${member.name} portrait`}
                      className="h-14 w-14 flex-shrink-0 rounded-full border border-neutral-200 bg-white object-cover"
                    />
                    <div>
                      <p className="font-serif text-xl md:text-2xl text-neutral-900">
                        {member.name}
                      </p>
                      <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
                        {member.title}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
                    {member.focus}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="about-backed"
        className="snap-start snap-always flex h-screen items-center justify-center text-neutral-900"
      >
        <div className="max-w-5xl mx-auto w-full px-6 py-24 md:py-32">
          <p className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm text-neutral-400 mb-14">
            We Are Backed By
          </p>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight text-neutral-900">
            信頼できるパートナーとともに、Atlas
            の記憶レイヤーは産業全体へと浸透します。
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {investorGroups.map((group) => (
              <div
                key={group.category}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6"
              >
                <h3 className="font-serif text-lg text-neutral-900">
                  {group.category}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-neutral-600">
                  {group.supporters.map((supporter) => (
                    <li key={supporter} className="leading-relaxed">
                      {supporter}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="about-news"
        className="snap-start snap-always flex h-screen items-center justify-center text-neutral-900"
      >
        <div className="max-w-4xl mx-auto w-full px-6 py-24 md:py-32">
          <p className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm text-neutral-400 mb-14">
            Current News
          </p>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight text-neutral-900">
            プロダクトの進化とパートナーシップの最新情報をお届けします。
          </h2>
          <div className="mt-12 space-y-8">
            {newsItems.map((news) => (
              <article
                key={news.headline}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
                    {news.date}
                  </span>
                  <h3 className="font-serif text-2xl text-neutral-900 md:max-w-xl">
                    {news.headline}
                  </h3>
                </div>
                <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
                  {news.summary}
                </p>
                <span className="mt-5 inline-block font-mono text-[0.7rem] uppercase tracking-[0.4em] text-neutral-400">
                  {news.tag}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
