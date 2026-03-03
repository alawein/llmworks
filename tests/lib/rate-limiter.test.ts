import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the environment module before importing the module under test
vi.mock('@/lib/environment', () => ({
  getConfig: vi.fn(() => ({
    features: {
      analytics: false,
      debugMode: false,
    },
    security: {
      rateLimiting: true,
    },
  })),
  isFeatureEnabled: vi.fn(() => false),
}));

import {
  RateLimiter,
  RateLimitPresets,
  createRateLimiter,
} from '@/lib/rate-limiter';

// ─── RateLimitPresets ────────────────────────────────────────────────────────

describe('RateLimitPresets', () => {
  it('defines a strict preset with 10 requests per minute', () => {
    expect(RateLimitPresets.strict.maxRequests).toBe(10);
    expect(RateLimitPresets.strict.windowMs).toBe(60_000);
  });

  it('defines a normal preset with 60 requests per minute', () => {
    expect(RateLimitPresets.normal.maxRequests).toBe(60);
    expect(RateLimitPresets.normal.windowMs).toBe(60_000);
  });

  it('defines a relaxed preset with 100 requests per minute', () => {
    expect(RateLimitPresets.relaxed.maxRequests).toBe(100);
    expect(RateLimitPresets.relaxed.windowMs).toBe(60_000);
  });

  it('defines an api preset with 100 requests per 15 minutes', () => {
    expect(RateLimitPresets.api.maxRequests).toBe(100);
    expect(RateLimitPresets.api.windowMs).toBe(15 * 60_000);
  });

  it('defines an auth preset with 5 requests per 15 minutes', () => {
    expect(RateLimitPresets.auth.maxRequests).toBe(5);
    expect(RateLimitPresets.auth.windowMs).toBe(15 * 60_000);
    expect(RateLimitPresets.auth.message).toContain('authentication');
  });

  it('defines a search preset with 30 requests per minute', () => {
    expect(RateLimitPresets.search.maxRequests).toBe(30);
  });

  it('defines a compute preset with 5 requests per minute', () => {
    expect(RateLimitPresets.compute.maxRequests).toBe(5);
  });
});

// ─── RateLimiter (SlidingWindowLimiter) ──────────────────────────────────────

describe('RateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests under the limit', async () => {
    const limiter = new RateLimiter({
      windowMs: 60_000,
      maxRequests: 3,
    });

    const r1 = await limiter.checkLimit('user1');
    expect(r1.allowed).toBe(true);

    const r2 = await limiter.checkLimit('user1');
    expect(r2.allowed).toBe(true);

    const r3 = await limiter.checkLimit('user1');
    expect(r3.allowed).toBe(true);
  });

  it('blocks requests over the limit', async () => {
    const limiter = new RateLimiter({
      windowMs: 60_000,
      maxRequests: 2,
    });

    await limiter.checkLimit('user1');
    await limiter.checkLimit('user1');

    const r3 = await limiter.checkLimit('user1');
    expect(r3.allowed).toBe(false);
  });

  it('returns correct rate limit info', async () => {
    const limiter = new RateLimiter({
      windowMs: 60_000,
      maxRequests: 5,
    });

    await limiter.checkLimit('user1');
    await limiter.checkLimit('user1');

    const { info } = await limiter.checkLimit('user1');
    expect(info.limit).toBe(5);
    // After 3 calls, remaining should be 2
    expect(info.remaining).toBe(2);
    expect(info.reset).toBeInstanceOf(Date);
  });

  it('resets the window after the time has passed', async () => {
    const limiter = new RateLimiter({
      windowMs: 1000,
      maxRequests: 1,
    });

    const r1 = await limiter.checkLimit('user1');
    expect(r1.allowed).toBe(true);

    const r2 = await limiter.checkLimit('user1');
    expect(r2.allowed).toBe(false);

    // Advance past the window
    vi.advanceTimersByTime(1001);

    const r3 = await limiter.checkLimit('user1');
    expect(r3.allowed).toBe(true);
  });

  it('tracks different keys independently', async () => {
    const limiter = new RateLimiter({
      windowMs: 60_000,
      maxRequests: 1,
    });

    // Use object contexts with different IPs so generateKey produces distinct keys
    const r1 = await limiter.checkLimit({ ip: '1.1.1.1' });
    expect(r1.allowed).toBe(true);

    // Different IP - should still be allowed
    const r2 = await limiter.checkLimit({ ip: '2.2.2.2' });
    expect(r2.allowed).toBe(true);

    // Same IP as first - should be blocked
    const r3 = await limiter.checkLimit({ ip: '1.1.1.1' });
    expect(r3.allowed).toBe(false);
  });

  it('uses custom keyGenerator when provided', async () => {
    const limiter = new RateLimiter({
      windowMs: 60_000,
      maxRequests: 1,
      keyGenerator: (ctx: unknown) => `custom:${(ctx as any).id}`,
    });

    const r1 = await limiter.checkLimit({ id: 'abc' });
    expect(r1.allowed).toBe(true);

    const r2 = await limiter.checkLimit({ id: 'abc' });
    expect(r2.allowed).toBe(false);

    // Different custom key
    const r3 = await limiter.checkLimit({ id: 'def' });
    expect(r3.allowed).toBe(true);
  });

  it('generates key from IP in request-like context', async () => {
    const limiter = new RateLimiter({
      windowMs: 60_000,
      maxRequests: 1,
    });

    const req = { ip: '192.168.1.1' };
    const r1 = await limiter.checkLimit(req);
    expect(r1.allowed).toBe(true);

    const r2 = await limiter.checkLimit(req);
    expect(r2.allowed).toBe(false);
  });

  it('falls back to "global" key for null/undefined context', async () => {
    const limiter = new RateLimiter({
      windowMs: 60_000,
      maxRequests: 1,
    });

    const r1 = await limiter.checkLimit(null);
    expect(r1.allowed).toBe(true);

    const r2 = await limiter.checkLimit(undefined);
    // Both null and undefined produce 'rate-limit:global'
    expect(r2.allowed).toBe(false);
  });

  it('provides retryAfter info when rate limited', async () => {
    const limiter = new RateLimiter({
      windowMs: 60_000,
      maxRequests: 1,
    });

    await limiter.checkLimit('user1');
    const { info } = await limiter.checkLimit('user1');

    expect(info.remaining).toBe(0);
    expect(info.retryAfter).toBeDefined();
    expect(typeof info.retryAfter).toBe('number');
  });
});

// ─── RateLimiter middleware ─────────────────────────────────────────────────

describe('RateLimiter middleware', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls next() when request is allowed', async () => {
    const limiter = new RateLimiter({
      windowMs: 60_000,
      maxRequests: 10,
      headers: true,
    });

    const middleware = limiter.middleware();
    const req = { ip: '10.0.0.1' };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn(),
    };
    const next = vi.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 429 when request is rate limited', async () => {
    const limiter = new RateLimiter({
      windowMs: 60_000,
      maxRequests: 1,
      headers: true,
    });

    const middleware = limiter.middleware();
    const req = { ip: '10.0.0.1' };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn(),
    };
    const next = vi.fn();

    // First request - allowed
    await middleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);

    // Second request - blocked
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  it('sets standard rate limit headers when headers option is true', async () => {
    const limiter = new RateLimiter({
      windowMs: 60_000,
      maxRequests: 10,
      headers: true,
    });

    const middleware = limiter.middleware();
    const req = { ip: '10.0.0.1' };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn(),
    };
    const next = vi.fn();

    await middleware(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 10);
    expect(res.setHeader).toHaveBeenCalledWith(
      'X-RateLimit-Remaining',
      expect.any(Number)
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      'X-RateLimit-Reset',
      expect.any(Number)
    );
  });

  it('sets draft RFC headers when draft_polli_ratelimit_headers is true', async () => {
    const limiter = new RateLimiter({
      windowMs: 60_000,
      maxRequests: 10,
      headers: true,
      draft_polli_ratelimit_headers: true,
    });

    const middleware = limiter.middleware();
    const req = { ip: '10.0.0.2' };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn(),
    };
    const next = vi.fn();

    await middleware(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('RateLimit-Limit', 10);
    expect(res.setHeader).toHaveBeenCalledWith(
      'RateLimit-Remaining',
      expect.any(Number)
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      'RateLimit-Reset',
      expect.any(String)
    );
  });

  it('uses custom error message', async () => {
    const limiter = new RateLimiter({
      windowMs: 60_000,
      maxRequests: 1,
      message: 'Slow down, partner!',
      headers: false,
    });

    const middleware = limiter.middleware();
    const req = { ip: '10.0.0.3' };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn(),
    };
    const next = vi.fn();

    await middleware(req, res, next);
    await middleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Slow down, partner!' })
    );
  });
});

// ─── createRateLimiter ──────────────────────────────────────────────────────

describe('createRateLimiter', () => {
  it('creates a limiter from a preset', () => {
    const limiter = createRateLimiter('strict');
    expect(limiter).toBeInstanceOf(RateLimiter);
  });

  it('allows overriding preset values', async () => {
    vi.useFakeTimers();

    const limiter = createRateLimiter('strict', { maxRequests: 2 });

    const r1 = await limiter.checkLimit('x');
    const r2 = await limiter.checkLimit('x');
    const r3 = await limiter.checkLimit('x');

    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
    expect(r3.allowed).toBe(false);

    vi.useRealTimers();
  });
});
