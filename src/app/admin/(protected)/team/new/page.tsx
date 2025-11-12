import { TeamForm } from "@/components/admin/TeamForm";

export default function AdminTeamNewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-neutral-900">
          チームメンバーの新規作成
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          新しいチームメンバーを追加します
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <TeamForm />
      </div>
    </div>
  );
}

