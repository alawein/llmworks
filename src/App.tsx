import { Toaster as Sonner, TooltipProvider } from '@alawein/ui';
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/toaster';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AnalyticsListener from '@/components/AnalyticsListener';
import { SkipLink } from '@/components/SkipLink';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageLoader } from '@/components/LoadingSpinner';
import { initSmoothScroll } from '@/lib/smooth-scroll';
import { registerSW } from '@/lib/service-worker';
import { initPerformanceMonitoring } from '@/lib/performance';
import { AccessibilityToolbar } from '@/components/accessibility/AccessibilityToolbar';
import { ColorBlindnessFilters } from '@/components/accessibility/ColorBlindnessFilters';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { CommandPalette } from '@/components/CommandPalette';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { NotificationProvider } from '@/components/FloatingNotifications';
import { KeyboardProvider } from '@/components/KeyboardShortcuts';
import { DynamicBackground } from '@/components/DynamicBackground';
import { InteractiveBackground } from '@/components/MagneticElements';
import { ThemeCustomizer } from '@/components/ThemeCustomizer';
import { AchievementSystem } from '@/components/AchievementSystem';
import { initSecurity } from '@/lib/security';
import { initAdvancedSEO } from '@/lib/advanced-seo';
import { initMonitoring } from '@/lib/monitoring';

const Index = lazy(() => import('./pages/Index'));
const Arena = lazy(() => import('./pages/Arena'));
const Bench = lazy(() => import('./pages/Bench'));
const Compare = lazy(() => import('./pages/Compare'));
const Settings = lazy(() => import('./pages/Settings'));
const Admin = lazy(() => import('./pages/Admin'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));

// Router wrapper component to provide context for hooks
const AppRoutes = () => {
  const { isOpen, setIsOpen } = useCommandPalette();
  const [themeCustomizerOpen, setThemeCustomizerOpen] = useState(false);

  return (
    <>
      <SkipLink />
      <AnalyticsListener />
      <DynamicBackground intensity="medium" theme="tactical" />
      <InteractiveBackground />
      <KeyboardShortcuts />
      <CommandPalette open={isOpen} onOpenChange={setIsOpen} />
      <ThemeCustomizer
        isOpen={themeCustomizerOpen}
        onToggle={() => setThemeCustomizerOpen((prev) => !prev)}
      />
      <AchievementSystem />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/bench" element={<Bench />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <AccessibilityToolbar />
        <ColorBlindnessFilters />
      </ErrorBoundary>
    </>
  );
};

const App = () => {
  useEffect(() => {
    // Initialize production systems
    initSecurity();
    initAdvancedSEO();
    initMonitoring();

    // Initialize smooth scrolling
    initSmoothScroll();

    // Initialize performance monitoring
    initPerformanceMonitoring({
      trackCoreWebVitals: true,
      trackNavigation: true,
      debug: import.meta.env.DEV,
    });

    // Register service worker for caching and offline functionality
    registerSW({
      onError: (error) => {
        console.error('Service worker registration failed:', error);
      },
    });
  }, []);

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NotificationProvider>
          <KeyboardProvider>
            <AppRoutes />
          </KeyboardProvider>
        </NotificationProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
