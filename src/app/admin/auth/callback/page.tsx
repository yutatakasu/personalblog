import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

type SearchParams = {
  code?: string;
  error?: string;
  error_description?: string;
};

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split("\,")
    .map((email) => email.trim())
    .filter((email) => email.length > 0);
}

function ErrorView({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
        <div className="text-center">
          <h1 className="font-serif text-xl text-red-900">認証エラー</h1>
          <p className="mt-2 text-sm text-red-800">{message}</p>
          <Link
            href="/admin/login"
            className="mt-4 inline-flex rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            ログインページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { code, error, error_description: errorDescription } = searchParams;

  if (error) {
    return <ErrorView message={decodeURIComponent(errorDescription ?? "認証に失敗しました。")} />;
  }

  if (!code) {
    return <ErrorView message="認証コードが取得できませんでした。" />;
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { session },
    error: exchangeError,
  } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError || !session) {
    console.error("Supabase exchangeCodeForSession error", exchangeError);
    return (
      <ErrorView
        message={exchangeError?.message ?? "認証コードの交換に失敗しました。"}
      />
    );
  }

  const adminEmails = getAdminEmails();
  const userEmail = session.user.email ?? "";

  if (adminEmails.length > 0 && !adminEmails.includes(userEmail)) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  try {
    await fetch("/api/admin/login/rate-limit", {
      method: "DELETE",
      cache: "no-store",
    });
  } catch (err) {
    console.warn("Failed to reset rate limit", err);
  }

  redirect("/admin/hub");
}
