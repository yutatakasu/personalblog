import {
  investorGroups,
  newsItems,
  teamMembers,
  type TeamMember,
} from "@/models/about";
import { type CSSProperties } from "react";

type TeamCardProps = {
  member: TeamMember;
  style?: CSSProperties;
};

function TeamCard({ member, style }: TeamCardProps) {
  return (
    <article
      className="flex w-full flex-col items-center gap-4 rounded-[26px] border border-neutral-200 bg-white px-5 pb-5 pt-6 text-center shadow-[0_18px_60px_-40px_rgba(15,23,42,0.35)] transition-transform md:w-[180px]"
      style={style}
    >
      <div className="mx-auto h-36 w-36 overflow-hidden rounded-[24px] border border-neutral-100 bg-neutral-100 object-cover">
        <img
          src={member.imageSrc}
          alt={member.imageAlt ?? `${member.name} portrait`}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-2">
        <p className="font-serif text-xl text-neutral-900">{member.name}</p>
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-neutral-400">
          {member.title}
        </p>
      </div>
    </article>
  );
}

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
            <div className="mt-12 grid gap-6 md:hidden">
              {teamMembers.map((member) => (
                <TeamCard key={member.name} member={member} />
              ))}
            </div>

            <div className="mt-12 hidden md:block">
              <div className="relative mx-auto h-[560px] w-full max-w-5xl">
                {teamMembers.map((member) => (
                  <TeamCard
                    key={member.name}
                    member={member}
                    style={{
                      position: "absolute",
                      top: member.position.top,
                      left: member.position.left,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ))}
              </div>
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
