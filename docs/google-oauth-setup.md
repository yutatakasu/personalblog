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

- Site URL: `http://localhost:3001` (開発環境) または本番URL
- Redirect URLs: `http://localhost:3001/admin/auth/callback` を追加

## 3. 環境変数の設定

`.env.local` ファイルに、許可するGoogleアカウントのメールアドレスを設定：

```env
# 管理者のメールアドレス（Googleアカウントのメールアドレス）
ADMIN_EMAILS=your-email@gmail.com
NEXT_PUBLIC_ADMIN_EMAILS=your-email@gmail.com

# Supabase設定（既に設定済みのはず）
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**重要**: 
- `ADMIN_EMAILS` と `NEXT_PUBLIC_ADMIN_EMAILS` に、許可するGoogleアカウントのメールアドレスを設定
- 複数の管理者がいる場合は、カンマ区切りで指定: `email1@gmail.com,email2@gmail.com`

## 4. RLSポリシーの更新

`docs/supabase-admin-rls-strict.sql` を実行して、Googleアカウントのメールアドレスに更新してください。

```sql
-- 例: Googleアカウントのメールアドレスに変更
auth.jwt() ->> 'email' IN (
  'your-email@gmail.com'
  -- 複数の管理者がいる場合は追加:
  -- , 'another-admin@gmail.com'
)
```

## 5. 動作確認

1. 開発サーバーを起動：
   ```bash
   pnpm dev
   ```

2. `http://localhost:3001/admin/login` にアクセス

3. **「Googleでログイン」** ボタンをクリック

4. Googleアカウントでログイン

5. 環境変数に設定したメールアドレスと一致する場合のみ、管理画面にアクセスできます

## 6. レート制限について

ログイン試行回数が5回を超えると、30分間ブロックされます。これはブルートフォース攻撃を防ぐための保護機能です。

- **最大試行回数**: 5回
- **時間ウィンドウ**: 15分
- **ブロック時間**: 30分

## 7. トラブルシューティング

### Google OAuthが動作しない

1. Google Cloud ConsoleでリダイレクトURIが正しく設定されているか確認
2. Supabase DashboardでGoogleプロバイダーが有効になっているか確認
3. クライアントIDとシークレットが正しく設定されているか確認

### 「このアカウントには管理画面へのアクセス権限がありません」と表示される

1. `.env.local` の `ADMIN_EMAILS` と `NEXT_PUBLIC_ADMIN_EMAILS` に、ログインしたGoogleアカウントのメールアドレスが含まれているか確認
2. メールアドレスの大文字小文字が一致しているか確認
3. 環境変数を変更した場合は、開発サーバーを再起動

### レート制限エラーが表示される

- 15分間で5回以上のログイン試行を行った場合、30分間ブロックされます
- 時間が経過するまで待つか、サーバーを再起動してレート制限をリセット

