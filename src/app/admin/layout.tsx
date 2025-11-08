import { redirect } from "next/navigation";
import { adminSupabase, isSupabaseConfigured } from "@/lib/supabase/admin";
import { AdminLayout } from "@/components/admin/AdminLayout";

// 管理者のメールアドレスリスト（環境変数から取得、または直接指定）
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || [
  "admin@atlas.inc", // デフォルトの管理者メールアドレス
];

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Supabase環境変数のチェック
  if (!isSupabaseConfigured()) {
    redirect("/admin/setup");
  }

  // 認証チェック
  const {
    data: { session },
  } = await adminSupabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  // 管理者チェック（メールアドレスで判定）
  const userEmail = session.user.email;
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    redirect("/admin/login?error=unauthorized");
  }

  return <AdminLayout>{children}</AdminLayout>;
}

