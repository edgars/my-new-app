# Epic — Manage Items

**Goal:** full lifecycle management of Items records at `/items`.

## Stories

- `story-items-crud` — list, create, view, edit, delete Items.

## Business rules affecting this entity

- Condition: (Orders = dsInsert)andnot(Items  **(NEEDS REVIEW)**
- Condition: notConfirm('Cancelorderbeinginserted and deletealllineitems?')  **(NEEDS REVIEW)**
- Condition: notConfirm('Deleteorder and lineitems?')  **(NEEDS REVIEW)**
- Procedure: TMastData.ItemsAfterDelete
- Procedure: TMastData.ItemsAfterPost
- Procedure: TEdOrderForm.ItemsGridEnter
- Procedure: TEdOrderForm.ItemsGridExit

## Definition of done

- CRUD works end to end; required fields validated; relations resolve; business rules enforced.
