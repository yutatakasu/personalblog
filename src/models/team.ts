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

/**
 * フェイルセーフ用のデフォルトデータ
 * Supabaseが利用できない場合や開発時のフォールバックとして使用
 */
export const defaultTeamMembers: TeamMember[] = [
  {
    id: "yuki-miyazaki",
    name: "Yuki Miyazaki",
    title: "Founder & CEO",
    focus:
      "長期的な記憶レイヤー戦略を定義し、Atlas 全体のビジョンとガバナンスをリードします。",
    imageSrc: "/favicon.svg",
    imageAlt: "Yuki Miyazaki",
    position: { row: 1, column: 1, offsetY: "-24px" },
  },
  {
    id: "lyuki-kumagai",
    name: "Lyuki Kumagai",
    title: "COO",
    focus:
      "各プロダクトラインのオペレーション設計と品質基準の統一を推進します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Lyuki Kumagai",
    position: { row: 1, column: 2, offsetY: "18px" },
  },
  {
    id: "ryoga-hashimoto",
    name: "Ryoga Hashimoto",
    title: "CTO",
    focus:
      "分散メモリ基盤と推論パイプラインのスケールを支えるアーキテクチャを監督します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Ryoga Hashimoto",
    position: { row: 1, column: 3, offsetY: "-18px" },
  },
  {
    id: "yuta-takasu",
    name: "Yuta Takasu",
    title: "Chief Scientist",
    focus:
      "長期記憶のセマンティクス解析と適応アルゴリズムの研究開発をリードします。",
    imageSrc: "/favicon.svg",
    imageAlt: "Yuta Takasu",
    position: { row: 1, column: 4, offsetY: "30px" },
  },
  {
    id: "theo-jang",
    name: "Theo Jang",
    title: "VP Product",
    focus:
      "顧客ワークフローから逆算した記憶テンプレートの設計とUX指針を策定します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Theo Jang",
    position: { row: 1, column: 5, offsetY: "-28px" },
  },
  {
    id: "issa-tada",
    name: "Issa Tada",
    title: "Head of Platform",
    focus: "API と開発者エコシステムを整備し、Atlas OS の拡張性を担保します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Issa Tada",
    position: { row: 2, column: 1, offsetY: "-14px" },
  },
  {
    id: "kazuki-miyazaki",
    name: "Kazuki Miyazaki",
    title: "Design Director",
    focus:
      "人とエージェントの協働を成立させるコミュニケーションデザインを統括します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Kazuki Miyazaki",
    position: { row: 2, column: 2, offsetY: "24px" },
  },
  {
    id: "shuichiro-ono",
    name: "Shuichiro Ono",
    title: "Head of Security",
    focus: "記憶レイヤーのゼロトラスト設計と監査フレームワークを構築します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Shuichiro Ono",
    position: { row: 2, column: 3, offsetY: "-26px" },
  },
  {
    id: "hinako-tsutsumi",
    name: "Hinako Tsutsumi",
    title: "VP Customer Success",
    focus: "導入企業のワークフロー定着と継続的な成果指標の運用を支援します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Hinako Tsutsumi",
    position: { row: 2, column: 4, offsetY: "30px" },
  },
  {
    id: "tsubasa-ogasawara",
    name: "Tsubasa Ogasawara",
    title: "Head of Partnerships",
    focus: "戦略提携先との共同ソリューション開発と GTM を推進します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Tsubasa Ogasawara",
    position: { row: 2, column: 5, offsetY: "-22px" },
  },
  {
    id: "koki-aoyagi",
    name: "Koki Aoyagi",
    title: "Data Steward Lead",
    focus:
      "企業データの分類体系とアクセスコントロールを記憶レイヤー上で標準化します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Koki Aoyagi",
    position: { row: 3, column: 1, offsetY: "18px" },
  },
  {
    id: "ryo-saito",
    name: "Ryo Saito",
    title: "Field CTO",
    focus:
      "大規模顧客の技術評価と導入プロジェクトを指揮し、フィードバックを製品へ循環させます。",
    imageSrc: "/favicon.svg",
    imageAlt: "Ryo Saito",
    position: { row: 3, column: 2, offsetY: "-32px" },
  },
  {
    id: "mika-honda",
    name: "Mika Honda",
    title: "Head of Insights",
    focus:
      "記憶データからの洞察抽出と意思決定レポートの自動化パターンを開発します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Mika Honda",
    position: { row: 3, column: 3, offsetY: "26px" },
  },
  {
    id: "daichi-mori",
    name: "Daichi Mori",
    title: "Principal Engineer",
    focus: "低レイテンシ推論とイベントストリーミングの最適化を担当します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Daichi Mori",
    position: { row: 3, column: 4, offsetY: "-28px" },
  },
  {
    id: "asami-yoshida",
    name: "Asami Yoshida",
    title: "Head of People",
    focus:
      "Atlas のカルチャーと人材ポートフォリオを記憶レイヤー活用前提で設計します。",
    imageSrc: "/favicon.svg",
    imageAlt: "Asami Yoshida",
    position: { row: 3, column: 5, offsetY: "20px" },
  },
];

/**
 * Supabaseからチームメンバー一覧を取得
 * エラー時はデフォルトデータを返す
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  // Supabaseが設定されていない場合はデフォルトデータを返す
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return defaultTeamMembers;
  }

  try {
    const { getAllTeamMembers } = await import("@/lib/supabase/queries");
    const items = await getAllTeamMembers();
    // Supabaseからデータが取得できた場合はそれを使用、空の場合はデフォルトデータを返す
    return items.length > 0 ? items : defaultTeamMembers;
  } catch (error) {
    // より詳細なエラー情報をログ出力
    const errorInfo =
      error instanceof Error
        ? {
            message: error.message,
            name: error.name,
            stack: error.stack,
          }
        : error;
    console.error(
      "Failed to fetch team members from Supabase, using default data:",
      errorInfo,
    );
    return defaultTeamMembers;
  }
}

/**
 * @deprecated 後方互換性のため残しています。getTeamMembers() を使用してください。
 */
export const teamMembers = defaultTeamMembers;

