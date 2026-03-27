---
type: canonical
source: none
sync: none
sla: none
authority: canonical
audience: [agents, contributors]
---

# Governance

This project follows **Morphism Categorical Governance Framework**.

## Seven Invariants

| ID | Invariant | Enforcement |
|----|-----------| ------------|
| I-1 | One Truth Per Domain | Maintain SSOT (single source of truth) per config type |
| I-2 | Drift Is Debt | Config drift detected and logged; sync recommended |
| I-3 | Observability | Log what changed, why, who, when |
| I-4 | Scope Binding | Changes must have clear, narrow boundaries |
| I-5 | Entropy Monotonicity | Complexity shouldn't decrease without intent |
| I-6 | Refusal as Structure | Say "no" to scope creep |
| I-7 | Minimal Authority | Fewest people/rules needed to govern |

## Protocol

1. Read governance docs before structural changes
2. State the one thing you're building
3. Verify the path (which files, which branches)
4. Execute incrementally
5. Refuse scope creep

## Git Workflow

Branches: `feat/`, `fix/`, `docs/`, `chore/`, `test/` prefixes.
Direct work on main blocked by hooks.

## Open Work

See: `docs/operations/backlog.md`

## Session Handoff

Before ending session:
1. Append entry to `docs/operations/session-log.md`
2. Update backlog (mark completed, add new items)
