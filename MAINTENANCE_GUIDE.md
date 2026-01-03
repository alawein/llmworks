# Repository Maintenance Guide

Quick reference for keeping LLM Works repository clean and organized.

## 📅 Monthly Maintenance Checklist

### 1. Archive Session Documents

```bash
# Move any session docs to archive
mv *SESSION* *SUMMARY* *REPORT* *AUDIT* .archive/sessions/$(date +%Y-%m-%d)/ 2>/dev/null || true
```

### 2. Clean Merged Branches

```bash
# Safe cleanup of merged branches (local)
git branch --merged main | grep -v "main\|master" | xargs git branch -d

# Prune remote tracking branches
git remote prune origin
```

### 3. Update Dependencies

```bash
# Check for security vulnerabilities
npm audit

# Fix vulnerabilities (review breaking changes first)
npm audit fix

# Update dependencies (review breaking changes)
npm update
```

### 4. Clean Build Artifacts

```bash
# Remove build artifacts (regenerated on next build)
rm -rf dist/ stats.html
npm run build
```

### 5. Verify Repository Health

```bash
# Check git status
git status

# Count root files (should be ~25)
ls -1 | wc -l

# Check for large files
find . -type f -size +1M -not -path "./node_modules/*" -not -path "./.git/*"
```

## 🗂️ File Organization

### Keep in Root

- ✅ README.md
- ✅ LICENSE
- ✅ SECURITY.md
- ✅ CONTRIBUTING.md
- ✅ Core config files (package.json, tsconfig.json, etc.)
- ✅ MAINTENANCE_GUIDE.md (this file)
- ✅ CLEANUP_SUMMARY.md

### Archive to `.archive/`

- 📦 Session documents (SUMMARY.md, REPORT.md, AUDIT.md)
- 📦 Deprecated documentation
- 📦 Old reports
- 📦 Build artifacts (stats.html)

### Organize to Subdirectories

- 📁 `.github/` - GitHub workflows, issue templates
- 📁 `docs/` - User guides, API docs, developer guides
- 📁 `.vscode/` - VS Code settings
- 📁 `templates/` - Code templates

## 🚫 What NOT to Archive/Delete

### Never Delete

- ❌ Active documentation (README, CONTRIBUTING)
- ❌ Configuration files in use
- ❌ Source code
- ❌ Tests

### Never Archive

- ❌ Current session work
- ❌ Active feature branches
- ❌ Unmerged changes

## 🔧 Quick Commands

```bash
# Full cleanup (run monthly)
npm run lint && \
npm run build && \
git branch --merged main | grep -v "main\|master" | xargs git branch -d && \
git remote prune origin

# Check repository health
git status && \
npm audit && \
echo "Root files: $(ls -1 | wc -l)" && \
echo "Active branches: $(git branch | wc -l)"

# Archive today's session docs
mkdir -p .archive/sessions/$(date +%Y-%m-%d) && \
mv *SESSION* *SUMMARY* .archive/sessions/$(date +%Y-%m-%d)/ 2>/dev/null || echo "No session docs to archive"
```

## 📊 Health Metrics

**Target Health Score**: >95%

| Metric            | Target | Current  |
| ----------------- | ------ | -------- |
| Root Files        | <30    | 25 ✅    |
| Active Branches   | <5     | 1 ✅     |
| Build Time        | <25s   | 22s ✅   |
| Bundle Size (max) | <500KB | 420KB ✅ |
| Security Issues   | 0      | 0 ✅     |

## 🆘 Troubleshooting

### Too Many Root Files

```bash
# List all root files
ls -la

# Identify candidates for archiving
ls -1 *SUMMARY* *SESSION* *REPORT* *AUDIT* 2>/dev/null
```

### Too Many Active Branches

```bash
# List all branches with last commit date
git for-each-ref --sort=-committerdate refs/heads/ \
  --format='%(committerdate:short) %(refname:short)'

# Delete stale branches (older than 30 days, merged)
git branch --merged main | grep -v "main\|master" | xargs git branch -d
```

### Large Repository Size

```bash
# Find large files
find . -type f -size +1M -not -path "./node_modules/*" \
  -not -path "./.git/*" -exec ls -lh {} \;

# Check git history size
git count-objects -vH
```

## 📚 Resources

- [Git Branch Management](https://git-scm.com/book/en/v2/Git-Branching-Branch-Management)
- [npm Audit Docs](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Repository Organization Best Practices](https://docs.github.com/en/repositories)

---

**Last Updated**: 2025-11-19 **Maintainer**: Development Team
