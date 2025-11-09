import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/supabase/admin-auth";

type CookieOperation = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

function buildRedirect(
  origin: string,
  path: string,
  params?: Record<string, string>,
) {
  const url = new URL(path, origin);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }
  return url;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const errorParam = requestUrl.searchParams.get("error");
  const errorDescription =
    requestUrl.searchParams.get("error_description") ?? undefined;

  if (errorParam) {
    const redirectUrl = buildRedirect(requestUrl.origin, "/admin/login", {
      error: errorParam,
      ...(errorDescription ? { error_description: errorDescription } : {}),
    });
    return NextResponse.redirect(redirectUrl);
  }

  if (!code) {
    const redirectUrl = buildRedirect(requestUrl.origin, "/admin/login", {
      error: "missing_code",
    });
    return NextResponse.redirect(redirectUrl);
  }

  const cookieOperations: CookieOperation[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          cookieOperations.push({ name, value, options });
        },
        remove: (name, options) => {
          cookieOperations.push({
            name,
            value: "",
            options: { ...options, maxAge: 0 },
          });
        },
      },
    },
  );

  const {
    data: { session },
    error,
  } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !session) {
    console.error("Supabase exchangeCodeForSession error", error);
    const redirectUrl = buildRedirect(requestUrl.origin, "/admin/login", {
      error: "exchange_failed",
      ...(error?.message ? { error_description: error.message } : {}),
    });
    const response = NextResponse.redirect(redirectUrl);
    cookieOperations.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  }

  if (!(await isAdminSession(supabase, session))) {
    await supabase.auth.signOut();
    const redirectUrl = buildRedirect(requestUrl.origin, "/admin/login", {
      error: "unauthorized",
      error_description: encodeURIComponent(
        "管理者として登録されていないGoogleアカウントです。",
      ),
    });
    const response = NextResponse.redirect(redirectUrl);
    cookieOperations.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  }

  const redirectUrl = buildRedirect(requestUrl.origin, "/admin/hub");
  const response = NextResponse.redirect(redirectUrl);
  cookieOperations.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
  return response;
}
