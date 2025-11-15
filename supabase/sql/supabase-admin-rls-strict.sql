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

DROP POLICY IF EXISTS "Allow authenticated insert on investor_groups" ON investor_groups;

DROP POLICY IF EXISTS "Allow authenticated update on investor_groups" ON investor_groups;

DROP POLICY IF EXISTS "Allow authenticated delete on investor_groups" ON investor_groups;

-- `supabase/sql/admin-users.sql` を実行して admin_users テーブルと is_admin_user 関数を作成してください。

-- News テーブル
CREATE POLICY "Allow admin insert on news" ON news FOR INSERT TO authenticated
WITH
    CHECK (
        is_admin_user (auth.jwt () ->> 'email')
    );

CREATE POLICY "Allow admin update on news" ON news
FOR UPDATE
    TO authenticated USING (
        is_admin_user (auth.jwt () ->> 'email')
    )
WITH
    CHECK (
        is_admin_user (auth.jwt () ->> 'email')
    );

CREATE POLICY "Allow admin delete on news" ON news FOR DELETE TO authenticated USING (
    is_admin_user (auth.jwt () ->> 'email')
);

-- Positions テーブル
CREATE POLICY "Allow admin insert on positions" ON positions FOR INSERT TO authenticated
WITH
    CHECK (
        is_admin_user (auth.jwt () ->> 'email')
    );

CREATE POLICY "Allow admin update on positions" ON positions
FOR UPDATE
    TO authenticated USING (
        is_admin_user (auth.jwt () ->> 'email')
    )
WITH
    CHECK (
        is_admin_user (auth.jwt () ->> 'email')
    );

CREATE POLICY "Allow admin delete on positions" ON positions FOR DELETE TO authenticated USING (
    is_admin_user (auth.jwt () ->> 'email')
);

DROP POLICY IF EXISTS "Allow public read access on team_members" ON team_members;

CREATE POLICY "Allow public read access on team_members" ON team_members
  FOR SELECT
  USING (true);

-- Team Members テーブル
CREATE POLICY "Allow admin insert on team_members" ON team_members FOR INSERT TO authenticated
WITH
    CHECK (
        is_admin_user (auth.jwt () ->> 'email')
    );

CREATE POLICY "Allow admin update on team_members" ON team_members
FOR UPDATE
    TO authenticated USING (
        is_admin_user (auth.jwt () ->> 'email')
    )
WITH
    CHECK (
        is_admin_user (auth.jwt () ->> 'email')
    );

CREATE POLICY "Allow admin delete on team_members" ON team_members FOR DELETE TO authenticated USING (
    is_admin_user (auth.jwt () ->> 'email')
);

-- Investor Groups テーブル
CREATE POLICY "Allow admin insert on investor_groups" ON investor_groups FOR INSERT TO authenticated
WITH
    CHECK (
        is_admin_user (auth.jwt () ->> 'email')
    );

CREATE POLICY "Allow admin update on investor_groups" ON investor_groups
FOR UPDATE
    TO authenticated USING (
        is_admin_user (auth.jwt () ->> 'email')
    )
WITH
    CHECK (
        is_admin_user (auth.jwt () ->> 'email')
    );

CREATE POLICY "Allow admin delete on investor_groups" ON investor_groups FOR DELETE TO authenticated USING (
    is_admin_user (auth.jwt () ->> 'email')
);