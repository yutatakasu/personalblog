import type { Session, SupabaseClient, User } from "@supabase/supabase-js";

export async function isAdminUser(
  supabase: SupabaseClient,
  user: User | null,
): Promise<boolean> {
  if (!user?.email) {
    return false;
  }

  try {
    const { data, error } = await supabase.rpc("is_admin_user", {
      user_email: user.email,
    });
    if (error) {
      console.error("Failed to verify admin user:", error);
      return false;
    }

    return data === true;
  } catch (err) {
    console.error("Unexpected error while verifying admin user:", err);
    return false;
  }
}

export async function isAdminSession(
  supabase: SupabaseClient,
  session: Session | null,
): Promise<boolean> {
  if (!session?.user) {
    return false;
  }

  return isAdminUser(supabase, session.user);
}
