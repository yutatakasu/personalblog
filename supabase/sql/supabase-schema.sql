-- Personal Blog Supabase Database Schema
-- このSQLファイルをSupabaseのSQL Editorで実行してテーブルを作成してください

-- News/Posts テーブル（ブログ記事）
CREATE TABLE IF NOT EXISTS news (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    thumbnail_src TEXT,
    thumbnail_alt TEXT NOT NULL DEFAULT '',
    link TEXT NOT NULL,
    summary TEXT,
    subtitle TEXT,
    content JSONB NOT NULL DEFAULT '[]'::jsonb,
    contact_person TEXT,
    contact_email TEXT,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- コンテンツ構造の説明
COMMENT ON COLUMN news.content IS '段落ごとの配列。各要素は { title?: string, text: string, images: { src: string, alt: string }[] } の形式';
COMMENT ON COLUMN news.category IS '記事のカテゴリー';
COMMENT ON COLUMN news.status IS '記事のステータス: draft（下書き）または published（公開）';

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_news_date ON news (date DESC);
CREATE INDEX IF NOT EXISTS idx_news_status ON news (status);
CREATE INDEX IF NOT EXISTS idx_news_category ON news (category);

-- RLS (Row Level Security) ポリシー
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- 読み取りポリシー（公開記事のみ一般公開、下書きは認証ユーザーのみ）
CREATE POLICY "Allow public read access on published news" ON news FOR
SELECT USING (status = 'published' OR auth.role() = 'authenticated');

-- 書き込みポリシー（認証済みユーザーのみ）
CREATE POLICY "Allow authenticated users to insert news" ON news FOR
INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update news" ON news FOR
UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete news" ON news FOR
DELETE TO authenticated USING (true);

-- updated_at を自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーを設定
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
