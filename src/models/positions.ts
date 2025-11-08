export type Position = {
  id: string;
  title: string;
  department: string;
  location: string;
  workStyle: "Onsite" | "Hybrid" | "Remote";
  teaser: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  applyEmail?: string;
};

/**
 * フェイルセーフ用のデフォルトデータ
 * Supabaseが利用できない場合や開発時のフォールバックとして使用
 */
export const defaultPositions: Position[] = [
  {
    id: "ai-systems-engineer",
    title: "AI Systems Engineer",
    department: "Atlas Core",
    location: "Tokyo / Remote",
    workStyle: "Hybrid",
    teaser: "メモリと推論を結ぶ心臓部を、ともに磨き上げる仲間を探しています。",
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
    teaser: "人とエージェントの距離を縮める体験設計をリードしてください。",
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
    teaser: "大規模導入を成功へ導く伴走者として、お客様とAtlasをつなぎます。",
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
    teaser: "Atlasらしい文化を育てる土壌づくりをお任せします。",
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
  {
    id: "enterprise-account-executive",
    title: "Enterprise Account Executive",
    department: "Revenue",
    location: "Tokyo / Remote",
    workStyle: "Hybrid",
    teaser: "大企業との対話をリードし、Atlas の価値を丁寧に届けてください。",
    summary:
      "エンタープライズ顧客の経営課題を理解し、Atlas のソリューションを提案からクロージングまで導きます。",
    responsibilities: [
      "ターゲットアカウントの開拓とマルチステークホルダー折衝",
      "提案書・ROI モデルの作成と商談推進",
      "導入後の継続的な関係構築とアップセル機会の創出",
    ],
    requirements: [
      "B2B SaaS でのエンタープライズ営業経験",
      "経営層・技術部門双方と信頼関係を築くコミュニケーション力",
      "予実管理とセールスプロセスの改善スキル",
    ],
    applyEmail: "sales@atlas.inc",
  },
  {
    id: "strategic-partnerships-lead",
    title: "Strategic Partnerships Lead",
    department: "Business Development",
    location: "Tokyo / Remote",
    workStyle: "Hybrid",
    teaser: "パートナーとの共創で、Atlas のエコシステムを広げていきます。",
    summary:
      "戦略的提携先との協業機会を発掘し、共同ソリューションや市場開拓を推進します。",
    responsibilities: [
      "市場リサーチと優先領域におけるパートナー候補の選定",
      "共同プロジェクトの企画・契約交渉・実行管理",
      "社内プロダクト・営業チームとの連携によるGTM設計",
    ],
    requirements: [
      "BizDev またはコンサルティングでの実務経験",
      "契約・アライアンスに関わる基本的なリーガル/ファイナンス知識",
      "多様な文化背景を持つチームとの協働経験",
    ],
    applyEmail: "bizdev@atlas.inc",
  },
  {
    id: "marketing-lead",
    title: "Marketing Lead",
    department: "Brand & Demand",
    location: "Tokyo / Remote",
    workStyle: "Hybrid",
    teaser: "Atlas の世界観を伝えるブランド体験と需要喚起を設計してください。",
    summary:
      "ブランド戦略からデマンドジェネレーションまでを統合し、Atlas の価値を市場に届けます。",
    responsibilities: [
      "ブランドキャンペーン・イベントの企画運営",
      "コンテンツ/PR 計画と各チャネルのパフォーマンス分析",
      "セールス/CS と連携したリードナーチャリングの仕組み化",
    ],
    requirements: [
      "B2B / SaaS マーケティングのリード経験",
      "データを基にした施策設計と改善サイクルの実践",
      "コピーライティングまたはストーリーテリングに強みがあること",
    ],
    applyEmail: "marketing@atlas.inc",
  },
  {
    id: "customer-success-lead",
    title: "Customer Success Lead",
    department: "Customer Experience",
    location: "Tokyo / Remote",
    workStyle: "Hybrid",
    teaser: "導入後の価値実感を伴走し、Atlas のファンを増やす役割です。",
    summary:
      "顧客のオンボーディングから継続利用の支援までを統括し、成果創出と拡張機会を生み出します。",
    responsibilities: [
      "導入計画の設計とオンボーディングプロジェクトの推進",
      "利用状況の分析とヘルススコアのモニタリング",
      "事例化やコミュニティ運営を通じた顧客価値の最大化",
    ],
    requirements: [
      "Customer Success または PMM/Consulting での顧客伴走経験",
      "データドリブンに課題を特定し改善提案へ落とし込む力",
      "日本語・英語でのドキュメンテーション/ファシリテーション能力",
    ],
    applyEmail: "cs@atlas.inc",
  },
];

/**
 * Supabaseから募集情報一覧を取得
 * エラー時はデフォルトデータを返す
 */
export async function getPositions(): Promise<Position[]> {
  // Supabaseが設定されていない場合はデフォルトデータを返す
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return defaultPositions;
  }

  try {
    const { getAllPositions } = await import("@/lib/supabase/queries");
    const items = await getAllPositions();
    // Supabaseからデータが取得できた場合はそれを使用、空の場合はデフォルトデータを返す
    return items.length > 0 ? items : defaultPositions;
  } catch (error) {
    console.error("Failed to fetch positions from Supabase, using default data:", error);
    return defaultPositions;
  }
}

/**
 * Supabaseから指定IDの募集情報を取得
 * エラー時はデフォルトデータから検索
 */
export async function getPositionById(id: string): Promise<Position | null> {
  // Supabaseが設定されていない場合はデフォルトデータから検索
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return defaultPositions.find((item) => item.id === id) ?? null;
  }

  try {
    const { getPositionById: getPositionByIdFromSupabase } = await import("@/lib/supabase/queries");
    const item = await getPositionByIdFromSupabase(id);
    // Supabaseからデータが取得できた場合はそれを使用、nullの場合はデフォルトデータから検索
    return item ?? defaultPositions.find((item) => item.id === id) ?? null;
  } catch (error) {
    console.error("Failed to fetch position from Supabase, using default data:", error);
    return defaultPositions.find((item) => item.id === id) ?? null;
  }
}

/**
 * @deprecated 後方互換性のため残しています。getPositions() を使用してください。
 */
export const positions = defaultPositions;
