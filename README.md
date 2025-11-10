# Atlas HP – 開発ガイド

社内向け Atlas ホームページの開発フローをまとめたドキュメントです。新しく参画したメンバーでも迷わないよう、環境構築からリリースまでの手順を記載しています。

---

## 1. 事前準備

| ツール     | バージョン目安 | 備考                              |
| ---------- | -------------- | --------------------------------- |
| Node.js    | 20.x           | `asdf` や `nvm` でインストール    |
| pnpm       | 8.x 以上       | `npm i -g pnpm`                   |
| Git        | 2.x 以上       | GitHub へアクセスできる状態にする |
| Vercel CLI | 任意           | Preview への手動デプロイに利用    |

Supabase CLI も devDependencies に含まれているので、リポジトリ内で `pnpm exec supabase` が使えます。

---

## 2. リポジトリのセットアップ

```bash
git clone <REPO_URL>
cd atlas-hp
pnpm install             # 依存パッケージの導入
```

`pnpm install` のタイミングで Supabase CLI の実体も展開されます。失敗する場合は `pnpm rebuild supabase` を試してください。

---

## 3. Supabase プロジェクト

プロジェクトは以下の 2 つに分かれています。

| 用途          | Supabase              | Next.js            | Vercel scope              |
| ------------- | --------------------- | ------------------ | ------------------------- |
| 開発・Preview | **dev プロジェクト**  | ローカル / Preview | `Development` / `Preview` |
| 本番          | **prod プロジェクト** | Production         | `Production`              |

### 3-1. 必要な SQL

Supabase Dashboard の SQL Editor で次のファイルを実行して構成を揃えます。

1. `supabase/sql/supabase-schema.sql` – テーブル定義 & RLS
2. `supabase/sql/admin-users.sql` – 管理者判定関数とテーブル
3. `supabase/sql/storage-news-photos.sql`
4. `supabase/sql/storage-team-photos.sql`
5. `supabase/sql/storage-supporters-photos.sql`

### 3-2. 管理者アカウントの登録

```sql
insert into admin_users (email)
values ('your.email@example.com')
on conflict (email) do nothing;

select is_admin_user('your.email@example.com');  -- true になることを確認
```

---

## 4. 環境変数

### 4-1. ローカル開発 (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=<dev Supabase の URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<dev Supabase の Anon key>

# 必要に応じて
# NEXT_PUBLIC_SUPABASE_NEWS_BUCKET=news-photos
# NEXT_PUBLIC_SUPABASE_TEAM_BUCKET=team-photos
# NEXT_PUBLIC_SUPABASE_SUPPORTERS_BUCKET=supporters-photos
# NEXT_PUBLIC_SUPABASE_TEAM_FOLDER=dev
```

`.env.local` は `.gitignore` 済みです。Vercel CLI を使って同期する場合は `vercel env pull .env.local --environment=preview` を利用します。

### 4-2. Vercel 側

| scope                 | `NEXT_PUBLIC_SUPABASE_URL` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| --------------------- | -------------------------- | ------------------------------- |
| Development / Preview | dev プロジェクトを指定     | dev プロジェクトを指定          |
| Production            | prod プロジェクトを指定    | prod プロジェクトを指定         |

---

## 5. Supabase Auth の URL 設定（dev プロジェクト）

Preview とローカルで同じ dev Supabase を共有する場合は、環境に応じて **Site URL を切り替える運用** が必要です。

| 作業モード     | Site URL                                                   | Redirect URLs                                                                                                    |
| -------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| ローカル開発中 | `http://localhost:3000`                                    | `http://localhost:3000/admin/auth/callback`                                                                      |
| Preview 確認時 | `https://atlas-hp-dev.vercel.app`（固定 Preview ドメイン） | `https://atlas-hp-dev.vercel.app/admin/auth/callback`<br>`https://atlas-hp-git-*.vercel.app/admin/auth/callback` |

ローカルで十分動作確認したら、Preview を見る前に Site URL を Preview 用ドメインへ戻します。逆にローカル作業へ戻る際は再び `localhost` に切り替えます。

> ワイルドカード付き Preview ドメインとローカルを完全に共存させることはできないため、この切り替え運用が必要です。

---

## 6. 開発フロー

1. **ブランチ作成**

   - `main` から `feature/<ticket>` を切る

2. **ローカル開発**

   - Supabase の Site URL を `http://localhost:3000` に設定
   - `pnpm dev` で起動し、`http://localhost:3000` で動作確認
   - 管理画面のログインが dev Supabase を参照することを確認 (`is_admin_user` が true)

3. **Preview で QA**

   - Supabase Site URL を Preview ドメインに変更
   - ブランチを GitHub に push（または `pnpm exec vercel`）して Preview デプロイ
   - Preview の `/admin/*` で動作確認

4. **リリース**

   - Pull Request をレビューし `main` にマージ
   - Vercel が Production デプロイを実行
   - 必要に応じて prod Supabase にマイグレーションを適用 (`pnpm exec supabase db push --profile prod`)

5. **後片付け**
   - ローカル作業へ戻る場合は dev Supabase の Site URL を `http://localhost:3000` に戻す

---

## 7. よく使うコマンド

```bash
pnpm dev                      # ローカル開発サーバー
pnpm build                    # プロダクションビルド確認
pnpm run supabase -- --help   # Supabase CLI のコマンド一覧
pnpm exec supabase db diff    # スキーマ差分作成（要 profile）
pnpm exec supabase db push    # スキーマ適用（要 profile）
pnpm exec vercel              # Preview デプロイ
pnpm exec vercel --prod       # Production デプロイ
```

---

## 8. トラブルシューティング

| 症状                                       | 確認項目                                                                    |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| ログイン後に別ドメインへ飛ぶ               | Supabase の Site URL が正しい環境に設定されているか                         |
| 「管理者として登録されていない」           | `admin_users` にメールが登録されているか / `is_admin_user` が true を返すか |
| 画像アップロードでバケットが無いと言われる | `storage-*.sql` を dev / prod それぞれのプロジェクトで実行済みか            |
| Preview が本番 DB を参照する               | Vercel Preview scope の環境変数が dev Supabase を向いているか               |

---

詳細なセットアップ手順や RLS 方針は `docs/supabase-setup.md` および `docs/admin-setup.md` を参照してください。問題が解決しない場合は Slack の `#atlas-hp` チャンネルで相談してください。\*\*\* End Patch
