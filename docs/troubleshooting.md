---
type: canonical
owner: platform-engineering
last-reviewed: 2026-03-31
---

# Troubleshooting -- llmworks

## Common Issues

**Build fails with `process.env.NODE_ENV` reference**
Use `import.meta.env.PROD` and `import.meta.env.DEV` instead. Vite does not expose `process.env` in the browser bundle.

**Unexpected provider-key encryption configuration**
The current app has no provider-key integration or client-side encryption path.
Remove any `VITE_API_KEY_ENCRYPTION_SALT` configuration from client builds; it is not consumed.

**Supabase auth errors**
Confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set. For local development, copy `.env.example` to `.env.local` and fill in the values.

**Node.js version mismatch**
The project targets Node.js 20 (see `.nvmrc`). Use `nvm use` or `nvm install` to align versions before running `npm install`.

## Diagnostic Steps

1. Run `npm run build` and capture the full output.
2. Run `npm run type-check` to isolate TypeScript errors from build errors.
3. Run `npm run lint` to identify code quality issues.
4. Run `npm run test:run` for unit and component failures.
5. Run `npm run test:e2e` for end-to-end failures; Playwright traces are written to `test-results/`.

## Known Failure Modes

- **Visual test snapshots out of date**: Run `npm run test:visual -- --update-snapshots` to regenerate baseline screenshots.
- **Supabase placeholder configuration**: If the browser logs that Supabase variables are missing, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` at build time.
- **Supabase rate limits**: Authentication flows can trigger Supabase auth rate limits. Do not expose a service-role key to the browser.

## FAQ

**Where are provider keys stored?**
They are not stored or processed by the current app. Provider-backed evaluation requires a future server-side integration.

**How do I add a new LLM provider?**
Provider integrations are not implemented. Add a server-side provider integration and benchmark execution path before exposing provider configuration in the UI.

**How do I run only one test file?**
Use `npx vitest run <path>` or `npx playwright test <path>` targeting the specific file.

