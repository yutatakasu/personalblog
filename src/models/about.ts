export type TeamMemberPosition = {
  top: string;
  left: string;
};

export type TeamMember = {
  name: string;
  title: string;
  focus: string;
  imageSrc: string;
  imageAlt?: string;
  position: TeamMemberPosition;
};

export type InvestorGroup = {
  category: string;
  supporters: string[];
};

export type NewsItem = {
  date: string;
  headline: string;
  summary: string;
  tag: string;
};

export const teamMembers: TeamMember[] = [
  {
    name: "Koki Aoyagi",
    title: "Co-Founder & CEO",
    focus:
      "記憶レイヤーと業務オペレーションを結びつける長期ロードマップを設計し、Atlas のビジョンを牽引します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Koki Aoyagi",
    position: { top: "18%", left: "20%" },
  },
  {
    name: "Mina Sato",
    title: "Head of Product",
    focus:
      "エージェントと人のコラボレーション体験をデザインし、ユースケースごとの記憶テンプレートを整備しています。",
    imageSrc: "/favicon.svg",
    imageAlt: "Mina Sato",
    position: { top: "26%", left: "72%" },
  },
  {
    name: "Ren Ishikawa",
    title: "CTO",
    focus:
      "分散メモリ基盤と推論パイプラインを統合し、セキュアでスケーラブルな Memory as a Service を提供します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Ren Ishikawa",
    position: { top: "70%", left: "30%" },
  },
  {
    name: "Sara Kobayashi",
    title: "Head of Success",
    focus:
      "導入企業のワークフロー再設計を支援し、記憶を活用した意思決定の定着を支えるエキスパートです。",
    imageSrc: "/favicon.svg",
    imageAlt: "Sara Kobayashi",
    position: { top: "76%", left: "74%" },
  },
];

export const investorGroups: InvestorGroup[] = [
  {
    category: "Lead Investors",
    supporters: [
      "North Star Ventures",
      "FutureFabric Capital",
      "Tokyo Frontier Fund",
    ],
  },
  {
    category: "Strategic Angels",
    supporters: [
      "Ayumi Tanaka (ex-DeepMind)",
      "Ken Carter (ex-Snowflake)",
      "Yui Nakamura (LayerX)",
    ],
  },
  {
    category: "Enterprise Partners",
    supporters: ["Mitsuba Holdings", "Pacific Systems", "Global Insight Group"],
  },
];

export const newsItems: NewsItem[] = [
  {
    date: "2025.09.12",
    headline: "Atlas OS v2 を正式リリース",
    summary:
      "長期記憶に最適化したオーケストレーション機能と、監査可能なイベントタイムラインを追加しました。",
    tag: "Product Update",
  },
  {
    date: "2025.08.02",
    headline: "三井物産と記憶連携ソリューションを共同開発",
    summary:
      "グローバルなオペレーションチームで AI エージェントを安全にスケールさせるための共同プロジェクトを開始。",
    tag: "Partnership",
  },
  {
    date: "2025.06.18",
    headline: "Series A ラウンドで 18 億円を調達",
    summary:
      "国内外のトップ投資家から資金調達し、Memory as a Service の研究開発と市場展開を加速します。",
    tag: "Funding",
  },
];
