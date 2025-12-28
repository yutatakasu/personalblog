import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getNewsItemById } from "@/models/news";
import type { ContentBlock } from "@/models";

type Params = Promise<{ id: string }>;

function formatDate(dateString: string): string {
  const normalized = dateString.replace(/[./]/g, "-");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ContentBlockView({ block }: { block: ContentBlock }) {
  return (
    <div className="space-y-4">
      {block.title && (
        <h2 className="text-xl font-semibold text-neutral-900">{block.title}</h2>
      )}
      {block.text && (
        <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
          {block.text}
        </p>
      )}
      {block.images.length > 0 && (
        <div className="space-y-4">
          {block.images.map((image, index) => (
            <figure key={`${image.src}-${index}`} className="my-6">
              <Image
                src={image.src}
                alt={image.alt}
                width={800}
                height={450}
                className="rounded-lg w-full h-auto"
              />
              {image.alt && (
                <figcaption className="mt-2 text-center text-sm text-neutral-500">
                  {image.alt}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function PostPage({ params }: { params: Params }) {
  const { id } = await params;
  const post = await getNewsItemById(id);

  if (!post || post.status !== "published") {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200">
        <div className="mx-auto max-w-2xl px-6 py-4">
          <Link
            href="/"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            ← ブログに戻る
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 text-sm text-neutral-500 mb-4">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.category && (
                <>
                  <span className="text-neutral-300">•</span>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                    {post.category}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-3xl font-bold text-neutral-900">{post.title}</h1>
            {post.subtitle && (
              <p className="mt-2 text-lg text-neutral-600">{post.subtitle}</p>
            )}
          </header>

          {post.thumbnailSrc && (
            <div className="mb-8">
              <Image
                src={post.thumbnailSrc}
                alt={post.thumbnailAlt}
                width={800}
                height={450}
                className="rounded-lg w-full h-auto"
                priority
              />
            </div>
          )}

          <div className="prose prose-neutral max-w-none space-y-8">
            {post.content.map((block, index) => (
              <ContentBlockView key={index} block={block} />
            ))}
          </div>
        </article>
      </main>

      <footer className="border-t border-neutral-200 mt-12">
        <div className="mx-auto max-w-2xl px-6 py-6 text-center text-sm text-neutral-500">
          <Link
            href="/"
            className="text-neutral-900 hover:underline"
          >
            ← ブログに戻る
          </Link>
        </div>
      </footer>
    </div>
  );
}
