-- 2025-11-11 Add contact email to news table
-- 実行前にデータのバックアップを取得してください。

BEGIN;

ALTER TABLE news
  ADD COLUMN IF NOT EXISTS contact_email TEXT;

COMMIT;

