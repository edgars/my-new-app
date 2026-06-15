# Epic — Manage Orders

**Goal:** full lifecycle management of Orders records at `/orders`.

## Stories

- `story-orders-crud` — list, create, view, edit, delete Orders.

## Business rules affecting this entity

- Condition: notFileExists(DataDir+'ORDERS  **(NEEDS REVIEW)**
- Procedure: TMastData.OrdersAfterCancel
- Procedure: TMastData.OrdersAfterDelete
- Procedure: TMastData.OrdersAfterPost
- Condition: Cust < OrdersShipDate  **(NEEDS REVIEW)**
- Procedure: TMastData.OrdersBeforeCancel
- Condition: (Orders = dsInsert)andnot(Items  **(NEEDS REVIEW)**
- Procedure: TMastData.OrdersBeforeClose
- Procedure: TMastData.OrdersBeforeDelete
- Procedure: TMastData.OrdersBeforeInsert
- Condition: Orders  **(NEEDS REVIEW)**
- Procedure: TMastData.OrdersBeforeOpen
- Procedure: TMastData.OrdersCalcFields
- Procedure: TMastData.OrdersNewRecord
- Procedure: TBrCustOrdForm.OrdersGridEnter
- Procedure: TEdOrderForm.OrdersSourceStateChange

## Definition of done

- CRUD works end to end; required fields validated; relations resolve; business rules enforced.
