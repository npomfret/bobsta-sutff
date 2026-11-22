---
name: review-changes
description: Independent review of finished work before it is committed. Use for "review this", "look over this branch for bugs or missed requirements", "check my changes", "is this ready", a second opinion on a diff, branch or PR, and before committing any behaviour, refactor, test, configuration or tooling change. Not for typo, formatting or task-file edits, and not a substitute for running tests.
---

# Review changes

Required step: do not review your own diff. Call the spawn tool now to start a reviewer subagent (Codex: `spawn_agent`; Claude Code: the Agent tool) and give it the success criteria, file list or revision range and the diff. Use a project reviewer if one fits; otherwise `change-reviewer`, or `database-change-reviewer` for SQL, schema and migration diffs and `ui-change-reviewer` for screens, components and copy. Wait for its verdict. The implementing agent stays responsible for resolving every finding before committing.

Have significant work independently reviewed by an agent before committing. This includes behavior, refactors, tests, configuration and tooling; trivial wording, formatting and task-file edits need no review.

- Use an appropriate project reviewer, or a general reviewer. Give it the success criteria, file list/revision range and the actual diff, plus the existing code and tests the change followed and each intended departure from them with its reason. A reviewer other than the shared `change-reviewer` is asked in the brief for the "Existing mechanisms" and "Existing patterns" checks below.
- Whatever the brief says, the reviewer lists each helper, wrapper, driver, module or type the diff adds, searches every workspace and shared package for one with the same job (by the stems of its name and purpose, and through what the touched files already import from shared packages) and for each hit's importers, reruns a failed search, and reports them under "Existing mechanisms". A same-job mechanism is a rule violation ranked with bugs unless the user agreed it; a claim that it cannot be used is unverified until an importer check settles it; "all" or "every" scope is checked against a cited inventory. The brief carries the implementer's search result and never presents an unverified design as decided.
- The reviewer also checks the brief's choice of reference code, finds the existing code and tests most like each changed or added hand-written source or test file (not generated output or task files) and reports, under "Existing patterns", where the diff departs from their structure, error handling, logging or test helpers without a reason stated in the brief. An unexplained departure is a rule violation; a departure that follows a shared standard the reference code breaks is correct.
- Ask for substantive problems with evidence: bugs, broken contracts, missed requirements, rule violations and ineffective tests. Skip style preferences and nits.
- Resolve each finding or explain why it is incorrect before committing. Report the review result and how findings were handled.

Passing tests do not replace review.

## Rule sources by change type

The reviewer loads the applicable skill before judging, by what the diff touches: tests (`test-design`, plus `browser-testing` or `ios-ui-testing`), UI (`ui-implementation`, `web-factoring`), SQL or schema (`database`), logging or error paths (`auditing`), scripts (`scripting`), configuration or secrets (`runtime-configuration`), HTTP (`http-boundaries`), async or cached state (`stateful-workflows`), structure and dependencies (`application-design`), CI (`teamcity`), gates and lint (`verification-gates`).

*Generated from `npomfret/agent-standards`. Edit the standard there, not this copy.*
