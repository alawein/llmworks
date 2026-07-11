export const debugLog = (...args: unknown[]): void => {
  if (!import.meta.env.DEV) {
    return;
  }

  // eslint-disable-next-line no-console -- centralized dev-only diagnostics
  console.debug(...args);
};
