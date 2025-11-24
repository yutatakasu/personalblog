export const CONTACT_ENTRY_IDS = [
  "news-article",
  "position-apply",
  "careers-general",
  "company-general",
  "privacy-inquiry",
] as const;

export type ContactEntryId = (typeof CONTACT_ENTRY_IDS)[number];

export type ContactContext = {
  newsId?: string;
  positionId?: string;
  /** フロント側で件名のプレビュー表示に使うタイトル */
  titleForSubject?: string;
};

type ContactEntryKind = "news" | "position" | "generic";

export type ContactEntryConfig = {
  id: ContactEntryId;
  /** フロント側で表示する見出し（「本件に関するお問い合わせ」など） */
  label: string;
  /** メール件名のテンプレート。{title} などのプレースホルダを含めてもよい */
  subjectTemplate: string;
  /**
   * kind に応じて宛先メールアドレスの決め方が変わる
   * - news: Supabase のニュースレコードの contactEmail を優先
   * - position: Supabase の募集情報レコードの applyEmail を優先
   * - generic: defaultTo を必須とし、固定の宛先へ送信
   */
  kind: ContactEntryKind;
  /** generic 用のデフォルト宛先（news/position の場合はフェイルセーフとしてのみ使用） */
  defaultTo?: string;
  /**
   * フォーム上で件名をユーザーが編集できるかどうか
   * - true: Contact セクションなど、自由記入の件名
   * - false: News / Positions など、Atlas 側で決めた件名のみ
   */
  subjectEditable?: boolean;
};

export const CONTACT_ENTRIES: Record<ContactEntryId, ContactEntryConfig> = {
  "news-article": {
    id: "news-article",
    label: "本件に関するお問い合わせ",
    subjectTemplate: "[News] {title} に関して",
    kind: "news",
    // ニュースの contactEmail が未設定のときのフェイルセーフ
    defaultTo: "press@atlas.inc",
  },
  "position-apply": {
    id: "position-apply",
    label: "募集ポジションに関するお問い合わせ",
    subjectTemplate: "[Positions] {title} に関して",
    kind: "position",
    // applyEmail が未設定の場合のフェイルセーフ
    defaultTo: "careers@atlas.inc",
  },
  "careers-general": {
    id: "careers-general",
    label: "採用・キャリアに関するお問い合わせ",
    subjectTemplate: "【Careers】お問い合わせ",
    kind: "generic",
    defaultTo: "careers@atlas.inc",
  },
  "company-general": {
    id: "company-general",
    label: "Atlas への一般的なお問い合わせ",
    subjectTemplate: "【Atlas】{title}",
    kind: "generic",
    defaultTo: "info@atlas-official.net",
    subjectEditable: true,
  },
  "privacy-inquiry": {
    id: "privacy-inquiry",
    label: "個人情報の取り扱いに関するお問い合わせ",
    subjectTemplate: "【Privacy】個人情報の取り扱いに関するお問い合わせ",
    kind: "generic",
    defaultTo: "privacy@atlas.inc",
  },
};

export type ResolvedContactTarget = {
  to: string;
  subject: string;
};

export type BuildContactTargetParams = {
  entryId: ContactEntryId;
  context?: ContactContext;
  titleForSubject?: string;
};

export const buildContactSubject = (
  template: string,
  titleForSubject?: string,
): string => {
  if (!template.includes("{title}")) {
    return template;
  }

  if (!titleForSubject || titleForSubject.trim().length === 0) {
    return template.replace("{title}", "");
  }

  return template.replace("{title}", titleForSubject.trim());
};
