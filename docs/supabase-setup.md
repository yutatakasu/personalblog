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

## 3. データベーススキーマの作成

1. Supabase Dashboard の SQL Editor を開く
2. `docs/supabase-schema.sql` の内容をコピーして実行
3. これにより以下のテーブルが作成されます：
   - `news` - ニュース記事
   - `positions` - 募集情報
   - `team_members` - チームメンバー
   - `investor_groups` - 投資家グループ

## 4. 初期データの投入

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

## 5. 動作確認

1. 開発サーバーを起動：
   ```bash
   pnpm dev
   ```

2. ブラウザで `http://localhost:3000` にアクセス
3. ニュースページ (`/news`) や採用ページ (`/positions`) が正常に表示されることを確認

## 6. フェイルセーフ機能

この実装では、Supabase が利用できない場合や環境変数が設定されていない場合、デフォルトデータ（`src/models/*.ts` の `default*` 配列）が自動的に使用されます。

これにより、以下のメリットがあります：

- **開発環境**: 環境変数を設定せずに開発を開始できる
- **本番環境**: Supabase に障害が発生してもサイトが動作し続ける
- **段階的移行**: Supabase への移行を段階的に行える

## 7. データ更新方法

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

## 8. トラブルシューティング

### データが表示されない

1. 環境変数が正しく設定されているか確認
2. Supabase Dashboard でテーブルにデータが存在するか確認
3. ブラウザのコンソールでエラーを確認
4. ネットワークタブで Supabase へのリクエストが成功しているか確認

### 型エラーが発生する

1. `pnpm install` を実行して依存関係を更新
2. TypeScript の型チェックを実行：`pnpm tsc --noEmit`

## 参考資料

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

