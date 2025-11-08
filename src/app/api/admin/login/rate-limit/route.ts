import { NextRequest, NextResponse } from "next/server";

// レート制限の設定
const MAX_ATTEMPTS = 5; // 最大試行回数
const WINDOW_MS = 15 * 60 * 1000; // 15分間のウィンドウ
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 30分間ブロック

// メモリベースのレート制限ストア（本番環境ではRedisなどを推奨）
const rateLimitStore = new Map<
  string,
  { attempts: number; firstAttempt: number; blockedUntil?: number }
>();

function getClientIdentifier(request: NextRequest): string {
  // IPアドレスとUser-Agentを組み合わせて識別子を作成
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  return `${ip}-${userAgent}`;
}

function cleanupOldEntries() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.blockedUntil && value.blockedUntil < now) {
      rateLimitStore.delete(key);
    } else if (!value.blockedUntil && now - value.firstAttempt > WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }
}

export async function POST(request: NextRequest) {
  cleanupOldEntries();

  const identifier = getClientIdentifier(request);
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // ブロック中かチェック
  if (record?.blockedUntil && record.blockedUntil > now) {
    const remainingMinutes = Math.ceil((record.blockedUntil - now) / 60000);
    return NextResponse.json(
      {
        allowed: false,
        message: `ログイン試行回数が上限に達しました。${remainingMinutes}分後に再試行してください。`,
        retryAfter: record.blockedUntil,
      },
      { status: 429 }
    );
  }

  // 新しいレコードまたはリセット
  if (!record || now - record.firstAttempt > WINDOW_MS) {
    rateLimitStore.set(identifier, {
      attempts: 1,
      firstAttempt: now,
    });
    return NextResponse.json({ allowed: true, attempts: 1 });
  }

  // 試行回数を増やす
  const newAttempts = record.attempts + 1;
  rateLimitStore.set(identifier, {
    attempts: newAttempts,
    firstAttempt: record.firstAttempt,
    blockedUntil: newAttempts >= MAX_ATTEMPTS ? now + BLOCK_DURATION_MS : undefined,
  });

  if (newAttempts >= MAX_ATTEMPTS) {
    return NextResponse.json(
      {
        allowed: false,
        message: `ログイン試行回数が上限に達しました。30分後に再試行してください。`,
        retryAfter: now + BLOCK_DURATION_MS,
      },
      { status: 429 }
    );
  }

  return NextResponse.json({
    allowed: true,
    attempts: newAttempts,
    remaining: MAX_ATTEMPTS - newAttempts,
  });
}

export async function DELETE(request: NextRequest) {
  // ログイン成功時に呼び出してレート制限をリセット
  const identifier = getClientIdentifier(request);
  rateLimitStore.delete(identifier);
  return NextResponse.json({ success: true });
}

