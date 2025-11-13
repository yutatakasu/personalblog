import { PositionForm } from "@/components/admin/PositionForm";

export default function AdminPositionNewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-neutral-900">
          募集情報の新規作成
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          新しい募集情報を追加します
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <PositionForm />
      </div>
    </div>
  );
}






