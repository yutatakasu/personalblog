-- 2025-11-11 Newsテーブルのマイグレーション
-- 実行前にデータのバックアップを取得してください。
--
-- 変更内容:
-- 1. tag列とインデックスを削除
-- 2. contact_email列を追加

BEGIN;

-- 1. タグ列とインデックスを削除
DROP INDEX IF EXISTS idx_news_tag;

ALTER TABLE news DROP COLUMN IF EXISTS tag;

-- 2. 問い合わせメールアドレス列を追加
ALTER TABLE news ADD COLUMN IF NOT EXISTS contact_email TEXT;

COMMIT;