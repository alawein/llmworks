---
type: canonical
owner: platform-engineering
last-reviewed: 2026-03-31
---

# Architecture Overview -- llmworks

## Components

- **Frontend**: React 19 + TypeScript, built with Vite. Route-level screens live in `src/pages/`; shared UI in `src/components/`; custom hooks in `src/hooks/`; client state in `src/stores/`; utilities in `src/utils/`.
- **Backend**: Supabase handles auth, data persistence, and encrypted provider key storage.
- **Styling**: Tailwind CSS with Radix/shadcn-style primitives.
- **Data layer**: TanStack Query for server state management.
- **Testing**: Vitest (unit/component), Playwright (e2e and visual), accessibility test surface.

## Data Flow

1. The browser UI authenticates via Supabase Auth.
2. Evaluation and benchmark flows are triggered from route screens in `src/pages/`.
3. Provider API keys are retrieved from Supabase in encrypted form (decrypted client-side using `VITE_API_KEY_ENCRYPTION_SALT`).
4. Experiment results and benchmark outputs are stored back to Supabase and surfaced in dashboards and reports.

## Dependencies

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 19, TypeScript | UI and type safety |
| Build | Vite | Development server and production bundling |
| Styling | Tailwind CSS, Radix primitives | Responsive, accessible components |
| Backend | Supabase | Auth, database, encrypted key storage |
| State | TanStack Query | Server state and caching |
| Testing | Vitest, Playwright | Unit, e2e, accessibility, and visual coverage |

## Constraints

- Provider keys and the encryption salt are deployment-only secrets; they must not be committed to version control.
- Route surfaces stay in `src/pages/`; evaluation and benchmark logic must remain legible and not be buried in opaque wrappers.
- Deployed to Vercel (domain: llmworks.dev).

