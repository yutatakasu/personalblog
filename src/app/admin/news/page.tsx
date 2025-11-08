import Link from "next/link";
import { adminSupabase } from "@/lib/supabase/admin";
import { NewsList } from "@/components/admin/NewsList";

export default async function AdminNewsPage() {
  const { data: newsItems, error } = await adminSupabase
    .from("news")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching news:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-neutral-900">ニュース管理</h1>
          <p className="mt-2 text-sm text-neutral-600">
            ニュース記事の追加・編集・削除ができます
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          + 新規作成
        </Link>
      </div>

      <NewsList newsItems={newsItems || []} />
    </div>
  );
}

