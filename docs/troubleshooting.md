---
type: canonical
owner: platform-engineering
last-reviewed: 2026-03-31
---

# Troubleshooting -- llmworks

## Common Issues

**Build fails with `process.env.NODE_ENV` reference**
Use `import.meta.env.PROD` and `import.meta.env.DEV` instead. Vite does not expose `process.env` in the browser bundle.

**Encryption salt missing at runtime**
`VITE_API_KEY_ENCRYPTION_SALT` must be set in the Vercel project environment. Without it, provider key encryption fails at startup.

**Supabase auth errors**
Confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set. For local development, copy `.env.example` to `.env.local` and fill in the values.

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
- **Provider key decryption failure**: Mismatched salt between environments causes silent decryption errors. Re-enter keys after a salt change.
- **Supabase rate limits**: High-frequency benchmark runs can trigger Supabase auth rate limits. Use service-role key for server-side calls if needed.

## FAQ

**Where are provider keys stored?**
Encrypted in Supabase. The encryption uses `VITE_API_KEY_ENCRYPTION_SALT` as the client-side key. Keys are never logged or exported.

**How do I add a new LLM provider?**
Extend the provider integration utilities in `src/utils/` and add the corresponding key entry through the settings UI.

**How do I run only one test file?**
Use `npx vitest run <path>` or `npx playwright test <path>` targeting the specific file.

