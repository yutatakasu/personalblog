import type { NextRequest } from "next/server";

const MAX_REQUESTS = 10;
const WINDOW_MS = 10 * 60 * 1000; // 10分
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 30分

type RateLimitRecord = {
  count: number;
  firstRequest: number;
  blockedUntil?: number;
};

export type ContactRateLimitEvaluation =
  | {
      allowed: true;
    }
  | {
      allowed: false;
      blockedUntil: number;
    };

const rateLimitStore = new Map<string, RateLimitRecord>();

function cleanupRateLimitStore(now: number) {
  for (const [identifier, record] of rateLimitStore.entries()) {
    if (record.blockedUntil && record.blockedUntil <= now) {
      rateLimitStore.delete(identifier);
      continue;
    }

    if (!record.blockedUntil && now - record.firstRequest > WINDOW_MS) {
      rateLimitStore.delete(identifier);
    }
  }
}

export function getContactRateLimitIdentifier(request: NextRequest): string {
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  return `${ip}-${userAgent}`;
}

export function evaluateContactRateLimit(
  identifier: string,
  now = Date.now(),
): ContactRateLimitEvaluation {
  cleanupRateLimitStore(now);

  const record = rateLimitStore.get(identifier);

  if (record?.blockedUntil && record.blockedUntil > now) {
    return {
      allowed: false,
      blockedUntil: record.blockedUntil,
    };
  }

  if (!record) {
    rateLimitStore.set(identifier, {
      count: 1,
      firstRequest: now,
    });
    return {
      allowed: true,
    };
  }

  const withinWindow = now - record.firstRequest <= WINDOW_MS;
  const count = withinWindow ? record.count + 1 : 1;
  const firstRequest = withinWindow ? record.firstRequest : now;

  if (count > MAX_REQUESTS) {
    const blockedUntil = now + BLOCK_DURATION_MS;
    rateLimitStore.set(identifier, {
      count,
      firstRequest,
      blockedUntil,
    });
    return {
      allowed: false,
      blockedUntil,
    };
  }

  rateLimitStore.set(identifier, {
    count,
    firstRequest,
  });

  return {
    allowed: true,
  };
}
