---
type: canonical
owner: platform-engineering
last-reviewed: 2026-03-31
---

# Architecture Overview -- llmworks

## Components

- **Frontend**: React 19 + TypeScript, built with Vite. Route-level screens live in `src/pages/`; shared UI in `src/components/`; custom hooks in `src/hooks/`; client state in `src/stores/`; utilities in `src/utils/`.
- **Backend**: Supabase Auth is available through the typed client; migrations define the planned data schema.
- **Styling**: Tailwind CSS with Radix/shadcn-style primitives.
- **Data layer**: The current UI is local-state driven. It does not invoke provider APIs, edge functions, or database tables for evaluation work.
- **Testing**: Vitest (unit/component), Playwright (e2e and visual), accessibility test surface.

## Data Flow

1. The browser UI can authenticate via Supabase Auth.
2. Route screens in `src/pages/` render local UI and scripted demos.
3. Arena and comparison views use clearly labeled illustrative data; they do not call model providers.
4. Provider execution, benchmark scoring, result persistence, and key encryption are not implemented in this repository.

## Dependencies

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 19, TypeScript | UI and type safety |
| Build | Vite | Development server and production bundling |
| Styling | Tailwind CSS, Radix primitives | Responsive, accessible components |
| Backend | Supabase | Auth client and migration-managed schema |
| State | React state | Current local UI state |
| Testing | Vitest, Playwright | Unit, e2e, accessibility, and visual coverage |

## Constraints

- Provider keys must never be committed to version control. No client-side provider-key encryption path exists today.
- Route surfaces stay in `src/pages/`; evaluation and benchmark logic must remain legible and not be buried in opaque wrappers.
- Deployed to Vercel (domain: llmworks.dev).

