"use client";

import Link from "next/link";
import { useState } from "react";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import { useRouter } from "next/navigation";

type Position = {
  id: string;
  title: string;
  department: string;
  location: string;
  work_style: string;
  teaser: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  apply_email?: string;
};

export function PositionsList({ positions }: { positions: Position[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("この募集情報を削除してもよろしいですか？")) {
      return;
    }

    setDeletingId(id);
    try {
      const adminSupabase = getAdminSupabaseClient();
      const { error } = await adminSupabase.from("positions").delete().eq("id", id);

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

  if (positions.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center">
        <p className="text-neutral-600">募集情報がありません</p>
        <Link
          href="/admin/positions/new"
          className="mt-4 inline-block text-sm text-neutral-900 underline"
        >
          最初の募集情報を作成する
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <div className="divide-y divide-neutral-200">
        {positions.map((position) => (
          <div key={position.id} className="p-6 hover:bg-neutral-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-lg text-neutral-900">{position.title}</h3>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                    {position.department}
                  </span>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                    {position.work_style}
                  </span>
                </div>
                <p className="mt-1 text-sm text-neutral-600">{position.location}</p>
                <p className="mt-2 text-sm text-neutral-500 line-clamp-2">{position.teaser}</p>
                {position.summary && (
                  <p className="mt-2 text-sm text-neutral-500 line-clamp-2">
                    {position.summary}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                href={`/admin/positions/${position.id}`}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-100"
              >
                編集
              </Link>
              <button
                onClick={() => handleDelete(position.id)}
                disabled={deletingId === position.id}
                className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-700 transition hover:bg-red-50 disabled:opacity-50"
              >
                {deletingId === position.id ? "削除中..." : "削除"}
              </button>
              <Link
                href={`/positions#${position.id}`}
                target="_blank"
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-100"
              >
                プレビュー
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

