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
];

export function getNewsItemById(id: string) {
  return newsItems.find((item) => item.id === id);
}
