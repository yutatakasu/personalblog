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

export type PostStatus = "draft" | "published";

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
  category?: string;
  status: PostStatus;
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

const sanitizeNewsDateString = (value: string): string => {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  return trimmed
    .replace(/[./]/g, "-")
    .replace(/年|月/g, "-")
    .replace(/日/g, "")
    .replace(/--+/g, "-")
    .replace(/^-/, "");
};

const newsDateToTimestamp = (value: string): number => {
  const normalized = sanitizeNewsDateString(value);
  if (normalized.length === 0) {
    return 0;
  }

  const normalizedTimestamp = Date.parse(normalized);
  if (!Number.isNaN(normalizedTimestamp)) {
    return normalizedTimestamp;
  }

  const fallbackTimestamp = Date.parse(value);
  return Number.isNaN(fallbackTimestamp) ? 0 : fallbackTimestamp;
};

export const sortNewsItemsByDateDesc = <T extends { date: string }>(
  items: T[],
): T[] =>
  [...items].sort(
    (a, b) => newsDateToTimestamp(b.date) - newsDateToTimestamp(a.date),
  );

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
    id: "sample-post",
    title: "サンプル記事",
    subtitle: "ブログの最初の記事です",
    date: "2025.01.01",
    thumbnailSrc: "",
    thumbnailAlt: "サンプル画像",
    link: "/posts/sample-post",
    content: [
      {
        title: "はじめに",
        text: "これはサンプルの記事です。管理画面から記事を作成してください。",
        images: [],
      },
    ],
    summary: "これはサンプルの記事です。",
    category: "general",
    status: "published",
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
    return sortNewsItemsByDateDesc(defaultNewsItems);
  }

  try {
    const { getAllNews } = await import("@/lib/supabase/queries");
    const items = await getAllNews();
    // Supabaseからデータが取得できた場合はそれを使用、空の場合はデフォルトデータを返す
    const resolvedItems = items.length > 0 ? items : defaultNewsItems;
    return sortNewsItemsByDateDesc(resolvedItems);
  } catch (error) {
    console.error(
      "Failed to fetch news from Supabase, using default data:",
      error,
    );
    return sortNewsItemsByDateDesc(defaultNewsItems);
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
