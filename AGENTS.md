<!-- agent-standards:begin -->
## Operating contract

*Managed by `npomfret/agent-standards`; detailed workflows are skills.*

- Skills come first: your first action on any task is to invoke, with the Skill tool, every skill whose description matches the request, before reading code or running commands. A task usually matches several; load them all, and again when the work moves to a new kind of task, even for a small change.
- Scope: do what was asked plus the callers, tests and migrations it needs. Leave unrelated refactors, renames, cleanup, dependency bumps and docs for separate work; suggest them at the end. Never invent commands, paths, field names or APIs; check the source first. Before starting, read the code most like the change, its tests and their helpers, and follow their patterns; never add a second pattern for the same job. Shared standards beat local precedent: where that code breaks one, follow the standard, name the departure in the review brief and report, and suggest migrating the old code. Any other departure needs a reason in both. Before writing a helper, wrapper, driver or module, search all workspaces by behaviour and name for one with the same job and its callers, and extend it; a parallel one needs the user's prior agreement and a recorded reason. A claim that an existing one cannot be used must cite the checked source; an unchecked claim in a task or brief is not evidence. "All" or "every" needs a written inventory before editing, which acceptance cites; a sample is not coverage. Add failure handling only for observed evidence. When readings differ materially, choose the most plausible, state the assumption in your report and proceed. Done means the behaviour works, verification passes, and you report evidence and blockers.
- Gates: only substantive failures block (types, broken behaviour, agreed rules). Cosmetics are autoformatted and never block commits, CI or reviews. Run tests, builds and type checks yourself; no test or lint hooks; formatting hooks only on changed files.
- Machine load: lean on CI for full suites; locally run only the tests your change needs. No load, stress, performance or CPU-saturating tests without the user's explicit authorisation.
- Other agents share the checkout. Stage only your files; never stash, discard, revert or commit their changes. The shared checkout stays on the default branch; isolate with `git worktree add --detach tmp/worktrees/<name> <default-branch>`.
- Git: work is complete only when verified, reviewed commits are on the default branch and pushed (`git pull --rebase`, land with `git merge --ff-only`). Force-pushing is permitted; prefer `--force-with-lease`. Commit, land and push without asking. Repositories stay private.
- Significant work (behaviour, refactor, tests, config, tooling) is reviewed independently before commit: spawn a project reviewer or `change-reviewer` subagent (`spawn_agent` in Codex, the Agent tool in Claude Code), never report a review you did not delegate; resolve every finding. Whatever the brief, a review checks for a duplicated or bypassed existing mechanism or pattern and any "all" or "every" scope against the inventory; briefs carry the search result and never call an unverified design decided. Tests and review do not replace each other.
- Substantial work needs a committed task file under `tasks/`.
- Run commands yourself unless they need the user's login, password, sudo, device or install. Reuse the project's scripts and `tmp/ad-hoc-scripts/`; put multi-step or quoted shell in a named script there. Hand the user one short command, else a script run as `! tmp/ad-hoc-scripts/<purpose>.sh`. Send long output to `tmp/logs/`; read bounded excerpts, never whole logs.
- Secrets never go in source, arguments, output or logs, or the repo; they live in iCloud Drive, reached through gitignored `secrets/` links. Configuration comes only from explicitly supplied files, never environment, dotenv or ambient login.
- Code: construct dependencies at the entry point and inject them; no globals, singletons or hidden construction; immutable by default; structured logs with fixed labels that preserve error causes and stacks; no sleeps in tests. Raise a test timeout or limit only on measured evidence, recorded beside the operation.

- Be concise: lead with the outcome; give only the detail needed to act or decide.
- Do the work properly and verify it; never trade correctness for speed or cost.
- When options exist, recommend the best technical solution first, even if costlier; state cheaper alternatives separately with their trade-offs.
- Fail fast: surface errors with their cause; never swallow, mask or silently fall back from them.
- Keep one canonical implementation: migrate callers and delete superseded code instead of adding shims or compatibility layers.
- Question unclear or unsound requests before acting on them; do not comply silently.
In Codex, use native skills and specialists for equivalent Claude invocations; referenced `.claude/` files remain canonical project knowledge.

*Managed by `npomfret/agent-standards`; edit the shared sources there.*
<!-- agent-standards:end -->
