"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { adminSupabase } from "@/lib/supabase/admin";
import { useRouter } from "next/navigation";

type NewsItem = {
  id: string;
  title: string;
  date: string;
  thumbnail_src: string;
  thumbnail_alt: string;
  link: string;
  summary?: string;
  tag?: string;
};

export function NewsList({ newsItems }: { newsItems: NewsItem[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("このニュース記事を削除してもよろしいですか？")) {
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await adminSupabase.from("news").delete().eq("id", id);

      if (error) {
        alert("削除に失敗しました: " + error.message);
        return;
      }

      router.refresh();
    } catch (err) {
      alert("削除に失敗しました");
    } finally {
      setDeletingId(null);
    }
  };

  if (newsItems.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center">
        <p className="text-neutral-600">ニュース記事がありません</p>
        <Link
          href="/admin/news/new"
          className="mt-4 inline-block text-sm text-neutral-900 underline"
        >
          最初の記事を作成する
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <div className="divide-y divide-neutral-200">
        {newsItems.map((item) => (
          <div key={item.id} className="p-6 hover:bg-neutral-50">
            <div className="flex items-start gap-4">
              <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                <Image
                  src={item.thumbnail_src}
                  alt={item.thumbnail_alt}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-lg text-neutral-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">
                      {item.date} {item.tag && `・ ${item.tag}`}
                    </p>
                    {item.summary && (
                      <p className="mt-2 text-sm text-neutral-500 line-clamp-2">
                        {item.summary}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/admin/news/${item.id}`}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-100"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === item.id ? "削除中..." : "削除"}
                  </button>
                  <Link
                    href={item.link}
                    target="_blank"
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-100"
                  >
                    プレビュー
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

