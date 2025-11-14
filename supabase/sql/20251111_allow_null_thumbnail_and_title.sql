-- 2025-11-11 Newsテーブルのマイグレーション
-- 実行前にデータのバックアップを取得してください。
--
-- 変更内容:
-- 1. thumbnail_srcをNULL許容にする
-- 2. content JSONB内のtitleをNULL許容にする（アプリケーション側で処理）

BEGIN;

-- 1. thumbnail_srcをNULL許容にする
ALTER TABLE news ALTER COLUMN thumbnail_src DROP NOT NULL;

COMMIT;