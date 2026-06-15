# Generated Application — Build Specification (for an AI coding agent)

This repository contains SPECIFICATIONS, not application code. Your task: generate the
complete application described under `specs/`, using the stack below.

## Stack

- Frontend: nextjs
- Backend: nextjs + prisma
- Database: sqlite

## How to build

1. Read `specs/overview.md`, then `specs/data-model.md`, then every file in `specs/entities/`.
2. Scaffold a runnable project, an ORM schema + migrations, and per-entity validation.
3. For each entity, implement a REST API (paginated list, create, read, update, delete)
   and UI pages (list, create form, edit form).
4. Implement relations: a lookup field is a dynamic Select sourced from the related
   entity's list API; the foreign key stores the related record's id.
5. Implement `specs/business-rules.md`. Rules tagged **NEEDS REVIEW** are ambiguous —
   write a best-effort handler and leave a `// TODO` noting what a human must confirm.

## Conventions

- Type-safe end to end; validate every input at the API boundary.
- One route group per entity. List/grid pages show ONLY the fields marked *list column*.
- Render fields in the documented order; keep code idiomatic for the stack.

## Definition of done

The app installs, migrates, builds, and every entity below has working CRUD + relations:

- Frmpermissaosuspensao — `/frmpermissaosuspensaos`
- Frmsolicitacoes — `/frmsolicitacoes`
