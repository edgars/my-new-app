# Story — Orders CRUD

**As an** operator, **I want** to manage Orders records, **so that** the data stays current.

## Context

- Entity: `Orders` (table `orders`)
- Routes: list `/orders`, create `/orders/new`, edit `/orders/[id]/edit`
- API base: `/api/orders`

## Fields (render in order)

| Field | Label | Component | Required | List column |
|---|---|---|---|---|
| shipToAddr1 | Ship To Addr1 | input | no | yes |
| shipToAddr2 | Ship To Addr2 | input | no | yes |
| shipToContact | Ship To Contact | input | no | yes |
| shipToCity | Ship To City | input | no | yes |
| shipToState | Ship To State | input | no | yes |
| shipToZip | Ship To Zip | input | no | no |
| po | Po | input | no | no |
| terms | Terms | select | no | no |
| paymentMethod | Payment Method | select | no | no |
| shipVia | Ship Via | select | no | no |
| saleDate | Sale Date | input | no | no |
| amountPaid | Amount Paid | input | no | no |
| freight | Freight | input | no | no |
| amountDue | Amount Due | input | no | no |
| taxRate | Tax Rate | input | no | no |
| empNo | Emp No | select | no | no |
| custNo | Cust No | select | no | no |
| addr1 | Addr1 | read-only | no | no |
| addr2 | Addr2 | read-only | no | no |
| city | City | read-only | no | no |
| state | State | read-only | no | no |
| zip | Zip | read-only | no | no |
| itemsTotal | Items Total | read-only | no | no |
| taxTotal | Tax Total | read-only | no | no |
| orderNo | Order No | read-only | no | no |
| custNo | Cust No | read-only | no | no |

## Acceptance criteria

- [ ] `GET /api/orders` returns a paginated list.
- [ ] `POST /api/orders` creates a record after validating the body.
- [ ] `GET /api/orders/:id` returns one record.
- [ ] `PUT /api/orders/:id` updates a record.
- [ ] `DELETE /api/orders/:id` deletes a record.
- [ ] List page shows only *list column* fields, with search + pagination.
- [ ] Create and edit forms render all fields in order; required fields validated.
- [ ] Enforce: Condition: notFileExists(DataDir+'ORDERS  **(NEEDS REVIEW)**
- [ ] Enforce: Procedure: TMastData.OrdersAfterCancel
- [ ] Enforce: Procedure: TMastData.OrdersAfterDelete
- [ ] Enforce: Procedure: TMastData.OrdersAfterPost
- [ ] Enforce: Condition: Cust < OrdersShipDate  **(NEEDS REVIEW)**
- [ ] Enforce: Procedure: TMastData.OrdersBeforeCancel
- [ ] Enforce: Condition: (Orders = dsInsert)andnot(Items  **(NEEDS REVIEW)**
- [ ] Enforce: Procedure: TMastData.OrdersBeforeClose
- [ ] Enforce: Procedure: TMastData.OrdersBeforeDelete
- [ ] Enforce: Procedure: TMastData.OrdersBeforeInsert
- [ ] Enforce: Condition: Orders  **(NEEDS REVIEW)**
- [ ] Enforce: Procedure: TMastData.OrdersBeforeOpen
- [ ] Enforce: Procedure: TMastData.OrdersCalcFields
- [ ] Enforce: Procedure: TMastData.OrdersNewRecord
- [ ] Enforce: Procedure: TBrCustOrdForm.OrdersGridEnter
- [ ] Enforce: Procedure: TEdOrderForm.OrdersSourceStateChange
