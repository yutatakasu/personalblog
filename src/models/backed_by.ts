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
        name: "Coming Soon",
        focus: "coming soon...",
      },
    ],
  },
  {
    category: "Strategic Angels",
    supporters: [
      {
        name: "Coming Soon",
        focus: "coming soon...",
      },
    ],
  },
  {
    category: "Enterprise Partners",
    supporters: [
      {
        name: "Coming Soon",
        focus: "coming soon...",
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
