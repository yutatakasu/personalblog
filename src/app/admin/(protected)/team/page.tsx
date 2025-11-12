import Link from "next/link";
import { TeamList } from "@/components/admin/TeamList";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

export default async function AdminTeamPage() {
  const supabase = await createServerSupabaseClient();
  const { data: teamMembers, error } = await supabase
    .from("team_members")
    .select("*")
    .order("position_row", { ascending: true })
    .order("position_column", { ascending: true });

  if (error) {
    console.error("Error fetching team members:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-neutral-900">
            チームメンバー管理
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            チームメンバーの追加・編集・削除ができます
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          + 新規作成
        </Link>
      </div>

      <TeamList teamMembers={teamMembers || []} />
    </div>
  );
}

