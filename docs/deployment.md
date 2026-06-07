---
type: canonical
owner: platform-engineering
last-reviewed: 2026-03-31
---

# Deployment and Release -- llmworks

## Deployment Process

LLMWorks deploys to Vercel (domain: llmworks.dev). Deployments are triggered via GitHub Actions on push to the main branch.

1. Run `npm run build` locally to confirm the production build is clean.
2. Verify all required environment variables are configured in the Vercel project settings (see Environment Configuration below).
3. Push to `main`; the CI workflow builds and deploys automatically.
4. Confirm the deployment at llmworks.dev.

## Release Strategy

- Conventional commits (`feat`, `fix`, `chore`, `docs`) are used throughout.
- No formal versioning scheme is in place for this evaluation workbench; releases correspond to merged PRs on `main`.

## Rollback Procedures

- Use the Vercel dashboard to promote a prior deployment to production if a regression is introduced.
- For data issues, Supabase backups are the rollback path for persistent state.

## Environment Configuration

Required environment variables (see `.env.example` in the repo root):

| Variable | Purpose |
|---|---|
| `VITE_API_KEY_ENCRYPTION_SALT` | Client-side encryption salt for stored provider keys. Deployment secret only. |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key |

Provider API keys (OpenAI, Anthropic, etc.) are entered by users at runtime and stored encrypted in Supabase. They are not build-time environment variables.

