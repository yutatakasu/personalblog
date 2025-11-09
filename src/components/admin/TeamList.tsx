"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import { useRouter } from "next/navigation";

type TeamMember = {
  id: string;
  name: string;
  title: string;
  focus: string;
  image_src: string;
  image_alt?: string;
  position_row: number;
  position_column: number;
  position_offset_y?: string;
};

export function TeamList({ teamMembers }: { teamMembers: TeamMember[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("このチームメンバーを削除してもよろしいですか？")) {
      return;
    }

    setDeletingId(id);
    try {
      const adminSupabase = getAdminSupabaseClient();
      const { error } = await adminSupabase.from("team_members").delete().eq("id", id);

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

  if (teamMembers.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center">
        <p className="text-neutral-600">チームメンバーがありません</p>
        <Link
          href="/admin/team/new"
          className="mt-4 inline-block text-sm text-neutral-900 underline"
        >
          最初のメンバーを追加する
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <div className="divide-y divide-neutral-200">
        {teamMembers.map((member) => (
          <div key={member.id} className="p-6 hover:bg-neutral-50">
            <div className="flex items-start gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
                <Image
                  src={member.image_src}
                  alt={member.image_alt || member.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-lg text-neutral-900">{member.name}</h3>
                    <p className="mt-1 text-sm font-medium text-neutral-600">{member.title}</p>
                    <p className="mt-2 text-sm text-neutral-500 line-clamp-2">{member.focus}</p>
                    <p className="mt-2 text-xs text-neutral-400">
                      位置: 行 {member.position_row}, 列 {member.position_column}
                      {member.position_offset_y && `, オフセット: ${member.position_offset_y}`}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/admin/team/${member.id}`}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-100"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => handleDelete(member.id)}
                    disabled={deletingId === member.id}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === member.id ? "削除中..." : "削除"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

