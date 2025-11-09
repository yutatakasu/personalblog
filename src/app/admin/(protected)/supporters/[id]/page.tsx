import { notFound } from "next/navigation";
import { SupporterForm } from "@/components/admin/SupporterForm";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

export default async function AdminSupporterEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    notFound();
  }

  const supabase = await createServerSupabaseClient();
  const { data: supporterGroup, error } = await supabase
    .from("investor_groups")
    .select("*")
    .eq("id", numericId)
    .single();

  if (error || !supporterGroup) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-neutral-900">サポーターグループの編集</h1>
        <p className="mt-2 text-sm text-neutral-600">サポーターグループの内容を編集します</p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <SupporterForm initialData={supporterGroup} />
      </div>
    </div>
  );
}

