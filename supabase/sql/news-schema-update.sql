-- News テーブルのスキーマ更新
-- サブタイトルとリッチコンテンツ（段落+画像）フィールドを追加

-- 既存のテーブルにカラムを追加（既存データには影響なし）
ALTER TABLE news
ADD COLUMN IF NOT EXISTS subtitle TEXT,
ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '[]'::jsonb;

-- content カラムのコメントを追加（構造の説明）
COMMENT ON COLUMN news.content IS '段落ごとの配列。各要素は { text: string, image?: { src: string, alt: string } } の形式';

-- 既存のsummaryフィールドは後方互換性のため残す（オプショナル）

