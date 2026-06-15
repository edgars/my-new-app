# Story — Employees CRUD

**As an** operator, **I want** to manage Employees records, **so that** the data stays current.

## Context

- Entity: `Employee` (table `employee`)
- Routes: list `/employees`, create `/employees/new`, edit `/employees/[id]/edit`
- API base: `/api/employees`

## Fields (render in order)

| Field | Label | Component | Required | List column |
|---|---|---|---|---|
| empno | Empno | input | no | yes |
| fullname | Fullname | input | no | yes |
| lastname | Lastname | input | no | yes |
| firstname | Firstname | input | no | yes |
| phoneext | Phoneext | input | no | yes |
| hiredate | Hiredate | input | no | yes |
| salary | Salary | input | no | yes |

## Acceptance criteria

- [ ] `GET /api/employees` returns a paginated list.
- [ ] `POST /api/employees` creates a record after validating the body.
- [ ] `GET /api/employees/:id` returns one record.
- [ ] `PUT /api/employees/:id` updates a record.
- [ ] `DELETE /api/employees/:id` deletes a record.
- [ ] List page shows only *list column* fields, with search + pagination.
- [ ] Create and edit forms render all fields in order; required fields validated.
