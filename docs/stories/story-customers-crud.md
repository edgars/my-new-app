# Story — Customers CRUD

**As an** operator, **I want** to manage Customers records, **so that** the data stays current.

## Context

- Entity: `Customer` (table `customer`)
- Routes: list `/customers`, create `/customers/new`, edit `/customers/[id]/edit`
- API base: `/api/customers`

## Fields (render in order)

| Field | Label | Component | Required | List column |
|---|---|---|---|---|
| company | Company | input | no | yes |
| addr1 | Addr1 | input | no | yes |
| addr2 | Addr2 | input | no | yes |
| city | City | input | no | yes |
| state | State | input | no | yes |
| zip | Zip | input | no | no |
| country | Country | input | no | no |
| phone | Phone | input | no | no |
| taxRate | Tax Rate | input | no | no |
| contact | Contact | input | no | no |
| lastInvoiceDate | Last Invoice Date | input | no | no |
| fax | Fax | input | no | no |
| custNo | Cust No | read-only | no | no |

## Acceptance criteria

- [ ] `GET /api/customers` returns a paginated list.
- [ ] `POST /api/customers` creates a record after validating the body.
- [ ] `GET /api/customers/:id` returns one record.
- [ ] `PUT /api/customers/:id` updates a record.
- [ ] `DELETE /api/customers/:id` deletes a record.
- [ ] List page shows only *list column* fields, with search + pagination.
- [ ] Create and edit forms render all fields in order; required fields validated.
- [ ] Enforce: Procedure: TCustomerByInvoiceReport.QRDBText1Print
