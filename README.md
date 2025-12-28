# Personal Blog

個人ブログのCMSとウェブサイトです。

## 技術スタック

- **Framework**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth)
- **Storage**: Supabase Storage

---

## セットアップ

### 1. 依存パッケージのインストール

```bash
pnpm install
```

### 2. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com/) でアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトの Settings > API から以下を取得:
   - Project URL
   - anon public key

### 3. 環境変数の設定

`.env.local` ファイルを作成:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. データベースのセットアップ

Supabase Dashboard の SQL Editor で以下のファイルを順番に実行:

1. **`supabase/sql/supabase-schema.sql`** - ブログ記事テーブルの作成
2. **`supabase/sql/admin-users.sql`** - 管理者認証の設定
3. **`supabase/sql/storage-news-photos.sql`** - 画像ストレージの設定

### 5. 管理者アカウントの登録

SQL Editor で実行:

```sql
INSERT INTO admin_users (email)
VALUES ('your.email@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- 登録確認
SELECT is_admin_user('your.email@gmail.com');  -- true が返ればOK
```

### 6. Google認証の設定

1. Supabase Dashboard > Authentication > Providers > Google を有効化
2. [Google Cloud Console](https://console.cloud.google.com/) でOAuth 2.0クライアントIDを作成
3. Authorized redirect URIs に追加:
   - `https://your-project.supabase.co/auth/v1/callback`
4. Client ID と Client Secret を Supabase に設定

### 7. Site URLの設定

Supabase Dashboard > Authentication > URL Configuration:

- **Site URL**: `http://localhost:3000` (開発時) または本番ドメイン
- **Redirect URLs**:
  - `http://localhost:3000/admin/auth/callback`
  - `https://your-domain.com/admin/auth/callback` (本番用)

---

## 開発

```bash
pnpm dev
```

http://localhost:3000 でブログを確認
http://localhost:3000/admin で管理画面にアクセス

---

## 機能

### ブログ記事

- カテゴリー分類
- 下書き/公開ステータス
- サムネイル画像
- リッチコンテンツ（複数段落、画像）

### 管理画面 (`/admin`)

- Google認証によるログイン
- 記事の作成・編集・削除
- 画像のアップロード

---

## ディレクトリ構成

```
src/
├── app/
│   ├── page.tsx              # ブログトップページ
│   ├── posts/[id]/page.tsx   # 記事詳細ページ
│   └── admin/                # 管理画面
├── components/
│   └── admin/                # 管理画面コンポーネント
├── lib/
│   └── supabase/             # Supabaseクライアント
└── models/
    └── news.ts               # 記事の型定義
```

---

## デプロイ

### Vercel

1. GitHubリポジトリをVercelに接続
2. 環境変数を設定:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. デプロイ

### Supabase本番設定

1. Site URLを本番ドメインに変更
2. Redirect URLsに本番ドメインを追加
