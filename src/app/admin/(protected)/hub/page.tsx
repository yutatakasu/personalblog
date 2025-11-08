"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";

type Metric = {
  label: string;
  description: string;
  href: string;
  count: number | null;
};

async function fetchMetricCount(table: string) {
  const supabase = getAdminSupabaseClient();
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });

  if (error) {
    console.error(`Failed to fetch ${table} count:`, error);
    return null;
  }

  return count ?? 0;
}

export default function AdminHubPage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      setLoading(true);
      const [newsCount, positionsCount, teamCount, investorsCount] = await Promise.all([
        fetchMetricCount("news"),
        fetchMetricCount("positions"),
        fetchMetricCount("team_members"),
        fetchMetricCount("investor_groups"),
      ]);

      setMetrics([
        {
          label: "ニュース",
          description: "最新のお知らせと更新情報",
          href: "/admin/news",
          count: newsCount,
        },
        {
          label: "採用ポジション",
          description: "公開中の募集ポジション",
          href: "/admin/positions",
          count: positionsCount,
        },
        {
          label: "チームメンバー",
          description: "紹介セクションのメンバー管理",
          href: "/admin/team",
          count: teamCount,
        },
        {
          label: "投資家グループ",
          description: "支援者リスト",
          href: "/admin/investors",
          count: investorsCount,
        },
      ]);
      setLoading(false);
    };

    void loadMetrics();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500">Atlas Admin</p>
          <h1 className="font-serif text-3xl text-neutral-900">ハブ</h1>
        </div>
        <p className="max-w-2xl text-sm text-neutral-600">
          サイトの主要コンテンツを一元管理できます。サマリーカードから各セクションに移動し、更新作業を開始してください。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(loading ? new Array(4).fill(undefined) : metrics).map((metric, index) => (
          <div
            key={metric?.label ?? index}
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-neutral-900 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-neutral-400">概要</p>
                <p className="mt-2 font-serif text-xl text-neutral-900">
                  {metric?.label ?? "読み込み中..."}
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-xs text-neutral-500 transition group-hover:border-neutral-900 group-hover:text-neutral-900">
                {metric?.count ?? "-"}
              </span>
            </div>
            <p className="mt-3 text-sm text-neutral-600">
              {metric?.description ?? "データを取得しています..."}
            </p>
            <Link
              href={metric?.href ?? "#"}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-neutral-900 transition group-hover:gap-2"
            >
              管理ページへ移動
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </Link>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500">次のステップ</p>
            <h2 className="mt-2 font-serif text-2xl text-neutral-900">
              マルチコンテンツ管理に向けた準備
            </h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-600">
              近日中に採用情報・チーム紹介・投資家セクションの編集機能を提供予定です。それまではニュース管理を中心にご利用ください。
            </p>
          </div>
          <Link
            href="/admin/news/new"
            className="inline-flex items-center justify-center rounded-lg border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
          >
            ニュースを追加
          </Link>
        </div>
      </div>
    </div>
  );
}
