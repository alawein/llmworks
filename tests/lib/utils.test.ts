import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  cn,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatPercent,
  formatBytes,
  truncate,
  capitalize,
  titleCase,
  debounce,
  throttle,
  memoize,
  sleep,
  retry,
} from '@/lib/utils';

// ─── formatCurrency ─────────────────────────────────────────────────────────

describe('formatCurrency', () => {
  it('formats a positive integer in USD by default', () => {
    expect(formatCurrency(100)).toBe('$100.00');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats negative values', () => {
    expect(formatCurrency(-49.99)).toBe('-$49.99');
  });

  it('formats decimal values with rounding', () => {
    expect(formatCurrency(19.999)).toBe('$20.00');
  });

  it('formats large numbers with comma grouping', () => {
    expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
  });

  it('supports EUR currency', () => {
    const result = formatCurrency(42, 'EUR');
    // Intl formats EUR with the euro sign
    expect(result).toContain('42.00');
  });

  it('supports GBP currency', () => {
    const result = formatCurrency(10, 'GBP');
    expect(result).toContain('10.00');
  });

  it('supports JPY currency (zero-decimal)', () => {
    const result = formatCurrency(1000, 'JPY');
    // JPY has no fractional digits
    expect(result).toContain('1,000');
  });
});

// ─── formatDate ─────────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('formats a Date object with default options', () => {
    // Use a fixed date to avoid locale inconsistencies
    const date = new Date(2024, 0, 15); // January 15, 2024
    const result = formatDate(date);
    expect(result).toContain('1');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('accepts an ISO date string', () => {
    const result = formatDate('2024-06-01T00:00:00Z');
    expect(result).toContain('2024');
  });

  it('applies custom DateTimeFormat options', () => {
    const date = new Date(2024, 11, 25);
    const result = formatDate(date, { year: 'numeric', month: 'long', day: 'numeric' });
    expect(result).toContain('December');
    expect(result).toContain('25');
    expect(result).toContain('2024');
  });

  it('formats with short month option', () => {
    const date = new Date(2024, 2, 5);
    const result = formatDate(date, { month: 'short', day: 'numeric' });
    expect(result).toContain('Mar');
  });
});

// ─── formatRelativeTime ─────────────────────────────────────────────────────

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "just now" for dates less than a minute ago', () => {
    const now = new Date('2024-06-15T12:00:00Z');
    vi.setSystemTime(now);
    const recent = new Date('2024-06-15T11:59:30Z'); // 30 seconds ago
    expect(formatRelativeTime(recent)).toBe('just now');
  });

  it('returns minutes ago', () => {
    const now = new Date('2024-06-15T12:00:00Z');
    vi.setSystemTime(now);
    const minutesAgo = new Date('2024-06-15T11:55:00Z'); // 5 minutes ago
    expect(formatRelativeTime(minutesAgo)).toBe('5m ago');
  });

  it('returns hours ago', () => {
    const now = new Date('2024-06-15T12:00:00Z');
    vi.setSystemTime(now);
    const hoursAgo = new Date('2024-06-15T09:00:00Z'); // 3 hours ago
    expect(formatRelativeTime(hoursAgo)).toBe('3h ago');
  });

  it('returns days ago', () => {
    const now = new Date('2024-06-15T12:00:00Z');
    vi.setSystemTime(now);
    const daysAgo = new Date('2024-06-13T12:00:00Z'); // 2 days ago
    expect(formatRelativeTime(daysAgo)).toBe('2d ago');
  });

  it('accepts a string date', () => {
    const now = new Date('2024-06-15T12:00:00Z');
    vi.setSystemTime(now);
    expect(formatRelativeTime('2024-06-15T11:00:00Z')).toBe('1h ago');
  });

  it('returns "just now" for exactly now', () => {
    const now = new Date('2024-06-15T12:00:00Z');
    vi.setSystemTime(now);
    expect(formatRelativeTime(now)).toBe('just now');
  });
});

// ─── formatNumber ───────────────────────────────────────────────────────────

describe('formatNumber', () => {
  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('formats small numbers without grouping', () => {
    expect(formatNumber(42)).toBe('42');
  });

  it('formats large numbers with comma grouping', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('formats negative numbers', () => {
    expect(formatNumber(-999)).toBe('-999');
  });

  it('formats decimal numbers', () => {
    expect(formatNumber(3.14159)).toBe('3.142');
  });
});

// ─── formatPercent ──────────────────────────────────────────────────────────

describe('formatPercent', () => {
  it('formats 1 as 100.0%', () => {
    expect(formatPercent(1)).toBe('100.0%');
  });

  it('formats 0 as 0.0%', () => {
    expect(formatPercent(0)).toBe('0.0%');
  });

  it('formats 0.5 as 50.0%', () => {
    expect(formatPercent(0.5)).toBe('50.0%');
  });

  it('formats 0.123 with one decimal', () => {
    expect(formatPercent(0.123)).toBe('12.3%');
  });

  it('formats negative percentages', () => {
    expect(formatPercent(-0.05)).toBe('-5.0%');
  });

  it('formats percentages greater than 100%', () => {
    expect(formatPercent(2.5)).toBe('250.0%');
  });
});

// ─── formatBytes ────────────────────────────────────────────────────────────

describe('formatBytes', () => {
  it('returns "0 B" for zero bytes', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  it('formats bytes', () => {
    expect(formatBytes(500)).toBe('500 B');
  });

  it('formats kilobytes', () => {
    expect(formatBytes(1024)).toBe('1 KB');
  });

  it('formats megabytes', () => {
    expect(formatBytes(1048576)).toBe('1 MB');
  });

  it('formats gigabytes', () => {
    expect(formatBytes(1073741824)).toBe('1 GB');
  });

  it('formats fractional values', () => {
    expect(formatBytes(1536)).toBe('1.5 KB');
  });

  it('formats a non-round megabyte value', () => {
    // 2.5 MB = 2621440 bytes
    expect(formatBytes(2621440)).toBe('2.5 MB');
  });
});

// ─── truncate ───────────────────────────────────────────────────────────────

describe('truncate', () => {
  it('returns the string as-is when shorter than length', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('returns the string as-is when exactly equal to length', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('truncates and appends "..." when longer than length', () => {
    expect(truncate('hello world', 5)).toBe('hello...');
  });

  it('handles empty string', () => {
    expect(truncate('', 5)).toBe('');
  });

  it('truncates at length 0', () => {
    expect(truncate('hello', 0)).toBe('...');
  });

  it('truncates at length 1', () => {
    expect(truncate('hello', 1)).toBe('h...');
  });
});

// ─── capitalize ─────────────────────────────────────────────────────────────

describe('capitalize', () => {
  it('capitalizes the first character of a lowercase word', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('leaves an already-capitalized word unchanged', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('handles a single character', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('handles empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('does not change the rest of the string', () => {
    expect(capitalize('hELLO')).toBe('HELLO');
  });
});

// ─── titleCase ──────────────────────────────────────────────────────────────

describe('titleCase', () => {
  it('capitalizes each word', () => {
    expect(titleCase('hello world')).toBe('Hello World');
  });

  it('handles a single word', () => {
    expect(titleCase('hello')).toBe('Hello');
  });

  it('handles multiple spaces between words', () => {
    // split(' ') produces empty strings for consecutive spaces; capitalize('') => ''
    expect(titleCase('hello  world')).toBe('Hello  World');
  });

  it('handles empty string', () => {
    expect(titleCase('')).toBe('');
  });

  it('handles already title-cased text', () => {
    expect(titleCase('Hello World')).toBe('Hello World');
  });
});

// ─── debounce ───────────────────────────────────────────────────────────────

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the function after the delay', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets the timer on repeated calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced();
    vi.advanceTimersByTime(100);
    debounced(); // reset
    vi.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('passes arguments to the debounced function', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('a', 'b');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('a', 'b');
  });

  it('only invokes with the last call arguments', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('first');
    debounced('second');
    debounced('third');

    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('third');
  });
});

// ─── throttle ───────────────────────────────────────────────────────────────

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the function immediately on the first invocation', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 200);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('blocks subsequent calls within the throttle window', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 200);

    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('allows a new call after the window has elapsed', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 200);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(200);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('passes arguments to the throttled function', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled('arg1', 'arg2');
    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });
});

// ─── memoize ────────────────────────────────────────────────────────────────

describe('memoize', () => {
  it('returns the cached result for identical arguments', () => {
    const fn = vi.fn((x: unknown) => (x as number) * 2);
    const memoized = memoize(fn);

    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('recomputes for different arguments', () => {
    const fn = vi.fn((x: unknown) => (x as number) * 2);
    const memoized = memoize(fn);

    expect(memoized(5)).toBe(10);
    expect(memoized(10)).toBe(20);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('handles multiple arguments', () => {
    const fn = vi.fn((a: unknown, b: unknown) => (a as number) + (b as number));
    const memoized = memoize(fn);

    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(2, 1)).toBe(3); // different args order
    expect(fn).toHaveBeenCalledTimes(2); // (1,2) cached, (2,1) is new
  });

  it('handles no-argument functions', () => {
    let counter = 0;
    const fn = vi.fn(() => ++counter);
    const memoized = memoize(fn);

    expect(memoized()).toBe(1);
    expect(memoized()).toBe(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

// ─── sleep ──────────────────────────────────────────────────────────────────

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves after the specified delay', async () => {
    const promise = sleep(500);
    vi.advanceTimersByTime(500);
    await expect(promise).resolves.toBeUndefined();
  });

  it('does not resolve before the delay', async () => {
    let resolved = false;
    sleep(500).then(() => {
      resolved = true;
    });

    vi.advanceTimersByTime(499);
    await Promise.resolve(); // flush microtasks
    expect(resolved).toBe(false);
  });
});

// ─── retry ──────────────────────────────────────────────────────────────────

describe('retry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the result on first success', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const promise = retry(fn);
    const result = await promise;
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and succeeds eventually', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('ok');

    const promise = retry(fn, 3, 100);

    // First call fails, then sleeps 100ms
    vi.advanceTimersByTime(100);
    await vi.runAllTimersAsync();

    const result = await promise;
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws after all attempts are exhausted', async () => {
    const fn = vi.fn().mockImplementation(() => Promise.reject(new Error('persistent failure')));

    let caughtError: Error | undefined;
    const promise = retry(fn, 3, 100).catch((e) => {
      caughtError = e;
    });

    // Flush all timers and microtasks for each retry sleep
    await vi.runAllTimersAsync();
    await promise;

    expect(caughtError).toBeDefined();
    expect(caughtError!.message).toBe('persistent failure');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('respects custom attempt count', async () => {
    const fn = vi.fn().mockImplementation(() => Promise.reject(new Error('fail')));

    // With only 1 attempt, it should throw immediately without sleeping
    await expect(retry(fn, 1, 100)).rejects.toThrow('fail');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

// ─── cn (class name merger) ─────────────────────────────────────────────────

describe('cn', () => {
  it('merges simple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('handles undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('merges conflicting tailwind classes', () => {
    // twMerge should resolve conflicting padding classes
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('merges conflicting tailwind text color', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles empty input', () => {
    expect(cn()).toBe('');
  });

  it('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });
});
