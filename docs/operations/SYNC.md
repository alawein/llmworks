---
type: canonical
source: none
sync: none
sla: none
---

# GitHub ↔ Notion ops sync (this repo)

## What syncs where

| Surface                                           | Source of truth                                                                                 | Notes                                                           |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Project row** in Notion “Projects (Canonical)”  | [`alawein/alawein` `projects.json`](https://github.com/alawein/alawein/blob/main/projects.json) | LLMWorks is under **`featured`**. Batch sync is org-level only. |
| **This repo’s activity** (PRs / issues / commits) | GitHub API                                                                                      | Use the sync report script below for scans and dashboards.      |

There is **no** per-repo push to Notion in CI. Keep Notion writes in the org repo
until there is a real reusable workflow with org-level secrets. Any future
`workflow_call` path must explicitly forward the required named secrets or use
`secrets: inherit`, and grant the permissions required by the Notion write step.
This repo only generates a GitHub sync report.

## Generate a sync report (commits + open PRs + open issues)

From repo root, with a token that can **read** this repo:

```bash
export GH_TOKEN="ghp_..."   # or fine-grained PAT with Contents: Read
export GITHUB_REPOSITORY="alawein/llmworks"   # optional; defaults to alawein/llmworks
npm run ops:sync-report
```

Artifact: `reports/sync-report.llmworks.json` (gitignored). In **GitHub Actions**, run workflow **“Ops : GitHub sync report”** (workflow_dispatch); it uploads the JSON as a workflow artifact.

**CI parity:** `GITHUB_TOKEN` is injected automatically; `GITHUB_REPOSITORY` is set by Actions.

## Canonical Notion project sync (org repo)

Full procedure: [alawein `docs/operations/notion-projects-database.md`](https://github.com/alawein/alawein/blob/main/docs/operations/notion-projects-database.md).

Quick alignment: validate JSON, sync, verify (requires `NOTION_TOKEN`, `NOTION_DB_ID`).

## Why this layout

- Small, repeatable **report** for ops without coupling every repo to Notion.
- **Org repo** remains the single place that maps `projects.json` → Notion rows.
