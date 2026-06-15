# Story — Nextcusts CRUD

**As an** operator, **I want** to manage Nextcusts records, **so that** the data stays current.

## Context

- Entity: `Nextcust` (table `nextcust`)
- Routes: list `/nextcusts`, create `/nextcusts/new`, edit `/nextcusts/[id]/edit`
- API base: `/api/nextcusts`

## Fields (render in order)

| Field | Label | Component | Required | List column |
|---|---|---|---|---|
| newcust | Newcust | input | no | yes |

## Acceptance criteria

- [ ] `GET /api/nextcusts` returns a paginated list.
- [ ] `POST /api/nextcusts` creates a record after validating the body.
- [ ] `GET /api/nextcusts/:id` returns one record.
- [ ] `PUT /api/nextcusts/:id` updates a record.
- [ ] `DELETE /api/nextcusts/:id` deletes a record.
- [ ] List page shows only *list column* fields, with search + pagination.
- [ ] Create and edit forms render all fields in order; required fields validated.
