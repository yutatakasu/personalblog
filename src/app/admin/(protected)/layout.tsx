import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  const supabase = createServerSupabaseClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Failed to get admin session:", error);
    redirect("/admin/login");
  }

  if (!session) {
    redirect("/admin/login");
  }

  const userEmail = session.user.email;
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    redirect("/admin/login?error=unauthorized");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
