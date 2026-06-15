# Epic — Manage Parts

**Goal:** full lifecycle management of Parts records at `/parts`.

## Stories

- `story-parts-crud` — list, create, view, edit, delete Parts.

## Business rules affecting this entity

- Procedure: TEdPartsForm.Edit
- Procedure: TEdPartsForm.PrintBtnClick
- Procedure: TEdPartsForm.FormCloseQuery
- Procedure: TMastData.PartsBeforeOpen
- Procedure: TMastData.PartsCalcFields
- Procedure: TMastData.PartsQueryCalcFields
- Procedure: UpdateParts
- Function: TSearchDlg.ShowModalParts
- Function: TBrPartsForm.GetPartNo
- Procedure: TBrPartsForm.SetPartNo
- Procedure: TBrPartsForm.ActivateQuery
- Procedure: TBrPartsForm.EditBtnClick
- Procedure: TBrPartsForm.CloseBtnClick
- Procedure: TBrPartsForm.FormShow

## Definition of done

- CRUD works end to end; required fields validated; relations resolve; business rules enforced.
