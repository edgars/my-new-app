# Story — Parts CRUD

**As an** operator, **I want** to manage Parts records, **so that** the data stays current.

## Context

- Entity: `Parts` (table `parts`)
- Routes: list `/parts`, create `/parts/new`, edit `/parts/[id]/edit`
- API base: `/api/parts`

## Fields (render in order)

| Field | Label | Component | Required | List column |
|---|---|---|---|---|
| onHand | On Hand | input | no | yes |
| onOrder | On Order | input | no | yes |
| cost | Cost | input | no | yes |
| listPrice | List Price | input | no | yes |
| partNo | Part No | input | no | yes |
| vendorNo | Vendor No | select | no | no |
| description | Description | textarea | no | no |

## Acceptance criteria

- [ ] `GET /api/parts` returns a paginated list.
- [ ] `POST /api/parts` creates a record after validating the body.
- [ ] `GET /api/parts/:id` returns one record.
- [ ] `PUT /api/parts/:id` updates a record.
- [ ] `DELETE /api/parts/:id` deletes a record.
- [ ] List page shows only *list column* fields, with search + pagination.
- [ ] Create and edit forms render all fields in order; required fields validated.
- [ ] Enforce: Procedure: TEdPartsForm.Edit
- [ ] Enforce: Procedure: TEdPartsForm.PrintBtnClick
- [ ] Enforce: Procedure: TEdPartsForm.FormCloseQuery
- [ ] Enforce: Procedure: TMastData.PartsBeforeOpen
- [ ] Enforce: Procedure: TMastData.PartsCalcFields
- [ ] Enforce: Procedure: TMastData.PartsQueryCalcFields
- [ ] Enforce: Procedure: UpdateParts
- [ ] Enforce: Function: TSearchDlg.ShowModalParts
- [ ] Enforce: Function: TBrPartsForm.GetPartNo
- [ ] Enforce: Procedure: TBrPartsForm.SetPartNo
- [ ] Enforce: Procedure: TBrPartsForm.ActivateQuery
- [ ] Enforce: Procedure: TBrPartsForm.EditBtnClick
- [ ] Enforce: Procedure: TBrPartsForm.CloseBtnClick
- [ ] Enforce: Procedure: TBrPartsForm.FormShow
