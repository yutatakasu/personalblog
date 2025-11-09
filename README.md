This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variables & Local Development

- 本番・Preview 環境の環境変数は Vercel Project Settings → Environment Variables に登録してください。
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ローカル開発では Vercel CLI を使って同じ値を同期できます。
  ```bash
  npm i -g vercel
  vercel login
  vercel env pull .env.local        # Production 環境の値を取得
  # Preview や Development を取得したい場合は --environment フラグを使用:
  # vercel env pull .env.local --environment=preview
  pnpm dev
  ```
- `.env.local` は `.gitignore` によりコミットされません。必要な人が各自で `vercel env pull` を実行してください。
- 詳細なセットアップ手順は `docs/supabase-setup.md` と `docs/admin-setup.md` を参照してください（管理者権限は Supabase Authentication のユーザーメタデータで設定します）。

# atlas-hp
