import type { NextRequest } from "next/server";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_DURATION_MS = 30 * 60 * 1000;

type RateLimitRecord = {
  attempts: number;
  firstAttempt: number;
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

const rateLimitStore = new Map<string, RateLimitRecord>();

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
