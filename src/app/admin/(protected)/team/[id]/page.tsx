import { notFound } from "next/navigation";
import { TeamForm } from "@/components/admin/TeamForm";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

export default async function AdminTeamEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createServerSupabaseClient();
  const { data: teamMember, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !teamMember) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-neutral-900">チームメンバーの編集</h1>
        <p className="mt-2 text-sm text-neutral-600">チームメンバーの内容を編集します</p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <TeamForm initialData={teamMember} />
      </div>
    </div>
  );
}

