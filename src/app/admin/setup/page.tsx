export default function AdminSetupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl text-neutral-900">Supabase設定が必要です</h1>
          <p className="mt-2 text-sm text-neutral-600">
            管理画面を使用するには、Supabaseの環境変数を設定してください
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
            <h2 className="mb-4 font-serif text-lg text-neutral-900">設定手順</h2>
            <ol className="list-decimal space-y-3 pl-6 text-sm text-neutral-700">
              <li>
                プロジェクトルートに <code className="rounded bg-neutral-200 px-1.5 py-0.5 text-xs">.env.local</code> ファイルを作成
              </li>
              <li>
                以下の環境変数を設定：
                <pre className="mt-2 rounded-lg bg-neutral-900 p-4 text-xs text-neutral-100">
                  {`NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
                </pre>
              </li>
              <li>
                Supabaseプロジェクトの設定から、Project URLとAnon public keyを取得
              </li>
              <li>開発サーバーを再起動</li>
            </ol>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h3 className="mb-2 font-serif text-base text-blue-900">詳細な手順</h3>
            <p className="text-sm text-blue-800">
              詳細なセットアップ手順は <code className="rounded bg-blue-200 px-1.5 py-0.5 text-xs">docs/supabase-setup.md</code> と{" "}
              <code className="rounded bg-blue-200 px-1.5 py-0.5 text-xs">docs/admin-setup.md</code> を参照してください。
            </p>
          </div>

          <div className="flex justify-center">
            <a
              href="/admin/login"
              className="rounded-lg bg-neutral-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              設定後にログインページへ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

