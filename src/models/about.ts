export type TeamMemberPosition = {
  row: number;
  column: number;
  offsetY?: string;
};

export type TeamMember = {
  id: string;
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
    id: "yuki-miyazaki",
    name: "Yuki Miyazaki",
    title: "Founder & CEO",
    focus:
      "長期的な記憶レイヤー戦略を定義し、Atlas 全体のビジョンとガバナンスをリードします。",
    imageSrc: "/favicon.svg",
    imageAlt: "Yuki Miyazaki",
    position: { row: 1, column: 1, offsetY: "0px" },
  },
  {
    id: "rina-kato",
    name: "Rina Kato",
    title: "COO",
    focus:
      "各プロダクトラインのオペレーション設計と品質基準の統一を推進します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Rina Kato",
    position: { row: 1, column: 2, offsetY: "-24px" },
  },
  {
    id: "sota-hayashi",
    name: "Sota Hayashi",
    title: "CTO",
    focus:
      "分散メモリ基盤と推論パイプラインのスケールを支えるアーキテクチャを監督します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Sota Hayashi",
    position: { row: 1, column: 3, offsetY: "12px" },
  },
  {
    id: "mei-fujita",
    name: "Mei Fujita",
    title: "Chief Scientist",
    focus:
      "長期記憶のセマンティクス解析と適応アルゴリズムの研究開発をリードします。",
    imageSrc: "/favicon.svg",
    imageAlt: "Mei Fujita",
    position: { row: 1, column: 4, offsetY: "-18px" },
  },
  {
    id: "haru-yamamoto",
    name: "Haru Yamamoto",
    title: "VP Product",
    focus:
      "顧客ワークフローから逆算した記憶テンプレートの設計とUX指針を策定します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Haru Yamamoto",
    position: { row: 1, column: 5, offsetY: "10px" },
  },
  {
    id: "kenji-nakamura",
    name: "Kenji Nakamura",
    title: "Head of Platform",
    focus: "API と開発者エコシステムを整備し、Atlas OS の拡張性を担保します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Kenji Nakamura",
    position: { row: 2, column: 1, offsetY: "18px" },
  },
  {
    id: "aya-suzuki",
    name: "Aya Suzuki",
    title: "Design Director",
    focus:
      "人とエージェントの協働を成立させるコミュニケーションデザインを統括します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Aya Suzuki",
    position: { row: 2, column: 2, offsetY: "-10px" },
  },
  {
    id: "taro-nishimura",
    name: "Taro Nishimura",
    title: "Head of Security",
    focus: "記憶レイヤーのゼロトラスト設計と監査フレームワークを構築します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Taro Nishimura",
    position: { row: 2, column: 3, offsetY: "22px" },
  },
  {
    id: "emi-watanabe",
    name: "Emi Watanabe",
    title: "VP Customer Success",
    focus: "導入企業のワークフロー定着と継続的な成果指標の運用を支援します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Emi Watanabe",
    position: { row: 2, column: 4, offsetY: "-6px" },
  },
  {
    id: "sho-tanaka",
    name: "Sho Tanaka",
    title: "Head of Partnerships",
    focus: "戦略提携先との共同ソリューション開発と GTM を推進します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Sho Tanaka",
    position: { row: 2, column: 5, offsetY: "24px" },
  },
  {
    id: "nao-kimura",
    name: "Nao Kimura",
    title: "Data Steward Lead",
    focus:
      "企業データの分類体系とアクセスコントロールを記憶レイヤー上で標準化します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Nao Kimura",
    position: { row: 3, column: 1, offsetY: "-12px" },
  },
  {
    id: "ryo-saito",
    name: "Ryo Saito",
    title: "Field CTO",
    focus:
      "大規模顧客の技術評価と導入プロジェクトを指揮し、フィードバックを製品へ循環させます。",
    imageSrc: "/favicon.svg",
    imageAlt: "Ryo Saito",
    position: { row: 3, column: 2, offsetY: "16px" },
  },
  {
    id: "mika-honda",
    name: "Mika Honda",
    title: "Head of Insights",
    focus:
      "記憶データからの洞察抽出と意思決定レポートの自動化パターンを開発します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Mika Honda",
    position: { row: 3, column: 3, offsetY: "-18px" },
  },
  {
    id: "daichi-mori",
    name: "Daichi Mori",
    title: "Principal Engineer",
    focus: "低レイテンシ推論とイベントストリーミングの最適化を担当します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Daichi Mori",
    position: { row: 3, column: 4, offsetY: "10px" },
  },
  {
    id: "asami-yoshida",
    name: "Asami Yoshida",
    title: "Head of People",
    focus:
      "Atlas のカルチャーと人材ポートフォリオを記憶レイヤー活用前提で設計します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Asami Yoshida",
    position: { row: 3, column: 5, offsetY: "-14px" },
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
