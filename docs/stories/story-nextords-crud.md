# Story — Nextords CRUD

**As an** operator, **I want** to manage Nextords records, **so that** the data stays current.

## Context

- Entity: `Nextord` (table `nextord`)
- Routes: list `/nextords`, create `/nextords/new`, edit `/nextords/[id]/edit`
- API base: `/api/nextords`

## Fields (render in order)

| Field | Label | Component | Required | List column |
|---|---|---|---|---|
| newkey | Newkey | input | no | yes |

## Acceptance criteria

- [ ] `GET /api/nextords` returns a paginated list.
- [ ] `POST /api/nextords` creates a record after validating the body.
- [ ] `GET /api/nextords/:id` returns one record.
- [ ] `PUT /api/nextords/:id` updates a record.
- [ ] `DELETE /api/nextords/:id` deletes a record.
- [ ] List page shows only *list column* fields, with search + pagination.
- [ ] Create and edit forms render all fields in order; required fields validated.
