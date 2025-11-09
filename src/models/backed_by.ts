export type Supporter = {
  name: string;
  title?: string;
  focus?: string;
  imageSrc?: string;
};

export type InvestorGroup = {
  category: string;
  supporters: Supporter[];
};

/**
 * フェイルセーフ用のデフォルトデータ
 * Supabaseが利用できない場合や開発時のフォールバックとして使用
 */
export const defaultInvestorGroups: InvestorGroup[] = [
  {
    category: "Lead Investors",
    supporters: [
      {
        name: "North Star Ventures",
        title: "Lead Investor",
        focus: "Atlas の初期シードから継続的に支援しています。",
        imageSrc: "/investors/north-star.png",
      },
      {
        name: "FutureFabric Capital",
        title: "Strategic Partner",
        focus: "エンタープライズ市場への拡張をリード。",
        imageSrc: "/investors/future-fabric.png",
      },
      {
        name: "Tokyo Frontier Fund",
        title: "Corporate Fund",
        focus: "製造業ユースケースの共同開発を推進。",
        imageSrc: "/investors/tokyo-frontier.png",
      },
    ],
  },
  {
    category: "Strategic Angels",
    supporters: [
      {
        name: "Ayumi Tanaka",
        title: "ex-DeepMind",
        focus: "AI安全領域のリサーチアドバイザー。",
        imageSrc: "/investors/ayumi-tanaka.png",
      },
      {
        name: "Ken Carter",
        title: "ex-Snowflake",
        focus: "データプラットフォーム戦略を支援。",
        imageSrc: "/investors/ken-carter.png",
      },
      {
        name: "Yui Nakamura",
        title: "LayerX",
        focus: "ガバメント領域での導入をコンサルティング。",
        imageSrc: "/investors/yui-nakamura.png",
      },
    ],
  },
  {
    category: "Enterprise Partners",
    supporters: [
      {
        name: "Mitsuba Holdings",
        title: "Manufacturing Partner",
        focus: "グローバル工場の記憶レイヤー統合を実証。",
        imageSrc: "/investors/mitsuba.png",
      },
      {
        name: "Pacific Systems",
        title: "Systems Integrator",
        focus: "業務データ統合とAIオーケストレーション基盤を導入。",
        imageSrc: "/investors/pacific-systems.png",
      },
      {
        name: "Global Insight Group",
        title: "Consulting Alliance",
        focus: "エンタープライズ分析チーム向けのテンプレートを共同開発。",
        imageSrc: "/investors/global-insight.png",
      },
    ],
  },
];

/**
 * Supabaseから投資家グループ一覧を取得
 * エラー時はデフォルトデータを返す
 */
export async function getInvestorGroups(): Promise<InvestorGroup[]> {
  // Supabaseが設定されていない場合はデフォルトデータを返す
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return defaultInvestorGroups;
  }

  try {
    const { getAllInvestorGroups } = await import("@/lib/supabase/queries");
    const items = await getAllInvestorGroups();
    // Supabaseからデータが取得できた場合はそれを使用、空の場合はデフォルトデータを返す
    return items.length > 0 ? items : defaultInvestorGroups;
  } catch (error) {
    const errorInfo =
      error instanceof Error
        ? {
            message: error.message,
            name: error.name,
            stack: error.stack,
          }
        : error;
    console.error(
      "Failed to fetch investor groups from Supabase, using default data:",
      errorInfo,
    );
    return defaultInvestorGroups;
  }
}

/**
 * @deprecated 後方互換性のため残しています。getInvestorGroups() を使用してください。
 */
export const investorGroups = defaultInvestorGroups;
