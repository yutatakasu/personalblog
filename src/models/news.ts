export type ContentBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
    };

export type NewsItem = {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  link: string;
  content: ContentBlock[];
  summary?: string;
  tag?: string;
};

/**
 * フェイルセーフ用のデフォルトデータ
 * Supabaseが利用できない場合や開発時のフォールバックとして使用
 */
export const defaultNewsItems: NewsItem[] = [
  {
    id: "atlas-os-v2-release",
    title: "Atlas OS v2 を正式リリース",
    subtitle: "長期記憶に最適化した新機能を追加",
    date: "2025.09.12",
    thumbnailSrc: "/members_far_from.jpg",
    thumbnailAlt: "Atlas OS v2 product interface preview",
    link: "/news/atlas-os-v2-release",
    content: [
      {
        type: "paragraph",
        text: "長期記憶に最適化したオーケストレーション機能と、監査可能なイベントタイムラインを追加しました。",
      },
      {
        type: "paragraph",
        text: "Atlas は Memory as a Service の提供を通じて、企業の意思決定を加速させるプラットフォームを構築しています。",
      },
    ],
    summary:
      "長期記憶に最適化したオーケストレーション機能と、監査可能なイベントタイムラインを追加しました。",
    tag: "Product Update",
  },
  {
    id: "mitsui-collaboration",
    title: "三井物産と記憶連携ソリューションを共同開発",
    date: "2025.08.02",
    thumbnailSrc: "/members.jpg",
    thumbnailAlt: "Atlas と三井物産の共同プロジェクトイメージ",
    link: "/news/mitsui-collaboration",
    content: [
      {
        type: "paragraph",
        text: "グローバルなオペレーションチームで AI エージェントを安全にスケールさせるための共同プロジェクトを開始。",
      },
    ],
    summary:
      "グローバルなオペレーションチームで AI エージェントを安全にスケールさせるための共同プロジェクトを開始。",
    tag: "Partnership",
  },
  {
    id: "series-a-funding",
    title: "Series A ラウンドで 18 億円を調達",
    date: "2025.06.18",
    thumbnailSrc: "/trees_and_sky.jpg",
    thumbnailAlt: "Series A funding announcement",
    link: "/news/series-a-funding",
    content: [
      {
        type: "paragraph",
        text: "国内外のトップ投資家から資金調達し、Memory as a Service の研究開発と市場展開を加速します。",
      },
    ],
    summary:
      "国内外のトップ投資家から資金調達し、Memory as a Service の研究開発と市場展開を加速します。",
    tag: "Funding",
  },
  {
    id: "memory-layer-roadmap",
    title: "Memory Layer Roadmap 2026 を公開",
    date: "2025.05.22",
    thumbnailSrc: "/members_far_from.jpg",
    thumbnailAlt: "Atlas team reviewing roadmap diagrams",
    link: "/news/memory-layer-roadmap",
    content: [
      {
        type: "paragraph",
        text: "Atlas OS の長期ロードマップを共有し、API ファーストな拡張性と監査可能なオペレーション指針を発表しました。",
      },
    ],
    summary:
      "Atlas OS の長期ロードマップを共有し、API ファーストな拡張性と監査可能なオペレーション指針を発表しました。",
    tag: "Product",
  },
  {
    id: "kyoto-research-lab",
    title: "京都リサーチラボを新設",
    date: "2025.04.05",
    thumbnailSrc: "/members.jpg",
    thumbnailAlt: "Researchers collaborating in the Kyoto lab",
    link: "/news/kyoto-research-lab",
    content: [
      {
        type: "paragraph",
        text: "エッジ推論と低遅延同期の研究拠点として京都リサーチラボを開設し、産学連携を強化します。",
      },
    ],
    summary:
      "エッジ推論と低遅延同期の研究拠点として京都リサーチラボを開設し、産学連携を強化します。",
    tag: "R&D",
  },
  {
    id: "ai-governance-forum",
    title: "AI ガバナンスフォーラム 2025 へ登壇",
    date: "2025.03.14",
    thumbnailSrc: "/trees_and_sky.jpg",
    thumbnailAlt: "Conference hall for AI governance forum",
    link: "/news/ai-governance-forum",
    content: [
      {
        type: "paragraph",
        text: "世界各国の政策リーダーと共にメモリーレイヤーのトレーサビリティ基準について提言しました。",
      },
    ],
    summary:
      "世界各国の政策リーダーと共にメモリーレイヤーのトレーサビリティ基準について提言しました。",
    tag: "Event",
  },
];

/**
 * Supabaseからニュース一覧を取得
 * エラー時はデフォルトデータを返す
 */
export async function getNewsItems(): Promise<NewsItem[]> {
  // Supabaseが設定されていない場合はデフォルトデータを返す
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return defaultNewsItems;
  }

  try {
    const { getAllNews } = await import("@/lib/supabase/queries");
    const items = await getAllNews();
    // Supabaseからデータが取得できた場合はそれを使用、空の場合はデフォルトデータを返す
    return items.length > 0 ? items : defaultNewsItems;
  } catch (error) {
    console.error("Failed to fetch news from Supabase, using default data:", error);
    return defaultNewsItems;
  }
}

/**
 * Supabaseから指定IDのニュースを取得
 * エラー時はデフォルトデータから検索
 */
export async function getNewsItemById(id: string): Promise<NewsItem | null> {
  // Supabaseが設定されていない場合はデフォルトデータから検索
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return defaultNewsItems.find((item) => item.id === id) ?? null;
  }

  try {
    const { getNewsById } = await import("@/lib/supabase/queries");
    const item = await getNewsById(id);
    // Supabaseからデータが取得できた場合はそれを使用、nullの場合はデフォルトデータから検索
    return item ?? defaultNewsItems.find((item) => item.id === id) ?? null;
  } catch (error) {
    console.error("Failed to fetch news item from Supabase, using default data:", error);
    return defaultNewsItems.find((item) => item.id === id) ?? null;
  }
}

/**
 * @deprecated 後方互換性のため残しています。getNewsItems() を使用してください。
 */
export const newsItems = defaultNewsItems;
