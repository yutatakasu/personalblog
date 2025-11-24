-- Contact Messages テーブルの追加
-- このSQLを Supabase の SQL Editor で実行して、問い合わせフォームの保存先を作成してください。

CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    -- ContactEntryId（例: news-article / position-apply / company-general など）
    entry_id TEXT NOT NULL,
    -- メール送信に実際に使用した件名（Atlas 側で決定されたもの）
    subject TEXT NOT NULL,
    -- ユーザーが入力した件名（company-general など editable な場合のみ）
    user_subject TEXT,
    -- フォーム入力
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    -- newsId / positionId / titleForSubject などの文脈情報
    context JSONB,
    -- 簡易的なメタ情報（IP や User-Agent は運用上のトラブルシュートにのみ使用）
    user_agent TEXT,
    remote_addr TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE contact_messages IS 'Atlas HP の問い合わせフォームから送信されたメッセージのログ';

COMMENT ON COLUMN contact_messages.entry_id IS 'ContactEntryId（news-article / position-apply / careers-general / company-general / privacy-inquiry など）';

COMMENT ON COLUMN contact_messages.context IS 'newsId / positionId / titleForSubject などの送信元コンテキスト';

-- インデックス（新着順に表示するため created_at に付与）
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at DESC);

-- RLS 設定
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- フロントエンド（未認証ユーザー）と認証済みユーザーのどちらからも INSERT を許可
CREATE POLICY "Allow insert on contact_messages for all roles" ON contact_messages FOR INSERT TO anon,
authenticated
WITH
    CHECK (true);

-- 認証済みユーザーのみ読み取り可能（管理画面用）
CREATE POLICY "Allow authenticated select on contact_messages" ON contact_messages FOR
SELECT TO authenticated USING (true);