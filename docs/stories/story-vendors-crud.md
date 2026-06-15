# Story — Vendors CRUD

**As an** operator, **I want** to manage Vendors records, **so that** the data stays current.

## Context

- Entity: `Vendors` (table `vendors`)
- Routes: list `/vendors`, create `/vendors/new`, edit `/vendors/[id]/edit`
- API base: `/api/vendors`

## Fields (render in order)

| Field | Label | Component | Required | List column |
|---|---|---|---|---|

## Acceptance criteria

- [ ] `GET /api/vendors` returns a paginated list.
- [ ] `POST /api/vendors` creates a record after validating the body.
- [ ] `GET /api/vendors/:id` returns one record.
- [ ] `PUT /api/vendors/:id` updates a record.
- [ ] `DELETE /api/vendors/:id` deletes a record.
- [ ] List page shows only *list column* fields, with search + pagination.
- [ ] Create and edit forms render all fields in order; required fields validated.
