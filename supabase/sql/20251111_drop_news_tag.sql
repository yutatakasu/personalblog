-- 2025-11-11 Remove unused tag column from news table
-- 実行する前にバックアップを取得してください。

BEGIN;

DROP INDEX IF EXISTS idx_news_tag;

ALTER TABLE news
  DROP COLUMN IF EXISTS tag;

COMMIT;

