import Link from "next/link";
import { PositionsList } from "@/components/admin/PositionsList";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

export default async function AdminPositionsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: positions, error } = await supabase
    .from("positions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching positions:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-neutral-900">募集情報管理</h1>
          <p className="mt-2 text-sm text-neutral-600">
            採用ポジションの追加・編集・削除ができます
          </p>
        </div>
        <Link
          href="/admin/positions/new"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          + 新規作成
        </Link>
      </div>

      <PositionsList positions={positions || []} />
    </div>
  );
}

