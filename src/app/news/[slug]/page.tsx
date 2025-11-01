import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getNewsItemById, newsItems } from "@/models/news";

type NewsDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return newsItems.map((item) => ({ slug: item.id }));
}

export function generateMetadata({ params }: NewsDetailPageProps) {
  const item = getNewsItemById(params.slug);

  if (!item) {
    return {};
  }

  return {
    title: `${item.title} | Atlas News`,
    description: item.summary,
  };
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const item = getNewsItemById(params.slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-svh bg-white text-neutral-900">
      <section className="px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-0 lg:py-28">
        <div className="mx-auto w-full max-w-3xl px-0 lg:px-12">
          <nav aria-label="パンくずリスト" className="text-sm text-neutral-500">
            <Link
              href="/news"
              className="underline-offset-4 hover:underline"
            >
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
          <article className="mt-12 space-y-6 text-neutral-700">
            {item.summary ? (
              <p className="text-base leading-relaxed">
                {item.summary}
              </p>
            ) : null}
            <p className="text-base leading-relaxed">
              Atlas は Memory as a Service の提供を通じて、企業の意思決定を加速させるプラットフォームを構築しています。本記事の詳細は現在準備中ですが、最新情報は順次更新してまいります。
            </p>
            <p className="text-base leading-relaxed">
              詳細については、お問い合わせフォームまたはパートナーチームまでご連絡ください。
            </p>
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

