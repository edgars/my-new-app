# Story — Items CRUD

**As an** operator, **I want** to manage Items records, **so that** the data stays current.

## Context

- Entity: `Items` (table `items`)
- Routes: list `/items`, create `/items/new`, edit `/items/[id]/edit`
- API base: `/api/items`

## Fields (render in order)

| Field | Label | Component | Required | List column |
|---|---|---|---|---|
| itemno | Itemno | input | no | yes |
| orderno | Orderno | input | no | yes |
| description | Description | input | no | yes |
| sellprice | Sellprice | input | no | yes |
| qty | Qty | input | no | yes |
| discount | Discount | input | no | yes |
| extprice | Extprice | input | no | yes |
| partno | Partno | input | no | yes |

## Acceptance criteria

- [ ] `GET /api/items` returns a paginated list.
- [ ] `POST /api/items` creates a record after validating the body.
- [ ] `GET /api/items/:id` returns one record.
- [ ] `PUT /api/items/:id` updates a record.
- [ ] `DELETE /api/items/:id` deletes a record.
- [ ] List page shows only *list column* fields, with search + pagination.
- [ ] Create and edit forms render all fields in order; required fields validated.
- [ ] Enforce: Condition: (Orders = dsInsert)andnot(Items  **(NEEDS REVIEW)**
- [ ] Enforce: Condition: notConfirm('Cancelorderbeinginserted and deletealllineitems?')  **(NEEDS REVIEW)**
- [ ] Enforce: Condition: notConfirm('Deleteorder and lineitems?')  **(NEEDS REVIEW)**
- [ ] Enforce: Procedure: TMastData.ItemsAfterDelete
- [ ] Enforce: Procedure: TMastData.ItemsAfterPost
- [ ] Enforce: Procedure: TEdOrderForm.ItemsGridEnter
- [ ] Enforce: Procedure: TEdOrderForm.ItemsGridExit
