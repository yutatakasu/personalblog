import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getNewsItemById, getNewsItems } from "@/models/news";

type NewsDetailPageParams = {
  slug: string;
};

export async function generateStaticParams() {
  const newsItems = await getNewsItems();
  return newsItems.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<NewsDetailPageParams>;
}) {
  const { slug } = await params;
  const item = await getNewsItemById(slug);

  if (!item) {
    return {};
  }

  return {
    title: `${item.title} | Atlas News`,
    description: item.summary,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<NewsDetailPageParams>;
}) {
  const { slug } = await params;
  const item = await getNewsItemById(slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-svh bg-white text-neutral-900">
      <section className="px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-0 lg:py-28">
        <div className="mx-auto w-full max-w-3xl px-0 lg:px-12">
          <nav aria-label="パンくずリスト" className="text-sm text-neutral-500">
            <Link href="/news" className="underline-offset-4 hover:underline">
              News
            </Link>
            <span className="mx-2">/</span>
            <span aria-current="page" className="text-neutral-700">
              {item.title}
            </span>
          </nav>
          <header className="mt-8 space-y-4">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
              {item.date}
            </span>
            <h1 className="font-serif text-3xl leading-tight text-neutral-900 sm:text-4xl">
              {item.title}
            </h1>
            {item.subtitle && (
              <p className="text-lg text-neutral-600">{item.subtitle}</p>
            )}
            {item.tag ? (
              <span className="inline-block rounded-full border border-neutral-200 px-3 py-1 text-xs uppercase tracking-[0.3em] text-neutral-500">
                {item.tag}
              </span>
            ) : null}
          </header>
          <div className="mt-10 overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100">
            <div className="relative h-64 w-full sm:h-80">
              <Image
                src={item.thumbnailSrc}
                alt={item.thumbnailAlt}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
          <article className="mt-12 space-y-12 text-neutral-700">
            {item.content.map((block, index) => {
              const blockKey =
                block.image?.src ??
                `${block.title}-${block.text.slice(0, 24)}-${index}`;
              return (
                <section key={blockKey} className="space-y-6">
                  {block.title.trim().length > 0 ? (
                    <header>
                      <h2 className="font-serif text-2xl leading-snug text-neutral-900 sm:text-3xl">
                        {block.title}
                      </h2>
                    </header>
                  ) : null}
                  {block.text.trim().length > 0 ? (
                    <p className="text-base leading-relaxed">{block.text}</p>
                  ) : null}
                  {block.image ? (
                    <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100">
                      <div className="relative h-64 w-full sm:h-80">
                        <Image
                          src={block.image.src}
                          alt={block.image.alt}
                          fill
                          sizes="100vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ) : null}
                </section>
              );
            })}
          </article>
          <div className="mt-12">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-800"
            >
              &larr; ニュース一覧へ戻る
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
