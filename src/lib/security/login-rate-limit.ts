import type { NextRequest } from "next/server";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_DURATION_MS = 30 * 60 * 1000;
const EXTENDED_BLOCK_DURATION_MS = 60 * 60 * 1000; // 1時間（30分以上連続失敗時）
const CONTINUOUS_FAILURE_THRESHOLD_MS = 30 * 60 * 1000; // 30分

type RateLimitRecord = {
  attempts: number;
  firstAttempt: number;
  lastFailure: number; // 最後の失敗時刻
  blockedUntil?: number;
};

export type LoginRateLimitEvaluation =
  | {
      allowed: true;
      attempts: number;
      remaining: number;
    }
  | {
      allowed: false;
      reason: "blocked" | "exceeded";
      blockedUntil: number;
    };

// IPベースのレート制限ストア（ログイン開始時のブロックチェック用）
const rateLimitStore = new Map<string, RateLimitRecord>();

// メールアドレスベースのレート制限ストア（認証失敗時の記録用）
const emailRateLimitStore = new Map<string, RateLimitRecord>();

function cleanupRateLimitStore(now: number) {
  for (const [identifier, record] of rateLimitStore.entries()) {
    if (record.blockedUntil) {
      if (record.blockedUntil <= now) {
        rateLimitStore.delete(identifier);
      }
      continue;
    }

    if (now - record.firstAttempt > WINDOW_MS) {
      rateLimitStore.delete(identifier);
    }
  }
}

function cleanupEmailRateLimitStore(now: number) {
  for (const [email, record] of emailRateLimitStore.entries()) {
    if (record.blockedUntil) {
      if (record.blockedUntil <= now) {
        emailRateLimitStore.delete(email);
      }
      continue;
    }

    if (now - record.firstAttempt > WINDOW_MS) {
      emailRateLimitStore.delete(email);
    }
  }
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function getLoginRateLimitIdentifier(request: NextRequest): string {
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  return `${ip}-${userAgent}`;
}

export function evaluateLoginRateLimit(
  identifier: string,
  now = Date.now(),
): LoginRateLimitEvaluation {
  cleanupRateLimitStore(now);

  const record = rateLimitStore.get(identifier);

  if (record?.blockedUntil && record.blockedUntil > now) {
    return {
      allowed: false,
      reason: "blocked",
      blockedUntil: record.blockedUntil,
    };
  }

  if (!record) {
    rateLimitStore.set(identifier, {
      attempts: 1,
      firstAttempt: now,
      lastFailure: now,
    });

    return {
      allowed: true,
      attempts: 1,
      remaining: MAX_ATTEMPTS - 1,
    };
  }

  const withinWindow = now - record.firstAttempt <= WINDOW_MS;
  const attempts = withinWindow ? record.attempts + 1 : 1;
  const firstAttempt = withinWindow ? record.firstAttempt : now;

  if (attempts >= MAX_ATTEMPTS) {
    const blockedUntil = now + BLOCK_DURATION_MS;
    rateLimitStore.set(identifier, {
      attempts,
      firstAttempt,
      lastFailure: now,
      blockedUntil,
    });

    return {
      allowed: false,
      reason: "exceeded",
      blockedUntil,
    };
  }

  rateLimitStore.set(identifier, {
    attempts,
    firstAttempt,
    lastFailure: now,
  });

  return {
    allowed: true,
    attempts,
    remaining: MAX_ATTEMPTS - attempts,
  };
}

export function resetLoginRateLimit(identifier: string) {
  rateLimitStore.delete(identifier);
}

/**
 * メールアドレスベースでレート制限をリセット
 */
export function resetEmailRateLimit(email: string) {
  const normalizedEmail = normalizeEmail(email);
  emailRateLimitStore.delete(normalizedEmail);
}

/**
 * ブロック状態のみをチェックする（カウントは増やさない）
 * ログイン開始時に使用し、認証結果に関係なくカウントを増やさないようにする
 */
export function checkLoginRateLimit(
  identifier: string,
  now = Date.now(),
): LoginRateLimitEvaluation {
  cleanupRateLimitStore(now);

  const record = rateLimitStore.get(identifier);

  if (record?.blockedUntil && record.blockedUntil > now) {
    return {
      allowed: false,
      reason: "blocked",
      blockedUntil: record.blockedUntil,
    };
  }

  // ブロックされていない場合は、allowed: true を返す
  // ただし、attempts や remaining は返さない（カウントを増やさないため）
  return {
    allowed: true,
    attempts: record?.attempts ?? 0,
    remaining: record ? MAX_ATTEMPTS - record.attempts : MAX_ATTEMPTS,
  };
}

/**
 * メールアドレスベースでレート制限をチェック
 */
export function checkEmailRateLimit(
  email: string,
  now = Date.now(),
): LoginRateLimitEvaluation {
  cleanupEmailRateLimitStore(now);

  const normalizedEmail = normalizeEmail(email);
  const record = emailRateLimitStore.get(normalizedEmail);

  if (record?.blockedUntil && record.blockedUntil > now) {
    return {
      allowed: false,
      reason: "blocked",
      blockedUntil: record.blockedUntil,
    };
  }

  return {
    allowed: true,
    attempts: record?.attempts ?? 0,
    remaining: record ? MAX_ATTEMPTS - record.attempts : MAX_ATTEMPTS,
  };
}

/**
 * 認証失敗時に呼び出してカウントを増やす（メールアドレスベース）
 */
export function recordLoginFailureByEmail(
  email: string,
  now = Date.now(),
): LoginRateLimitEvaluation {
  cleanupEmailRateLimitStore(now);

  const normalizedEmail = normalizeEmail(email);
  const record = emailRateLimitStore.get(normalizedEmail);

  if (record?.blockedUntil && record.blockedUntil > now) {
    return {
      allowed: false,
      reason: "blocked",
      blockedUntil: record.blockedUntil,
    };
  }

  // 30分以上連続で失敗しているかチェック
  const isContinuousFailure =
    record &&
    record.lastFailure &&
    now - record.lastFailure <= CONTINUOUS_FAILURE_THRESHOLD_MS &&
    now - record.firstAttempt >= CONTINUOUS_FAILURE_THRESHOLD_MS;

  if (!record) {
    emailRateLimitStore.set(normalizedEmail, {
      attempts: 1,
      firstAttempt: now,
      lastFailure: now,
    });

    return {
      allowed: true,
      attempts: 1,
      remaining: MAX_ATTEMPTS - 1,
    };
  }

  const withinWindow = now - record.firstAttempt <= WINDOW_MS;
  const attempts = withinWindow ? record.attempts + 1 : 1;
  const firstAttempt = withinWindow ? record.firstAttempt : now;

  if (attempts >= MAX_ATTEMPTS || isContinuousFailure) {
    // 30分以上連続で失敗している場合は、より長いブロック時間を適用
    const blockDuration = isContinuousFailure
      ? EXTENDED_BLOCK_DURATION_MS
      : BLOCK_DURATION_MS;
    const blockedUntil = now + blockDuration;

    emailRateLimitStore.set(normalizedEmail, {
      attempts,
      firstAttempt,
      lastFailure: now,
      blockedUntil,
    });

    return {
      allowed: false,
      reason: isContinuousFailure ? "blocked" : "exceeded",
      blockedUntil,
    };
  }

  emailRateLimitStore.set(normalizedEmail, {
    attempts,
    firstAttempt,
    lastFailure: now,
  });

  return {
    allowed: true,
    attempts,
    remaining: MAX_ATTEMPTS - attempts,
  };
}

/**
 * 認証失敗時に呼び出してカウントを増やす（IPベース、後方互換性のため残す）
 * @deprecated メールアドレスベースの recordLoginFailureByEmail を使用してください
 */
export function recordLoginFailure(
  identifier: string,
  now = Date.now(),
): LoginRateLimitEvaluation {
  cleanupRateLimitStore(now);

  const record = rateLimitStore.get(identifier);

  if (record?.blockedUntil && record.blockedUntil > now) {
    return {
      allowed: false,
      reason: "blocked",
      blockedUntil: record.blockedUntil,
    };
  }

  if (!record) {
    rateLimitStore.set(identifier, {
      attempts: 1,
      firstAttempt: now,
      lastFailure: now,
    });

    return {
      allowed: true,
      attempts: 1,
      remaining: MAX_ATTEMPTS - 1,
    };
  }

  const withinWindow = now - record.firstAttempt <= WINDOW_MS;
  const attempts = withinWindow ? record.attempts + 1 : 1;
  const firstAttempt = withinWindow ? record.firstAttempt : now;

  if (attempts >= MAX_ATTEMPTS) {
    const blockedUntil = now + BLOCK_DURATION_MS;
    rateLimitStore.set(identifier, {
      attempts,
      firstAttempt,
      lastFailure: now,
      blockedUntil,
    });

    return {
      allowed: false,
      reason: "exceeded",
      blockedUntil,
    };
  }

  rateLimitStore.set(identifier, {
    attempts,
    firstAttempt,
    lastFailure: now,
  });

  return {
    allowed: true,
    attempts,
    remaining: MAX_ATTEMPTS - attempts,
  };
}
