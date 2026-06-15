# Generated Application — Specification

Spec-driven output from RNC. The application is described in `specs/`; a coding agent
builds it from these specs. No application code is committed here yet.

## Generate the app with Claude Code

Install Claude Code (https://docs.claude.com/en/docs/claude-code), then from the repo root:

```bash
# one-shot (headless)
claude -p "Read CLAUDE.md and every file under specs/, then generate the complete \
application exactly as specified. Create all project files."

# or interactively
claude
> Read CLAUDE.md and specs/, then build the full app per the specs.
```

Review the diff, then run the app (e.g. `npm install && npx prisma migrate dev && npm run dev`).

## Layout

- `CLAUDE.md` — build instructions + stack for the agent
- `specs/overview.md` — app overview + entity index
- `specs/data-model.md` — entities, columns, relations
- `specs/entities/<entity>.md` — per-entity fields, screens, CRUD, relations
- `specs/business-rules.md` — business rules to implement
