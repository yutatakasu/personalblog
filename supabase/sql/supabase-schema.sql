-- Atlas HP Supabase Database Schema
-- このSQLファイルをSupabaseのSQL Editorで実行してテーブルを作成してください

-- News テーブル
CREATE TABLE IF NOT EXISTS news (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    thumbnail_src TEXT NOT NULL,
    thumbnail_alt TEXT NOT NULL,
    link TEXT NOT NULL,
    summary TEXT,
    subtitle TEXT,
    content JSONB NOT NULL DEFAULT '[]'::jsonb,
    contact_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- コンテンツ構造の説明
COMMENT ON COLUMN news.content IS '段落ごとの配列。各要素は { title: string, text: string, image?: { src: string, alt: string } | null } の形式';

-- Positions テーブル
CREATE TABLE IF NOT EXISTS positions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    work_style TEXT NOT NULL CHECK (
        work_style IN ('Onsite', 'Hybrid', 'Remote')
    ),
    teaser TEXT NOT NULL,
    summary TEXT NOT NULL,
    responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,
    requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    apply_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members テーブル
CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    focus TEXT NOT NULL,
    image_src TEXT NOT NULL,
    image_alt TEXT,
    position_row INTEGER NOT NULL,
    position_column INTEGER NOT NULL,
    position_offset_y TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investor Groups テーブル
CREATE TABLE IF NOT EXISTS investor_groups (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    supporters JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_news_date ON news (date DESC);

CREATE INDEX IF NOT EXISTS idx_positions_department ON positions (department);

CREATE INDEX IF NOT EXISTS idx_positions_work_style ON positions (work_style);

CREATE INDEX IF NOT EXISTS idx_team_members_position ON team_members (position_row, position_column);

-- RLS (Row Level Security) ポリシー
-- 読み取りは全員に許可、書き込みは認証済みユーザーのみ（必要に応じて調整）
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

ALTER TABLE positions ENABLE ROW LEVEL SECURITY;

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

ALTER TABLE investor_groups ENABLE ROW LEVEL SECURITY;

-- 読み取りポリシー（全員に許可）
CREATE POLICY "Allow public read access on news" ON news FOR
SELECT USING (true);

CREATE POLICY "Allow public read access on positions" ON positions FOR
SELECT USING (true);

CREATE POLICY "Allow public read access on team_members" ON team_members FOR
SELECT USING (true);

CREATE POLICY "Allow public read access on investor_groups" ON investor_groups FOR
SELECT USING (true);

-- 書き込みポリシー（認証済みユーザーのみ - 必要に応じて調整）
-- 現在は書き込みを無効化（Supabase Dashboardから直接管理する想定）
-- 管理画面が必要な場合は、認証機能を追加してポリシーを設定してください

-- updated_at を自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルにトリガーを設定
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_positions_updated_at
  BEFORE UPDATE ON positions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investor_groups_updated_at
  BEFORE UPDATE ON investor_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();