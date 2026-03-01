import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 8080,
    host: '::',
    headers: securityHeaders,
  },
  preview: {
    port: 4173,
    headers: securityHeaders,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          // React and core dependencies
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Large UI libraries
          'vendor-ui': [
            '@radix-ui/react-tabs',
            '@radix-ui/react-select',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
          ],
          // Chart and visualization libraries
          'vendor-charts': ['recharts', 'lucide-react'],
          // TanStack libraries
          'vendor-query': ['@tanstack/react-query'],
          // Supabase client
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
    // Enable compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Optimize chunk sizes
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    exclude: ['@supabase/supabase-js'],
  },
});
