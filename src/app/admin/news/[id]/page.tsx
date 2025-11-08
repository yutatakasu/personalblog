import { notFound } from "next/navigation";
import { adminSupabase } from "@/lib/supabase/admin";
import { NewsForm } from "@/components/admin/NewsForm";

export default async function AdminNewsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: newsItem, error } = await adminSupabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !newsItem) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-neutral-900">ニュース記事の編集</h1>
        <p className="mt-2 text-sm text-neutral-600">ニュース記事の内容を編集します</p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <NewsForm initialData={newsItem} />
      </div>
    </div>
  );
}

