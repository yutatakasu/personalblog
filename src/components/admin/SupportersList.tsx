"use client";

import Link from "next/link";
import { useState } from "react";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import { useRouter } from "next/navigation";

type SupporterGroup = {
  id: number;
  category: string;
  supporters: string[];
};

export function SupportersList({ supporterGroups }: { supporterGroups: SupporterGroup[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("このサポーターグループを削除してもよろしいですか？")) {
      return;
    }

    setDeletingId(id);
    try {
      const adminSupabase = getAdminSupabaseClient();
      const { error } = await adminSupabase.from("investor_groups").delete().eq("id", id);

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

  if (supporterGroups.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center">
        <p className="text-neutral-600">サポーターグループがありません</p>
        <Link
          href="/admin/supporters/new"
          className="mt-4 inline-block text-sm text-neutral-900 underline"
        >
          最初のサポーターグループを追加する
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <div className="divide-y divide-neutral-200">
        {supporterGroups.map((group) => (
          <div key={group.id} className="p-6 hover:bg-neutral-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-serif text-lg text-neutral-900">{group.category}</h3>
                <div className="mt-2">
                  <p className="text-sm text-neutral-600">
                    {group.supporters.length} 名のサポーター
                  </p>
                  <ul className="mt-2 space-y-1">
                    {group.supporters.map((supporter, index) => (
                      <li key={index} className="text-sm text-neutral-500">
                        • {supporter}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                href={`/admin/supporters/${group.id}`}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-100"
              >
                編集
              </Link>
              <button
                onClick={() => handleDelete(group.id)}
                disabled={deletingId === group.id}
                className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-700 transition hover:bg-red-50 disabled:opacity-50"
              >
                {deletingId === group.id ? "削除中..." : "削除"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

