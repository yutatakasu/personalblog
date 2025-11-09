import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { isAdminUser } from "@/lib/supabase/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/setup");
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Failed to get admin user:", error);
    redirect("/admin/login");
  }

  if (!user) {
    redirect("/admin/login");
  }

  if (!(await isAdminUser(supabase, user))) {
    redirect("/admin/login?error=unauthorized");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
