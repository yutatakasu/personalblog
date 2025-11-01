export type NewsItem = {
  id: string;
  title: string;
  date: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  link: string;
  summary?: string;
  tag?: string;
};

export const newsItems: NewsItem[] = [
  {
    id: "atlas-os-v2-release",
    title: "Atlas OS v2 を正式リリース",
    date: "2025.09.12",
    thumbnailSrc: "/members_far_from.jpg",
    thumbnailAlt: "Atlas OS v2 product interface preview",
    link: "/news/atlas-os-v2-release",
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
    summary:
      "世界各国の政策リーダーと共にメモリーレイヤーのトレーサビリティ基準について提言しました。",
    tag: "Event",
  },
];

export function getNewsItemById(id: string) {
  return newsItems.find((item) => item.id === id);
}
