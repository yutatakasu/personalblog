-- 管理者ユーザー管理用テーブルとユーティリティ
--
-- 1. このSQLを Supabase Dashboard の SQL Editor で実行してください。
-- 2. 実行後、Table Editor から `admin_users` テーブルに管理者のメールアドレスを追加できます。
-- 3. 追加したメールアドレスのアカウントのみが管理画面の書き込み操作を実行できます。

-- 管理者テーブルの作成
CREATE TABLE IF NOT EXISTS admin_users (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS を有効化
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーが自身の権限を確認できるように SELECT を許可
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'admin_users'
      AND policyname = 'Allow authenticated select on admin_users'
  ) THEN
    CREATE POLICY "Allow authenticated select on admin_users" ON admin_users
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END;
$$;

-- 管理者チェック用の関数を作成
CREATE OR REPLACE FUNCTION is_admin_user(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  normalized_email TEXT;
BEGIN
  IF user_email IS NULL THEN
    RETURN FALSE;
  END IF;

  normalized_email := lower(trim(user_email));

  RETURN EXISTS (
    SELECT 1
    FROM admin_users
    WHERE lower(admin_users.email) = normalized_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;