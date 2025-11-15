export type NewsContentImage = {
  src: string;
  alt: string;
};

export type ContentBlock = {
  title?: string;
  text: string;
  images: NewsContentImage[];
};

type ContentBlockCandidate = {
  title?: unknown;
  text?: unknown;
  image?: unknown;
  images?: unknown;
};

export type NewsItem = {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  thumbnailSrc?: string;
  thumbnailAlt: string;
  link: string;
  content: ContentBlock[];
  summary?: string;
  contactPerson?: string;
  contactEmail?: string;
};

type LegacyParagraphBlock = {
  type: "paragraph";
  text: string;
};

type LegacyImageBlock = {
  type: "image";
  src: string;
  alt: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isNewsContentImage = (value: unknown): value is NewsContentImage =>
  isRecord(value) &&
  typeof value.src === "string" &&
  typeof value.alt === "string";

const isNewContentBlockCandidate = (
  value: unknown,
): value is ContentBlockCandidate => {
  if (!isRecord(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;

  if (typeof record.text !== "string") {
    return false;
  }

  if ("title" in record && typeof record.title !== "string") {
    return false;
  }

  if (
    "image" in record &&
    record.image !== null &&
    record.image !== undefined &&
    !isNewsContentImage(record.image)
  ) {
    return false;
  }

  if (
    "images" in record &&
    record.images !== null &&
    record.images !== undefined &&
    !Array.isArray(record.images)
  ) {
    return false;
  }

  return true;
};

const isLegacyParagraphBlock = (
  value: unknown,
): value is LegacyParagraphBlock =>
  isRecord(value) &&
  value.type === "paragraph" &&
  typeof value.text === "string";

const isLegacyImageBlock = (value: unknown): value is LegacyImageBlock =>
  isRecord(value) &&
  value.type === "image" &&
  typeof value.src === "string" &&
  typeof value.alt === "string";

const normalizeImage = (image: unknown): NewsContentImage | null => {
  if (!isRecord(image)) {
    return null;
  }

  const srcValue = image.src;
  if (typeof srcValue !== "string") {
    return null;
  }
  const normalizedSrc = srcValue.trim();
  if (!normalizedSrc) {
    return null;
  }

  const altValue = typeof image.alt === "string" ? image.alt.trim() : "";

  return {
    src: normalizedSrc,
    alt: altValue,
  };
};

const normalizeText = (text: unknown): string =>
  typeof text === "string" ? text : "";

const normalizeTitle = (title: unknown): string =>
  typeof title === "string" ? title : "";

const normalizeImagesArray = (
  imagesCandidate: unknown,
  fallbackImage?: unknown,
): NewsContentImage[] => {
  const normalizedFromArray = Array.isArray(imagesCandidate)
    ? imagesCandidate
        .map((candidate) => normalizeImage(candidate))
        .filter((image): image is NewsContentImage => image !== null)
    : [];

  if (normalizedFromArray.length > 0) {
    return normalizedFromArray;
  }

  const singleImage = normalizeImage(fallbackImage);
  return singleImage ? [singleImage] : [];
};

const normalizeNewContentBlocks = (raw: unknown[]): ContentBlock[] =>
  raw
    .filter((block): block is ContentBlockCandidate =>
      isNewContentBlockCandidate(block),
    )
    .map((block) => {
      const normalizedTitle = normalizeTitle(block.title);
      const normalizedText = normalizeText(block.text);
      const normalizedImages = normalizeImagesArray(block.images, block.image);
      return {
        title: normalizedTitle.length > 0 ? normalizedTitle : undefined,
        text: normalizedText,
        images: normalizedImages,
      };
    })
    .filter(
      (block) =>
        (block.title && block.title.trim().length > 0) ||
        block.text.trim().length > 0 ||
        block.images.length > 0,
    );

const normalizeLegacyContentBlocks = (raw: unknown[]): ContentBlock[] => {
  const normalized: ContentBlock[] = [];

  for (let index = 0; index < raw.length; index += 1) {
    const current = raw[index];

    if (isLegacyParagraphBlock(current)) {
      const next = raw[index + 1];
      if (isLegacyImageBlock(next)) {
        normalized.push({
          text: normalizeText(current.text),
          images: [
            {
              src: next.src,
              alt: next.alt,
            },
          ],
        });
        index += 1;
      } else {
        normalized.push({
          text: normalizeText(current.text),
          images: [],
        });
      }
      continue;
    }

    if (isLegacyImageBlock(current)) {
      normalized.push({
        text: "",
        images: [
          {
            src: current.src,
            alt: current.alt,
          },
        ],
      });
    }
  }

  return normalized.filter(
    (block) =>
      block.text.trim().length > 0 ||
      block.images.some((image) => image.src.trim().length > 0),
  );
};

export const normalizeNewsContent = (raw: unknown): ContentBlock[] => {
  if (!Array.isArray(raw)) {
    return [];
  }

  if (raw.every((block) => isNewContentBlockCandidate(block))) {
    return normalizeNewContentBlocks(raw);
  }

  return normalizeLegacyContentBlocks(raw);
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
        title: "アップデート概要",
        text: "長期記憶に最適化したオーケストレーション機能と、監査可能なイベントタイムラインを追加しました。",
        images: [],
      },
      {
        title: "Atlas が提供する価値",
        text: "Atlas は Memory as a Service の提供を通じて、企業の意思決定を加速させるプラットフォームを構築しています。",
        images: [],
      },
    ],
    summary:
      "長期記憶に最適化したオーケストレーション機能と、監査可能なイベントタイムラインを追加しました。",
    contactEmail: "press@atlas.inc",
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
        title: "共同プロジェクトの概要",
        text: "グローバルなオペレーションチームで AI エージェントを安全にスケールさせるための共同プロジェクトを開始。",
        images: [],
      },
    ],
    summary:
      "グローバルなオペレーションチームで AI エージェントを安全にスケールさせるための共同プロジェクトを開始。",
    contactEmail: "press@atlas.inc",
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
        title: "資金調達の目的",
        text: "国内外のトップ投資家から資金調達し、Memory as a Service の研究開発と市場展開を加速します。",
        images: [],
      },
    ],
    summary:
      "国内外のトップ投資家から資金調達し、Memory as a Service の研究開発と市場展開を加速します。",
    contactEmail: "investor-relations@atlas.inc",
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
        title: "ロードマップ公開の背景",
        text: "Atlas OS の長期ロードマップを共有し、API ファーストな拡張性と監査可能なオペレーション指針を発表しました。",
        images: [],
      },
    ],
    summary:
      "Atlas OS の長期ロードマップを共有し、API ファーストな拡張性と監査可能なオペレーション指針を発表しました。",
    contactEmail: "press@atlas.inc",
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
        title: "京都ラボ設立の狙い",
        text: "エッジ推論と低遅延同期の研究拠点として京都リサーチラボを開設し、産学連携を強化します。",
        images: [],
      },
    ],
    summary:
      "エッジ推論と低遅延同期の研究拠点として京都リサーチラボを開設し、産学連携を強化します。",
    contactEmail: "press@atlas.inc",
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
        title: "フォーラム登壇の内容",
        text: "世界各国の政策リーダーと共にメモリーレイヤーのトレーサビリティ基準について提言しました。",
        images: [],
      },
    ],
    summary:
      "世界各国の政策リーダーと共にメモリーレイヤーのトレーサビリティ基準について提言しました。",
    contactEmail: "press@atlas.inc",
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
    console.error(
      "Failed to fetch news from Supabase, using default data:",
      error,
    );
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
    console.error(
      "Failed to fetch news item from Supabase, using default data:",
      error,
    );
    return defaultNewsItems.find((item) => item.id === id) ?? null;
  }
}

/**
 * @deprecated 後方互換性のため残しています。getNewsItems() を使用してください。
 */
export const newsItems = defaultNewsItems;
