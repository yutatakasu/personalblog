import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { getNewsItems } from "@/models/news";
import type { NewsItem } from "@/models";

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

function PostCard({ post }: { post: NewsItem }) {
  return (
    <article className="group border-b border-neutral-200 py-6 first:pt-0 last:border-0">
      <Link href={`/posts/${post.id}`} className="block">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-sm text-neutral-500">
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
          <h2 className="text-xl font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors">
            {post.title}
          </h2>
          {post.summary && (
            <p className="text-neutral-600 line-clamp-2">{post.summary}</p>
          )}
        </div>
      </Link>
    </article>
  );
}

export default async function Home() {
  noStore();
  const allPosts = await getNewsItems();

  // 公開済みの記事のみ表示
  const publishedPosts = allPosts.filter((post) => post.status === "published");

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200">
        <div className="mx-auto max-w-2xl px-6 py-8">
          <h1 className="text-2xl font-bold text-neutral-900">My Blog</h1>
          <p className="mt-1 text-neutral-500">Personal thoughts and writings</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        {publishedPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">まだ記事がありません。</p>
            <p className="mt-2 text-sm text-neutral-400">
              管理画面から記事を作成してください。
            </p>
            <Link
              href="/admin"
              className="mt-4 inline-block rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              管理画面へ
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {publishedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-200 mt-auto">
        <div className="mx-auto max-w-2xl px-6 py-6 text-center text-sm text-neutral-500">
          <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
