-- 2025-11-14 Newsコンテンツの画像構造更新および担当者名カラム追加
-- 実行前に必ずデータベースのバックアップを取得してください。

BEGIN;

-- 担当者名カラムを追加（存在しない場合のみ）
ALTER TABLE news
  ADD COLUMN IF NOT EXISTS contact_person TEXT;

-- content JSONB 内の image フィールドを images 配列へ統一
UPDATE news
SET content = COALESCE(
  (
    SELECT jsonb_agg(
      CASE
        WHEN jsonb_typeof(block) = 'object' THEN
          CASE
            WHEN block ? 'images' THEN
              jsonb_strip_nulls(
                (block - 'image') || jsonb_build_object(
                  'images',
                  COALESCE(
                    (
                      SELECT jsonb_agg(image_obj)
                      FROM (
                        SELECT jsonb_build_object(
                          'src', COALESCE(image_elem->>'src', ''),
                          'alt', COALESCE(image_elem->>'alt', '')
                        ) AS image_obj
                        FROM jsonb_array_elements(
                          CASE
                            WHEN jsonb_typeof(block->'images') = 'array' THEN block->'images'
                            ELSE '[]'::jsonb
                          END
                        ) AS image_elem
                        WHERE COALESCE(image_elem->>'src', '') <> ''
                      ) AS normalized_images
                    ),
                    '[]'::jsonb
                  )
                )
              )
            WHEN block ? 'image' THEN
              jsonb_strip_nulls(
                (block - 'image') || jsonb_build_object(
                  'images',
                  CASE
                    WHEN block->'image' IS NULL THEN '[]'::jsonb
                    ELSE jsonb_build_array(
                      jsonb_build_object(
                        'src', COALESCE(block->'image'->>'src', ''),
                        'alt', COALESCE(block->'image'->>'alt', '')
                      )
                    )
                  END
                )
              )
            ELSE
              jsonb_strip_nulls(
                block || jsonb_build_object('images', '[]'::jsonb)
              )
          END
        ELSE
          block
      END
    )
    FROM jsonb_array_elements(news.content) AS block
  ),
  '[]'::jsonb
)
WHERE news.content IS NOT NULL;

COMMIT;


