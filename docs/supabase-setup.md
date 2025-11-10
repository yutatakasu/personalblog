# Supabase セットアップガイド

このドキュメントでは、Atlas HP プロジェクトで Supabase をセットアップする手順を説明します。

## 1. Supabase プロジェクトの作成

1. [Supabase](https://supabase.com/) にアクセスしてアカウントを作成（またはログイン）
2. 新しいプロジェクトを作成
3. プロジェクトの設定から以下を取得：
   - Project URL
   - Anon public key

## 2. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**注意**: `.env.local` は `.gitignore` に含まれているため、Git にコミットされません。

## 3. Supabase CLI の利用

ダッシュボードに加えて、Supabase CLI を使ってローカルでスキーマやストレージの管理を行えるように設定済みです。

### 3.1 前提

- `pnpm install` 済み（`supabase` CLI が `devDependencies` に追加されています）
- `pnpm run supabase` コマンドで Supabase CLI を呼び出せます

```bash
pnpm run supabase -- --version
```

### 3.2 初期化済みディレクトリ

- `supabase/config.toml`: Supabase CLI が生成する基本設定ファイル（このリポジトリですでに作成済み）
- `supabase/sql`: 既存の SQL スクリプト群。CLI の `db push`/`db pull` を使う際は、このフォルダをベースに整理します
- 今後 CLI で `supabase start` や `supabase db diff` を実行すると、`supabase/migrations/` や `supabase/functions/` などの公式構成が追加されます

### 3.3 ログインとリンク

1. Supabase Access Token をダッシュボードの [Account Settings > Access Tokens](https://supabase.com/dashboard/account/tokens) で発行
2. CLI からログイン：

   ```bash
   pnpm run supabase -- login
   ```

3. プロジェクトをリンク（初回のみ）：

   ```bash
   pnpm run supabase -- link --project-ref <your-project-ref>
   ```

   `project-ref` はダッシュボードの URL（例: `https://app.supabase.com/project/<project-ref>`）から確認できます。

### 3.4 よく使うコマンド

| コマンド | 用途 |
| --- | --- |
| `pnpm run supabase -- status` | ローカル開発用コンテナの状態確認 |
| `pnpm run supabase -- start` | Supabase ローカル環境の起動 |
| `pnpm run supabase -- db pull` | リモート DB からスキーマを取得（`supabase/migrations` 以下に反映） |
| `pnpm run supabase -- db push` | ローカルで変更したスキーマをリモートに反映（十分にレビューしてから実行） |
| `pnpm run supabase -- db diff` | リモートとの差分からマイグレーション SQL を生成 |
| `pnpm run supabase -- functions deploy` | Edge Functions をデプロイ（今後導入する場合） |

> **注意:** `db push` はリモートのスキーマを書き換えるため、必ずレビュー済みの SQL／マイグレーションで実行してください。必要に応じて Preview 環境で先にテストすることを推奨します。

### 3.5 ダッシュボードとの使い分け

- **CLI**: スキーマ変更やマイグレーション作成、ローカル開発環境の起動に便利
- **ダッシュボード**: データのクイック編集、Storage バケット管理、Auth 設定などの GUI 操作に便利

CLI を使ってマイグレーションを管理しつつ、運用ではダッシュボードでデータを編集するのが推奨フローです。

## 4. データベーススキーマの作成

1. Supabase Dashboard の SQL Editor を開く
2. `docs/supabase-schema.sql` の内容をコピーして実行
3. これにより以下のテーブルが作成されます：
   - `news` - ニュース記事
   - `positions` - 募集情報
   - `team_members` - チームメンバー
   - `investor_groups` - 投資家グループ

## 5. 初期データの投入

Supabase Dashboard の Table Editor から、各テーブルに初期データを投入してください。

### news テーブル

`src/models/news.ts` の `defaultNewsItems` を参考に、以下の形式でデータを投入：

```json
{
  "id": "atlas-os-v2-release",
  "title": "Atlas OS v2 を正式リリース",
  "date": "2025.09.12",
  "thumbnail_src": "/members_far_from.jpg",
  "thumbnail_alt": "Atlas OS v2 product interface preview",
  "link": "/news/atlas-os-v2-release",
  "summary": "長期記憶に最適化したオーケストレーション機能と、監査可能なイベントタイムラインを追加しました。",
  "tag": "Product Update"
}
```

### positions テーブル

`src/models/positions.ts` の `defaultPositions` を参考に、以下の形式でデータを投入：

```json
{
  "id": "ai-systems-engineer",
  "title": "AI Systems Engineer",
  "department": "Atlas Core",
  "location": "Tokyo / Remote",
  "work_style": "Hybrid",
  "teaser": "メモリと推論を結ぶ心臓部を、ともに磨き上げる仲間を探しています。",
  "summary": "長期記憶レイヤーと推論エンジンの連携を最適化し、Atlas の知覚・応答品質を継続的に高めます。",
  "responsibilities": ["分散メモリ基盤と推論パイプラインの技術課題を特定・解決する", "..."],
  "requirements": ["Python / TypeScript いずれかのプロダクション経験", "..."],
  "apply_email": "careers@atlas.inc"
}
```

### team_members テーブル

`src/models/team.ts` の `defaultTeamMembers` を参考に、以下の形式でデータを投入：

```json
{
  "id": "yuki-miyazaki",
  "name": "Yuki Miyazaki",
  "title": "Founder & CEO",
  "focus": "長期的な記憶レイヤー戦略を定義し、Atlas 全体のビジョンとガバナンスをリードします。",
  "image_src": "/favicon.svg",
  "image_alt": "Yuki Miyazaki",
  "position_row": 1,
  "position_column": 1,
  "position_offset_y": "-24px"
}
```

### investor_groups テーブル

`src/models/backed_by.ts` の `defaultInvestorGroups` を参考に、以下の形式でデータを投入：

```json
{
  "category": "Lead Investors",
  "supporters": ["North Star Ventures", "FutureFabric Capital", "Tokyo Frontier Fund"]
}
```

## 6. Supabase Storage の設定

ニュースのサムネイルおよび本文内の画像は Supabase Storage の `news-photos` バケットに保存します。

1. Supabase Dashboard の **Storage** を開く
2. 「Create bucket」をクリックし、以下の設定でバケットを作成
   - **Name**: `news-photos`
   - **Public bucket**: 有効（公開URLを取得するため）
3. 必要に応じて、チームメンバーやサポーター管理で使用する `team-photos` / `supporters-photos` などのバケットも同様に用意
4. バケット名や保存先フォルダを変更したい場合は、`.env.local` に以下の環境変数を設定（未設定時はデフォルト値を使用）:

   ```env
   NEXT_PUBLIC_SUPABASE_NEWS_BUCKET=news-photos
   NEXT_PUBLIC_SUPABASE_NEWS_FOLDER=
   ```

   `NEXT_PUBLIC_SUPABASE_NEWS_FOLDER` を指定すると、バケット直下ではなくサブフォルダに画像を保存できます。

5. SQL Editor で `supabase/sql/storage-news-photos.sql` を実行し、`news-photos` バケット用の RLS ポリシー（閲覧は公開、アップロード/更新/削除は管理者のみ）を設定してください

## 7. 動作確認

1. 開発サーバーを起動：
   ```bash
   pnpm dev
   ```

2. ブラウザで `http://localhost:3000` にアクセス
3. ニュースページ (`/news`) や採用ページ (`/positions`) が正常に表示されることを確認

## 8. フェイルセーフ機能

この実装では、Supabase が利用できない場合や環境変数が設定されていない場合、デフォルトデータ（`src/models/*.ts` の `default*` 配列）が自動的に使用されます。

これにより、以下のメリットがあります：

- **開発環境**: 環境変数を設定せずに開発を開始できる
- **本番環境**: Supabase に障害が発生してもサイトが動作し続ける
- **段階的移行**: Supabase への移行を段階的に行える

## 9. データ更新方法

### 管理画面から更新（推奨）

非エンジニアでも簡単にコンテンツを更新できる管理画面を用意しています。

1. `docs/admin-setup.md` を参照して管理画面をセットアップ
2. `/admin/login` にアクセスしてログイン
3. 各セクション（ニュース、募集情報など）からコンテンツを管理

詳細は `docs/admin-setup.md` を参照してください。

### Supabase Dashboard から更新

1. Supabase Dashboard の Table Editor を開く
2. 対象のテーブルを選択
3. 行を追加・編集・削除

**注意**: 管理画面の使用を推奨します。より使いやすく、バリデーションも含まれています。

## 10. トラブルシューティング

### データが表示されない

1. 環境変数が正しく設定されているか確認
2. Supabase Dashboard でテーブルにデータが存在するか確認
3. ブラウザのコンソールでエラーを確認
4. ネットワークタブで Supabase へのリクエストが成功しているか確認

### 型エラーが発生する

1. `pnpm install` を実行して依存関係を更新
2. TypeScript の型チェックを実行：`pnpm tsc --noEmit`

## 11. 参考資料

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

