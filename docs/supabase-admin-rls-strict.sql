-- より厳格な管理画面用のRLSポリシー
-- 特定のメールアドレスのみが書き込み可能になるように設定します
-- 
-- 使用方法:
-- 1. 以下のSQLの <YOUR_ADMIN_EMAIL> を実際の管理者のメールアドレスに置き換える
-- 2. 複数の管理者がいる場合は、OR条件で追加する
-- 3. Supabase Dashboard の SQL Editor で実行

-- 既存の書き込みポリシーを削除
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

-- 特定のメールアドレスのみが書き込み可能なポリシーを作成
-- ここに管理者のメールアドレスを設定してください

-- News テーブル
CREATE POLICY "Allow admin insert on news" ON news
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'admin@atlas.inc'  -- 管理者のメールアドレスをここに追加
      -- 複数の管理者がいる場合は、以下のように追加:
      -- , 'another-admin@atlas.inc'
    )
  );

CREATE POLICY "Allow admin update on news" ON news
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@atlas.inc'
      -- , 'another-admin@atlas.inc'
    )
  )
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'admin@atlas.inc'
      -- , 'another-admin@atlas.inc'
    )
  );

CREATE POLICY "Allow admin delete on news" ON news
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@atlas.inc'
      -- , 'another-admin@atlas.inc'
    )
  );

-- Positions テーブル
CREATE POLICY "Allow admin insert on positions" ON positions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'admin@atlas.inc'
      -- , 'another-admin@atlas.inc'
    )
  );

CREATE POLICY "Allow admin update on positions" ON positions
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@atlas.inc'
      -- , 'another-admin@atlas.inc'
    )
  )
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'admin@atlas.inc'
      -- , 'another-admin@atlas.inc'
    )
  );

CREATE POLICY "Allow admin delete on positions" ON positions
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@atlas.inc'
      -- , 'another-admin@atlas.inc'
    )
  );

-- Team Members テーブル
CREATE POLICY "Allow admin insert on team_members" ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'admin@atlas.inc'
      -- , 'another-admin@atlas.inc'
    )
  );

CREATE POLICY "Allow admin update on team_members" ON team_members
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@atlas.inc'
      -- , 'another-admin@atlas.inc'
    )
  )
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'admin@atlas.inc'
      -- , 'another-admin@atlas.inc'
    )
  );

CREATE POLICY "Allow admin delete on team_members" ON team_members
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@atlas.inc'
      -- , 'another-admin@atlas.inc'
    )
  );

-- Investor Groups テーブル
CREATE POLICY "Allow admin insert on investor_groups" ON investor_groups
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'admin@atlas.inc'
      -- , 'another-admin@atlas.inc'
    )
  );

CREATE POLICY "Allow admin update on investor_groups" ON investor_groups
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@atlas.inc'
      -- , 'another-admin@atlas.inc'
    )
  )
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'admin@atlas.inc'
      -- , 'another-admin@atlas.inc'
    )
  );

CREATE POLICY "Allow admin delete on investor_groups" ON investor_groups
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@atlas.inc'
      -- , 'another-admin@atlas.inc'
    )
  );

