export type Position = {
  id: string;
  title: string;
  department: string;
  location: string;
  workStyle: "Onsite" | "Hybrid" | "Remote";
  summary: string;
  responsibilities: string[];
  requirements: string[];
  applyEmail?: string;
};

export const positions: Position[] = [
  {
    id: "ai-systems-engineer",
    title: "AI Systems Engineer",
    department: "Atlas Core",
    location: "Tokyo / Remote",
    workStyle: "Hybrid",
    summary:
      "長期記憶レイヤーと推論エンジンの連携を最適化し、Atlas の知覚・応答品質を継続的に高めます。",
    responsibilities: [
      "分散メモリ基盤と推論パイプラインの技術課題を特定・解決する",
      "生成 AI モデルの挙動分析とパフォーマンス評価を自動化する",
      "新しいアーキテクチャの検証や観測基盤の整備をリードする",
    ],
    requirements: [
      "Python / TypeScript いずれかのプロダクション経験",
      "LLM / ベクトル検索 / ストリーミング処理の実装経験",
      "英語ドキュメントを読み解き技術検証できるリサーチ力",
    ],
    applyEmail: "careers@atlas.inc",
  },
  {
    id: "product-designer",
    title: "Product Designer",
    department: "Design Studio",
    location: "Tokyo / Remote",
    workStyle: "Hybrid",
    summary:
      "人間とエージェントの協働体験を設計し、Atlas プラットフォーム全体の情報設計とUI品質を監督します。",
    responsibilities: [
      "デザインシステムとアクセシビリティ基準の策定・運用",
      "顧客ワークショップから課題を抽出しジャーニーへ落とし込む",
      "エンジニア・リサーチチームと連携したUI改善の検証",
    ],
    requirements: [
      "SaaS または複数プロダクトのデザイン経験",
      "Figma / Prototyping ツールを活用したコミュニケーションスキル",
      "定量・定性リサーチを組み合わせた判断力",
    ],
    applyEmail: "design@atlas.inc",
  },
  {
    id: "solutions-architect",
    title: "Solutions Architect",
    department: "Enterprise Delivery",
    location: "Tokyo / Remote",
    workStyle: "Hybrid",
    summary:
      "大規模顧客の導入における技術設計とガバナンスを支援し、Atlas の価値実現まで伴走します。",
    responsibilities: [
      "顧客環境に合わせた API / セキュリティ設計のリード",
      "PoC から本番展開までの技術課題マネジメント",
      "社内プロダクトチームへのフィードバックループ構築",
    ],
    requirements: [
      "SaaS or Enterprise 製品の導入支援経験",
      "クラウド (GCP/AWS/Azure) いずれかのアーキテクチャ設計力",
      "ビジネス / 技術双方でのステークホルダーマネジメント",
    ],
    applyEmail: "solutions@atlas.inc",
  },
  {
    id: "head-of-people",
    title: "Head of People",
    department: "People & Culture",
    location: "Tokyo",
    workStyle: "Onsite",
    summary:
      "Atlas のカルチャーと人材ポートフォリオを設計し、成長ステージに合わせたオペレーションを構築します。",
    responsibilities: [
      "採用戦略と候補者体験の設計・実行",
      "評価・報酬・オンボーディングの制度設計をリード",
      "リーダーシップ育成と文化醸成のプログラム運営",
    ],
    requirements: [
      "スタートアップでの人事または HRBP 経験",
      "ピープルアナリティクスの活用経験",
      "経営陣との協業による組織課題の解決実績",
    ],
    applyEmail: "people@atlas.inc",
  },
];
