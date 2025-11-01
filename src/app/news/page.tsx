import Image from "next/image";
import Link from "next/link";

import { newsItems } from "@/models/news";

export default function NewsPage() {
  return (
    <main className="min-h-svh bg-white text-neutral-900">
      <section className="px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-0 lg:py-28">
        <div className="mx-auto w-full max-w-4xl px-0 lg:px-12">
          <p className="font-mono uppercase tracking-[0.3em] text-[0.65rem] text-neutral-400 sm:text-xs">
            News
          </p>
          <h1 className="mt-6 font-serif text-2xl leading-snug sm:text-3xl md:text-5xl md:leading-[1.1]">
            Atlas のアップデートとパートナーシップのお知らせ
          </h1>
          <div className="mt-12 space-y-6">
            {newsItems.map((news) => (
              <article
                key={news.id}
                id={news.id}
                className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 transition hover:border-neutral-300"
              >
                <Link
                  href={news.link}
                  className="block h-full w-full"
                  prefetch={false}
                >
                  <div className="grid gap-6 p-6 sm:grid-cols-[minmax(0,160px)_1fr] sm:p-8">
                    <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:h-full">
                      <Image
                        src={news.thumbnailSrc}
                        alt={news.thumbnailAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, 160px"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col justify-center gap-3">
                      <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
                        {news.date}
                      </span>
                      <h2 className="font-serif text-xl leading-snug text-neutral-900 sm:text-2xl">
                        {news.title}
                      </h2>
                      {news.summary ? (
                        <p className="text-sm leading-relaxed text-neutral-600">
                          {news.summary}
                        </p>
                      ) : null}
                      <span className="text-sm font-medium text-neutral-600">
                        続きを読む
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
