"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";

type Metric = {
  label: string;
  description: string;
  href: string;
  count: number | null;
};

type MetricConfig = Omit<Metric, "count"> & { table: string };

const METRIC_CONFIGS: MetricConfig[] = [
  {
    label: "ブログ記事",
    description: "公開中のブログ記事",
    href: "/admin/news",
    table: "news",
  },
];

async function fetchMetricCount(table: string) {
  const supabase = getAdminSupabaseClient();
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error(`Failed to fetch ${table} count:`, error);
    return null;
  }

  return count ?? 0;
}

export default function AdminHubPage() {
  const [metrics, setMetrics] = useState<Metric[]>(
    METRIC_CONFIGS.map(({ label, description, href }) => ({
      label,
      description,
      href,
      count: null,
    })),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      setLoading(true);
      const counts = await Promise.all(
        METRIC_CONFIGS.map((config) => fetchMetricCount(config.table)),
      );

      setMetrics(
        METRIC_CONFIGS.map((config, index) => ({
          label: config.label,
          description: config.description,
          href: config.href,
          count: counts[index],
        })),
      );
      setLoading(false);
    };

    void loadMetrics();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
          Blog Admin
        </p>
        <h1 className="text-3xl font-semibold text-neutral-900">ダッシュボード</h1>
        <p className="max-w-2xl text-sm text-neutral-600">
          ブログ記事を管理できます。サマリーカードから記事一覧に移動し、更新作業を開始してください。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white/80 p-5 shadow-sm transition hover:border-neutral-900 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  コンテンツ
                </p>
                <h3 className="mt-3 text-xl font-semibold text-neutral-900">
                  {metric.label}
                </h3>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-sm font-semibold text-neutral-600 transition group-hover:border-neutral-900 group-hover:text-neutral-900">
                {loading ? (
                  <span className="h-3 w-8 animate-pulse rounded bg-neutral-200" />
                ) : (
                  (metric.count ?? "—")
                )}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              {metric.description}
            </p>
            <Link
              href={metric.href}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 transition hover:gap-2"
            >
              管理ページへ移動
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white/80 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            クイックアクション
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-neutral-900">
            新しい記事を作成
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-neutral-600">
            ブログ記事を作成して、あなたの考えを共有しましょう。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/admin/news/new"
              className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              記事を作成
            </Link>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white/80 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            サマリー
          </p>
          <h3 className="mt-3 text-lg font-semibold text-neutral-900">
            現在の状況
          </h3>
          <ul className="mt-4 space-y-3">
            {metrics.map((metric) => (
              <li
                key={`summary-${metric.label}`}
                className="flex items-center justify-between rounded-lg border border-neutral-200/80 bg-white px-3 py-2"
              >
                <span className="text-sm text-neutral-600">{metric.label}</span>
                <span className="text-sm font-semibold text-neutral-900">
                  {metric.count ?? (loading ? "..." : "—")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
