import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  evaluateLoginRateLimit,
  getLoginRateLimitIdentifier,
} from "@/lib/security/login-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CookieOperation = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

function createCookieAwareClient(request: NextRequest, cookieOperations: CookieOperation[]) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name) => request.cookies.get(name)?.value,
      set: (name, value, options) => {
        cookieOperations.push({ name, value, options });
      },
      remove: (name, options) => {
        cookieOperations.push({ name, value: "", options: { ...options, maxAge: 0 } });
      },
    },
  });
}

export async function GET(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.redirect(new URL("/admin/setup", request.nextUrl.origin));
  }

  const cookieOperations: CookieOperation[] = [];
  const cookieAwareClient = createCookieAwareClient(request, cookieOperations);

  const identifier = getLoginRateLimitIdentifier(request);
  const evaluation = evaluateLoginRateLimit(identifier);

  if (!evaluation.allowed) {
    const params = new URLSearchParams({
      error: "rate_limited",
    });

    const message =
      evaluation.reason === "blocked"
        ? `ログイン試行回数が上限に達しました。${Math.ceil(
            Math.max(evaluation.blockedUntil - Date.now(), 0) / 60000,
          )}分後に再試行してください。`
        : "ログイン試行回数が上限に達しました。30分後に再試行してください。";

    params.set("error_description", encodeURIComponent(message));

    const response = NextResponse.redirect(new URL(`/admin/login?${params.toString()}`, request.nextUrl.origin));
    cookieOperations.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
    return response;
  }

  const { data, error } = await cookieAwareClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: new URL("/admin/auth/callback", request.nextUrl.origin).toString(),
    },
  });

  if (error || !data?.url) {
    console.error("Failed to start Supabase OAuth flow", error);
    const params = new URLSearchParams({
      error: "oauth_start_failed",
      ...(error?.message ? { error_description: encodeURIComponent(error.message) } : {}),
    });
    const response = NextResponse.redirect(new URL(`/admin/login?${params.toString()}`, request.nextUrl.origin));
    cookieOperations.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
    return response;
  }

  const response = NextResponse.redirect(data.url);
  cookieOperations.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
  return response;
}

