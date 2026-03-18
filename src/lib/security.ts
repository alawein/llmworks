/**
 * Security headers utility
 * Provides common security headers for fetch requests
 */

function getSecurityHeaders(_mode: 'development' | 'production'): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}

export function applySecurityHeaders(headers: HeadersInit = {}): HeadersInit {
  const securityHeaders = getSecurityHeaders(import.meta.env.MODE as 'development' | 'production');

  return {
    ...Object.fromEntries(
      headers instanceof Headers
        ? headers.entries()
        : Array.isArray(headers)
          ? headers
          : Object.entries(headers)
    ),
    ...Object.fromEntries(
      Object.entries(securityHeaders).filter(
        ([key]) => !['Strict-Transport-Security', 'Content-Security-Policy'].includes(key)
      )
    ),
  };
}

export async function secureFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = applySecurityHeaders(options.headers);

  return fetch(url, {
    ...options,
    headers,
    credentials: 'same-origin',
  });
}
