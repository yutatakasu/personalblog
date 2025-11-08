import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NewsForm } from "@/components/admin/NewsForm";

export default async function AdminNewsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createServerComponentClient({ cookies });
  const { data: newsItem, error } = await supabase
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
