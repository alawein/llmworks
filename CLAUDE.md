---
type: guide
authority: canonical
audience: [ai-agents, contributors]
last-verified: 2026-03-03
---

> Extends: github.com/alawein/_pkos/CLAUDE.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

**Project**: LLM Works -- Open-Source LLM Evaluation Platform
**Domain**: llmworks.dev (Vercel deployment)
**Status**: Active development (rebranded from Aegis AI, January 2025)

## Commands

### Development

- `npm run dev` - Start development server (port 8080)
- `npm run build` - Build for production
- `npm run build:dev` - Build for development mode
- `npm run preview` - Preview production build (port 4173)
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript validation
- `npm run test` - Run Vitest in watch mode
- `npm run test:run` - Run Vitest once (`npx vitest run`)
- `npm run test:coverage` - Run tests with V8 coverage
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run test:integration` - Run integration tests
- `npm run test:performance` - Run performance tests
- `npm run test:accessibility` - Run accessibility tests
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting

### Testing

- `npx vitest run` - Run all unit tests (one-shot, recommended for CI)
- **pool: forks** is configured in `vite.config.ts` to prevent test hangs -- do not change to threads
- Teardown timeout: 5000ms
- Environment: jsdom
- Excludes `**/e2e/**`, `**/visual/**`, and `**/*.spec.ts`

### Installation

- `npm install` - Install dependencies
- Requires Node.js >= 18.0.0, npm >= 8.0.0

## Architecture Overview

**LLM Works** is a **Vite 5 + React 19 + TypeScript** application with
**shadcn/ui** components and **Supabase** backend for LLM evaluation and
benchmarking.

### Product Features

- **The Arena**: Interactive model testing (debates, creative challenges, explanations)
- **The Bench**: Rigorous benchmarking (MMLU, TruthfulQA, custom tests)
- **Arbiter Framework**: Consistent evaluation protocols
- **Verifier System**: Cryptographic audit trails
- **Dynamic Elo Rankings**: Performance tracking over time

### Tech Stack

- **Build Tool**: Vite 5 with Terser minification
- **Framework**: React 19 with TypeScript
- **Routing**: React Router v6
- **UI Components**: shadcn/ui (Radix UI primitives + Tailwind CSS v4)
- **Styling**: Tailwind CSS v4 via @tailwindcss/vite plugin
- **State Management**: TanStack Query v5
- **Backend**: Supabase (authentication + database)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Crypto**: crypto-js for audit trail hashing
- **Testing**: Vitest (unit) + Playwright (e2e/visual/accessibility)

### Project Structure

- `/src/pages/` - Route components (Index, Arena, Bench, NotFound)
- `/src/components/` - Reusable React components
- `/src/components/ui/` - shadcn/ui component library (auto-generated, do not edit)
- `/src/integrations/supabase/` - Supabase client and types (auto-generated, do not edit)
- `/src/api/` - API layer
- `/src/lib/` - Utility functions
- `/src/hooks/` - Custom React hooks
- `/src/styles/` - Global styles
- `/src/test/` - Test utilities and setup

### Key Configuration

- **Path Aliases**: `@/` maps to `./src/` directory
- **TypeScript**: Relaxed settings (no strict null checks)
- **Routes**: All routes defined in `src/App.tsx` -- add new routes above the catch-all
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection configured in vite.config.ts
- **Manual Chunks**: vendor-react, vendor-ui, vendor-charts, vendor-query, vendor-supabase

### Important Notes

- **Brand Identity**: Use "LLM Works" (not "Aegis AI") -- rebranded January 2025
- **Color Palette**: Analytical Blue (#4F83F0) primary, Insight Orange (#FF7A2A) accent
- Do not edit `src/components/ui/` -- these are shadcn/ui generated components
- Do not edit `src/integrations/supabase/` -- these are auto-generated
- The `pool: 'forks'` setting in vite.config.ts test config prevents Vitest from hanging -- do not switch to threads
- Console logs and debugger statements are stripped in production builds
- Governance: Has `AGENTS.md` from Morphism framework

## Governance
See [AGENTS.md](AGENTS.md) for rules. See [SSOT.md](SSOT.md) for current state.
