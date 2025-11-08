import { redirect } from "next/navigation";
import { adminSupabase, isSupabaseConfigured } from "@/lib/supabase/admin";
import { AdminLayout } from "@/components/admin/AdminLayout";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || [
  "admin@atlas.inc",
];

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/setup");
  }

  const {
    data: { session },
  } = await adminSupabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const userEmail = session.user.email;
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    redirect("/admin/login?error=unauthorized");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
