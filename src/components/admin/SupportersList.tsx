"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import { normalizeSupporters } from "@/lib/supporters/normalize";

type Supporter = {
  name: string;
  focus?: string;
  imageSrc?: string;
};

type SupporterGroup = {
  id: number;
  category: string;
  supporters: Supporter[];
};

type SupporterGroupInput = {
  id: number;
  category: string;
  supporters: unknown;
};

export function SupportersList({
  supporterGroups,
}: {
  supporterGroups: SupporterGroupInput[];
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("このサポーターグループを削除してもよろしいですか？")) {
      return;
    }

    setDeletingId(id);
    try {
      const adminSupabase = getAdminSupabaseClient();
      const { error } = await adminSupabase
        .from("investor_groups")
        .delete()
        .eq("id", id);

      if (error) {
        alert(`削除に失敗しました: ${error.message}`);
        return;
      }

      router.refresh();
    } catch (_err) {
      alert("削除に失敗しました");
    } finally {
      setDeletingId(null);
    }
  };

  const groups: SupporterGroup[] = supporterGroups.map((group) => ({
    id: group.id,
    category: group.category,
    supporters: normalizeSupporters(group.supporters).map((supporter) => ({
      name: supporter.name,
      focus: supporter.focus ?? undefined,
      imageSrc: supporter.image_src ?? undefined,
    })),
  }));

  if (groups.length === 0) {
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
        {groups.map((group) => (
          <div key={group.id} className="p-6 hover:bg-neutral-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-serif text-lg text-neutral-900">
                  {group.category}
                </h3>
                <div className="mt-3 space-y-4">
                  {group.supporters.map((supporter, index) => {
                    const displaySupporter = supporter;
                    return (
                      <div
                        key={`${displaySupporter.name}-${index}`}
                        className="flex gap-4"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
                          {displaySupporter.imageSrc ? (
                            <Image
                              src={displaySupporter.imageSrc}
                              alt={displaySupporter.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                              unoptimized={displaySupporter.imageSrc.startsWith(
                                "http",
                              )}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                              {displaySupporter.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {displaySupporter.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {group.category}
                          </p>
                          {displaySupporter.focus ? (
                            <p className="mt-1 text-xs text-neutral-500">
                              {displaySupporter.focus}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
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
                type="button"
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
