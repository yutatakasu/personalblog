-- 管理画面用のRLSポリシー更新
-- このSQLファイルをSupabaseのSQL Editorで実行して、認証済みユーザーが書き込みできるようにしてください

-- 既存の書き込みポリシーを削除（もし存在する場合）
DROP POLICY IF EXISTS "Allow authenticated insert on news" ON news;
DROP POLICY IF EXISTS "Allow authenticated update on news" ON news;
DROP POLICY IF EXISTS "Allow authenticated delete on news" ON news;

DROP POLICY IF EXISTS "Allow authenticated insert on positions" ON positions;
DROP POLICY IF EXISTS "Allow authenticated update on positions" ON positions;
DROP POLICY IF EXISTS "Allow authenticated delete on positions" ON positions;

DROP POLICY IF EXISTS "Allow authenticated insert on team_members" ON team_members;
DROP POLICY IF EXISTS "Allow authenticated update on team_members" ON team_members;
DROP POLICY IF EXISTS "Allow authenticated delete on team_members" ON team_members;

DROP POLICY IF EXISTS "Allow authenticated insert on investor_groups" ON investor_groups;
DROP POLICY IF EXISTS "Allow authenticated update on investor_groups" ON investor_groups;
DROP POLICY IF EXISTS "Allow authenticated delete on investor_groups" ON investor_groups;

-- 認証済みユーザーが書き込み可能なポリシーを作成
-- 注意: より細かい権限管理が必要な場合は、ユーザーテーブルを作成して管理者フラグを追加してください

-- News テーブル
CREATE POLICY "Allow authenticated insert on news" ON news
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on news" ON news
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on news" ON news
  FOR DELETE
  TO authenticated
  USING (true);

-- Positions テーブル
CREATE POLICY "Allow authenticated insert on positions" ON positions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on positions" ON positions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on positions" ON positions
  FOR DELETE
  TO authenticated
  USING (true);

-- Team Members テーブル
CREATE POLICY "Allow authenticated insert on team_members" ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on team_members" ON team_members
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on team_members" ON team_members
  FOR DELETE
  TO authenticated
  USING (true);

-- Investor Groups テーブル
CREATE POLICY "Allow authenticated insert on investor_groups" ON investor_groups
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on investor_groups" ON investor_groups
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on investor_groups" ON investor_groups
  FOR DELETE
  TO authenticated
  USING (true);

-- 注意事項:
-- 1. このポリシーは、Supabaseに認証されたすべてのユーザーが書き込み可能にします
-- 2. より厳格な権限管理が必要な場合は、以下のような方法を検討してください:
--    - ユーザーテーブルを作成し、管理者フラグを追加
--    - 特定のメールアドレスのみにアクセスを許可するポリシーを作成
--    - SupabaseのRLS関数を使用して、より複雑な権限チェックを実装

