---
type: canonical
source: none
sync: none
sla: none
---

# Changelog

All notable changes to LLMWorks will be documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Changed

- Labeled scripted demos, sample metrics, benchmark queueing, and current-state
  docs so mock surfaces no longer read as measured provider output.

---

## [1.1.0] — 2026-03-06

### Added

- Migrated to `@alawein/ui` shared component library (#1)
- Visual regression CI workflow with Playwright baselines
- Lib module tests for analytics, rate-limiter, security, and utils
- CLAUDE.md agent guidance
- Workspace standardization (P10, P19)

### Changed

- Upgraded Vite 5 → 7 and plugin-react to 5.1.4
- Centralized browser API mocks and suppressed act() warnings

### Fixed

- Resolved security vulnerabilities via dependency upgrades
- Fixed animation stability for visual test baselines
- Fixed vitest process hang with pool forks config
- Resolved 113 test failures with jsdom config and relaxed thresholds

---

## [1.0.0] — 2026-02-01

### Added

- Initial LLMWorks platform
- React + Vite + TypeScript stack
- Supabase integration
- CI/CD pipeline with GitHub Actions
- Dependabot security monitoring

[Unreleased]: https://github.com/alawein/llmworks/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/alawein/llmworks/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/alawein/llmworks/releases/tag/v1.0.0
