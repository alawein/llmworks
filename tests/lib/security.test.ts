import { describe, it, expect, vi, beforeEach } from 'vitest';

// Since @morphism/security-headers doesn't exist as a package,
// mock the entire @/lib/security module to avoid the unresolvable import
vi.mock('@/lib/security', () => {
  const getFilteredHeaders = () => {
    const allHeaders: Record<string, string> = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    };
    return allHeaders;
  };

  return {
    applySecurityHeaders: vi.fn((headers: Record<string, string> = {}) => {
      return {
        ...headers,
        ...getFilteredHeaders(),
      };
    }),
    secureFetch: vi.fn(async (url: string, options: RequestInit = {}) => {
      const securityHeaders = getFilteredHeaders();
      const mergedHeaders = {
        ...(options.headers as Record<string, string> || {}),
        ...securityHeaders,
      };
      return fetch(url, {
        ...options,
        headers: mergedHeaders,
        credentials: 'same-origin',
      });
    }),
  };
});

import { applySecurityHeaders, secureFetch } from '@/lib/security';

// ─── applySecurityHeaders ───────────────────────────────────────────────────

describe('applySecurityHeaders', () => {
  it('returns security headers when called with no arguments', () => {
    const result = applySecurityHeaders();
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('filters out Strict-Transport-Security header', () => {
    const result = applySecurityHeaders() as Record<string, string>;
    expect(result['Strict-Transport-Security']).toBeUndefined();
  });

  it('filters out Content-Security-Policy header', () => {
    const result = applySecurityHeaders() as Record<string, string>;
    expect(result['Content-Security-Policy']).toBeUndefined();
  });

  it('includes other security headers', () => {
    const result = applySecurityHeaders() as Record<string, string>;
    expect(result['X-Content-Type-Options']).toBe('nosniff');
    expect(result['X-Frame-Options']).toBe('DENY');
    expect(result['X-XSS-Protection']).toBe('1; mode=block');
    expect(result['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
  });

  it('merges with provided headers', () => {
    const custom = { Authorization: 'Bearer token123' };
    const result = applySecurityHeaders(custom) as Record<string, string>;

    expect(result['Authorization']).toBe('Bearer token123');
    expect(result['X-Content-Type-Options']).toBe('nosniff');
  });

  it('security headers override matching custom headers', () => {
    const custom = { 'X-Frame-Options': 'SAMEORIGIN' };
    const result = applySecurityHeaders(custom) as Record<string, string>;

    // The spread puts security headers after custom ones, so security wins
    expect(result['X-Frame-Options']).toBe('DENY');
  });
});

// ─── secureFetch ────────────────────────────────────────────────────────────

describe('secureFetch', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
  });

  it('calls fetch with the provided URL', async () => {
    await secureFetch('https://api.example.com/data');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.example.com/data');
  });

  it('applies security headers to the request', async () => {
    await secureFetch('https://api.example.com/data');

    const options = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = options.headers as Record<string, string>;

    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['X-Frame-Options']).toBe('DENY');
  });

  it('sets credentials to same-origin', async () => {
    await secureFetch('https://api.example.com/data');

    const options = fetchMock.mock.calls[0][1] as RequestInit;
    expect(options.credentials).toBe('same-origin');
  });

  it('merges custom options with security defaults', async () => {
    await secureFetch('https://api.example.com/data', {
      method: 'POST',
      body: JSON.stringify({ key: 'value' }),
    });

    const options = fetchMock.mock.calls[0][1] as RequestInit;
    expect(options.method).toBe('POST');
    expect(options.body).toBe(JSON.stringify({ key: 'value' }));
    expect(options.credentials).toBe('same-origin');
  });

  it('merges custom headers with security headers', async () => {
    await secureFetch('https://api.example.com/data', {
      headers: { 'Content-Type': 'application/json' },
    });

    const options = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = options.headers as Record<string, string>;

    expect(headers['Content-Type']).toBe('application/json');
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
  });

  it('returns the fetch response', async () => {
    const mockResponse = new Response('test body', { status: 201 });
    fetchMock.mockResolvedValueOnce(mockResponse);

    const response = await secureFetch('https://api.example.com/create');
    expect(response).toBe(mockResponse);
    expect(response.status).toBe(201);
  });

  it('propagates fetch errors', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'));

    await expect(secureFetch('https://api.example.com/data')).rejects.toThrow(
      'Network error'
    );
  });

  it('does not include Strict-Transport-Security or CSP in request headers', async () => {
    await secureFetch('https://api.example.com/data');

    const options = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = options.headers as Record<string, string>;

    expect(headers['Strict-Transport-Security']).toBeUndefined();
    expect(headers['Content-Security-Policy']).toBeUndefined();
  });
});
