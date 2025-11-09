# Google OAuth認証のセットアップガイド

管理画面でGoogle OAuth認証を使用するためのセットアップ手順です。

## 1. Google Cloud Consoleでの設定

### 1.1 プロジェクトの作成

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. プロジェクト名を入力して作成

### 1.2 OAuth同意画面の設定

1. 左メニューから **「APIとサービス」** → **「OAuth同意画面」** を選択
2. **「外部」** を選択して作成
3. アプリ情報を入力：
   - **アプリ名**: Atlas Admin
   - **ユーザーサポートメール**: あなたのメールアドレス
   - **デベロッパーの連絡先情報**: あなたのメールアドレス
4. **「保存して次へ」** をクリック
5. スコープはデフォルトのままで **「保存して次へ」**
6. テストユーザーは後で設定するので **「保存して次へ」**
7. **「ダッシュボードに戻る」** をクリック

### 1.3 OAuth 2.0 クライアントIDの作成

1. 左メニューから **「APIとサービス」** → **「認証情報」** を選択
2. **「認証情報を作成」** → **「OAuth 2.0 クライアントID」** を選択
3. **アプリケーションの種類**: **「ウェブアプリケーション」** を選択
4. **名前**: Atlas Admin を入力
5. **承認済みのリダイレクトURI** に以下を追加：
   ```
   https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
   ```
   - `<your-supabase-project-ref>` は Supabase プロジェクトの参照IDです
   - Supabase Dashboard の Settings > API で確認できます
6. **「作成」** をクリック
7. **クライアントID** と **クライアントシークレット** をコピーして保存

## 2. Supabaseでの設定

### 2.1 Google OAuthプロバイダーの有効化

1. Supabase Dashboard にアクセス
2. プロジェクトを選択
3. 左メニューから **「Authentication」** → **「Providers」** を選択
4. **「Google」** を探して有効化
5. 以下の情報を入力：
   - **Client ID (for OAuth)**: Google Cloud Consoleで取得したクライアントID
   - **Client Secret (for OAuth)**: Google Cloud Consoleで取得したクライアントシークレット
6. **「Save」** をクリック

### 2.2 リダイレクトURLの確認

Supabase Dashboard の **「Authentication」** → **「URL Configuration」** で、以下のリダイレクトURLが設定されていることを確認：

- Site URL: `http://localhost:3000` (開発環境) または本番URL
- Redirect URLs: `http://localhost:3000/admin/auth/callback` を追加

## 3. Supabase設定の確認

`.env.local` ファイルに Supabase の公開キーが設定されていることを確認します：

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**重要**: 環境変数 `ADMIN_EMAILS` は使用しません。管理者権限は `admin_users` テーブルで管理します。

## 4. 管理者リストの設定

管理者権限は Supabase の `admin_users` テーブルで管理します。以下の手順を実施してください：

1. Supabase Dashboard の **SQL Editor** で `supabase/sql/admin-users.sql` を実行し、テーブルと関数を作成
2. Table Editor から `admin_users` テーブルを開き、管理者として許可する Google アカウントのメールアドレスを追加
   - メールアドレスは小文字で登録することを推奨（関数内で自動的に正規化されます）
   - 複数人いる場合は1行ずつメールアドレスを追加

## 5. RLSポリシーの設定

`supabase/sql/supabase-admin-rls-strict.sql` を Supabase の SQL Editor で実行し、`admin_users` に登録されているメールアドレスのユーザーだけが書き込みできるようにします。

このSQLファイルは、`is_admin_user(auth.jwt() ->> 'email')` を使用してJWTからメールアドレスを取得し、`admin_users` テーブルに存在するかチェックします。

## 6. 動作確認

1. 開発サーバーを起動：
   ```bash
   pnpm dev
   ```

2. `http://localhost:3000/admin/login` にアクセス

3. **「Googleでログイン」** ボタンをクリック

4. Googleアカウントでログイン

5. `admin_users` テーブルにメールアドレスが登録されている場合のみ、管理画面にアクセスできます

## 7. レート制限について

ログイン試行回数が5回を超えると、30分間ブロックされます。これはブルートフォース攻撃を防ぐための保護機能です。

- **最大試行回数**: 5回
- **時間ウィンドウ**: 15分
- **ブロック時間**: 30分

## 8. 認証フローの詳細

### 8.1 認証の流れ

1. **ログイン開始**: `/admin/login` で「Googleでログイン」ボタンをクリック
2. **OAuth認証**: Google の認証画面にリダイレクト
3. **認証完了**: Google が `/admin/auth/callback?code=...` にリダイレクト
4. **セッション交換**: Route Handler (`/admin/auth/callback/route.ts`) で認証コードをセッションに交換
5. **管理者チェック**: `is_admin_user` RPC関数で `admin_users` テーブルを確認
6. **Cookie保存**: セッション情報をCookieに保存
7. **リダイレクト**: `/admin/hub` にリダイレクト
8. **レイアウトチェック**: `/admin/(protected)/layout.tsx` で `getUser()` を使用してユーザーを取得し、再度管理者権限を確認
9. **管理画面表示**: 管理者の場合のみ管理画面を表示

### 8.2 セキュリティの仕組み

- **Route Handler**: OAuth認証完了後、Cookieにセッション情報を書き込む（Server ComponentではCookieの書き込みができないため）
- **`getUser()` の使用**: `getSession()` の代わりに `getUser()` を使用して、Supabase Authサーバーで認証データを検証
- **二重チェック**: Route Handler と サーバー側レイアウトの両方で管理者権限を確認
- **RLSポリシー**: データベース側でも `is_admin_user` 関数を使用して書き込み権限を制御

## 9. トラブルシューティング

### Google OAuthが動作しない

1. Google Cloud ConsoleでリダイレクトURIが正しく設定されているか確認
2. Supabase DashboardでGoogleプロバイダーが有効になっているか確認
3. クライアントIDとシークレットが正しく設定されているか確認

### 「このアカウントには管理画面へのアクセス権限がありません」と表示される

1. `admin_users` テーブルに対象メールアドレスが登録されているか確認
2. メールアドレスを追加した後は、一度ログアウトしてから再度 Google でログイン
3. `supabase/sql/supabase-admin-rls-strict.sql` を最新状態で適用しているか確認

### レート制限エラーが表示される

- 15分間で5回以上のログイン試行を行った場合、30分間ブロックされます
- 時間が経過するまで待つか、サーバーを再起動してレート制限をリセット

