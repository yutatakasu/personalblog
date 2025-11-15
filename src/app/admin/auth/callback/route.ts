import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import {
  checkEmailRateLimit,
  recordLoginFailureByEmail,
  resetEmailRateLimit,
} from "@/lib/security/login-rate-limit";
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

  // セッションからメールアドレスを取得（認証失敗時でも取得できる場合がある）
  const userEmail = session?.user?.email;

  if (error || !session) {
    console.error("Supabase exchangeCodeForSession error", error);
    // メールアドレスが取得できない場合はIPベースでチェック
    // （通常はここでは取得できないが、念のため）
    if (userEmail) {
      const rateLimitEvaluation = recordLoginFailureByEmail(userEmail);
      const redirectUrl = buildRedirect(requestUrl.origin, "/admin/login", {
        error: "exchange_failed",
        ...(error?.message ? { error_description: error.message } : {}),
        ...(rateLimitEvaluation.allowed === false
          ? {
              rate_limit_message: encodeURIComponent(
                rateLimitEvaluation.reason === "blocked"
                  ? `ログイン試行回数が上限に達しました。${Math.ceil(
                      Math.max(
                        rateLimitEvaluation.blockedUntil - Date.now(),
                        0,
                      ) / 60000,
                    )}分後に再試行してください。`
                  : "ログイン試行回数が上限に達しました。しばらくしてから再試行してください。",
              ),
            }
          : {}),
      });
      const response = NextResponse.redirect(redirectUrl);
      cookieOperations.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
      return response;
    }
    // メールアドレスが取得できない場合は、エラーメッセージのみ表示
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

  // ログイン試行前にメールアドレスベースでレート制限をチェック
  if (userEmail) {
    const emailRateLimitCheck = checkEmailRateLimit(userEmail);
    if (emailRateLimitCheck.allowed === false) {
      await supabase.auth.signOut();
      const redirectUrl = buildRedirect(requestUrl.origin, "/admin/login", {
        error: "rate_limited",
        error_description: encodeURIComponent(
          `このアカウントはログイン試行回数が上限に達しました。${Math.ceil(
            Math.max(emailRateLimitCheck.blockedUntil - Date.now(), 0) / 60000,
          )}分後に再試行してください。`,
        ),
      });
      const response = NextResponse.redirect(redirectUrl);
      cookieOperations.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
      return response;
    }
  }

  if (!(await isAdminSession(supabase, session))) {
    await supabase.auth.signOut();
    // 認証失敗（権限なし）時にメールアドレスベースでカウントを増やす
    if (userEmail) {
      const rateLimitEvaluation = recordLoginFailureByEmail(userEmail);
      const redirectUrl = buildRedirect(requestUrl.origin, "/admin/login", {
        error: "unauthorized",
        error_description: encodeURIComponent(
          "管理者として登録されていないGoogleアカウントです。",
        ),
        ...(rateLimitEvaluation.allowed === false
          ? {
              rate_limit_message: encodeURIComponent(
                rateLimitEvaluation.reason === "blocked"
                  ? `ログイン試行回数が上限に達しました。${Math.ceil(
                      Math.max(
                        rateLimitEvaluation.blockedUntil - Date.now(),
                        0,
                      ) / 60000,
                    )}分後に再試行してください。`
                  : "ログイン試行回数が上限に達しました。しばらくしてから再試行してください。",
              ),
            }
          : {}),
      });
      const response = NextResponse.redirect(redirectUrl);
      cookieOperations.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
      return response;
    }
    // メールアドレスが取得できない場合
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

  // 認証成功時にメールアドレスベースでレート制限をリセット
  if (userEmail) {
    resetEmailRateLimit(userEmail);
  }

  const redirectUrl = buildRedirect(requestUrl.origin, "/admin/hub");
  const response = NextResponse.redirect(redirectUrl);
  cookieOperations.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
  return response;
}
