/**
 * Lightweight sliding-window rate limiter for Next.js API routes.
 * In-memory storage with automated pruning.
 */
import { NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Prune expired entries every 3 minutes to avoid memory accumulation
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) {
        store.delete(key);
      }
    }
  }, 3 * 60 * 1000);
}

export interface RateLimitOptions {
  /** Maximum requests allowed within the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
  /** Custom descriptive name for error messages */
  name?: string;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check and increment the rate-limit counter for a key (typically IP + action)
 */
export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    const resetAt = now + opts.windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: opts.limit - 1, resetAt };
  }

  if (entry.count >= opts.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { success: true, remaining: opts.limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Extract client IP from standard proxy and edge headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

/**
 * Rate limit helper that directly returns a 429 NextResponse if rate limit is exceeded
 */
export function applyRateLimit(
  req: Request,
  opts: RateLimitOptions,
  actionKey = 'global'
): NextResponse | null {
  const ip = getClientIp(req);
  const key = `${actionKey}:${ip}`;
  const result = rateLimit(key, opts);

  if (!result.success) {
    const retrySec = Math.ceil((result.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      {
        error: `Too many requests${opts.name ? ` for ${opts.name}` : ''}. Please wait ${retrySec} seconds before trying again.`,
        retryAfter: retrySec,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retrySec),
          'X-RateLimit-Limit': String(opts.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
        },
      }
    );
  }

  return null;
}

// ── Pre-configured Security Profiles ──────────────────────────

/** Auth routes (Email verify, login): 5 attempts per 15 minutes */
export const authLimiter: RateLimitOptions = {
  limit: 5,
  windowMs: 15 * 60 * 1000,
  name: 'authentication',
};

/** Form submissions (Prayer request, contacts, event registration): 8 submissions per minute */
export const submitLimiter: RateLimitOptions = {
  limit: 8,
  windowMs: 60 * 1000,
  name: 'submissions',
};

/** Newsletter subscriptions: 5 per 10 minutes */
export const subscribeLimiter: RateLimitOptions = {
  limit: 5,
  windowMs: 10 * 60 * 1000,
  name: 'subscriptions',
};

/** Media uploads (Gallery, blog covers, event banners): 15 per minute */
export const uploadLimiter: RateLimitOptions = {
  limit: 15,
  windowMs: 60 * 1000,
  name: 'media upload',
};

/** Admin mutations: 40 operations per minute */
export const adminLimiter: RateLimitOptions = {
  limit: 40,
  windowMs: 60 * 1000,
  name: 'admin actions',
};

/** General read operations: 120 per minute */
export const generalLimiter: RateLimitOptions = {
  limit: 120,
  windowMs: 60 * 1000,
  name: 'API requests',
};
