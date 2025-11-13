import Link from "next/link";
import { SupportersList } from "@/components/admin/SupportersList";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

export default async function AdminSupportersPage() {
  const supabase = await createServerSupabaseClient();
  const { data: supporterGroups, error } = await supabase
    .from("investor_groups")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching supporter groups:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-neutral-900">
            サポーター管理
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            サポーターグループの追加・編集・削除ができます
          </p>
        </div>
        <Link
          href="/admin/supporters/new"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          + 新規作成
        </Link>
      </div>

      <SupportersList supporterGroups={supporterGroups || []} />
    </div>
  );
}
