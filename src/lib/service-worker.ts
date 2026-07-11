/**
 * Service Worker registration and management
 * Provides offline functionality and performance caching
 */

interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

// Check if service worker is supported
export const isSwSupported = (): boolean => {
  return 'serviceWorker' in navigator;
};

// Register service worker
export const registerSW = async (
  config: ServiceWorkerConfig = {}
): Promise<ServiceWorkerRegistration | null> => {
  if (!isSwSupported()) {
    return null;
  }

  // Don't register in development
  if (import.meta.env.DEV) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // New content is available
            config.onUpdate?.(registration);
          } else {
            // Content is cached for offline use
            config.onSuccess?.(registration);
          }
        }
      });
    });

    // Listen for the service worker to take control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });

    return registration;
  } catch (error) {
    const swError = error as Error;
    console.error('[SW] Registration failed:', swError);
    config.onError?.(swError);
    return null;
  }
};

// Unregister service worker
export const unregisterSW = async (): Promise<boolean> => {
  if (!isSwSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const unregistered = await registration.unregister();
      return unregistered;
    }
    return true;
  } catch (error) {
    console.error('[SW] Unregistration failed:', error);
    return false;
  }
};

// Update service worker
export const updateSW = async (): Promise<void> => {
  if (!isSwSupported()) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
    }
  } catch (error) {
    console.error('[SW] Update failed:', error);
  }
};

// Skip waiting for new service worker
export const skipWaiting = async (): Promise<void> => {
  if (!isSwSupported()) {
    return;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  if (registration && registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
};

// Get service worker status
export const getSwStatus = async (): Promise<{
  supported: boolean;
  registered: boolean;
  active: boolean;
  waiting: boolean;
}> => {
  if (!isSwSupported()) {
    return { supported: false, registered: false, active: false, waiting: false };
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    return {
      supported: true,
      registered: !!registration,
      active: !!registration?.active,
      waiting: !!registration?.waiting,
    };
  } catch {
    return { supported: true, registered: false, active: false, waiting: false };
  }
};

// Check if app is running offline
export const isOffline = (): boolean => {
  return !navigator.onLine;
};

// Listen for online/offline events
export const addConnectionListener = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  const handleOnline = () => onOnline();
  const handleOffline = () => onOffline();

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};
