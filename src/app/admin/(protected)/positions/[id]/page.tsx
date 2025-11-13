import { notFound } from "next/navigation";
import { PositionForm } from "@/components/admin/PositionForm";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

export default async function AdminPositionEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createServerSupabaseClient();
  const { data: position, error } = await supabase
    .from("positions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !position) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-neutral-900">募集情報の編集</h1>
        <p className="mt-2 text-sm text-neutral-600">
          募集情報の内容を編集します
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <PositionForm initialData={position} />
      </div>
    </div>
  );
}
