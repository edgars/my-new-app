# UX Design — JP-Delphi

One section per entity. Each has a list page, a create form and an edit form. Render fields in the order shown.

## Parts  (`/parts`)

| Field | Label | Component | Required | List column |
|---|---|---|---|---|
| onHand | On Hand | input | no | yes |
| onOrder | On Order | input | no | yes |
| cost | Cost | input | no | yes |
| listPrice | List Price | input | no | yes |
| partNo | Part No | input | no | yes |
| vendorNo | Vendor No | select | no | no |
| description | Description | textarea | no | no |

## Nextcusts  (`/nextcusts`)

| Field | Label | Component | Required | List column |
|---|---|---|---|---|
| newcust | Newcust | input | no | yes |

## Vendors  (`/vendors`)

| Field | Label | Component | Required | List column |
|---|---|---|---|---|

## Orders  (`/orders`)

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

## Customers  (`/customers`)

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

## Items  (`/items`)

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

## Nextords  (`/nextords`)

| Field | Label | Component | Required | List column |
|---|---|---|---|---|
| newkey | Newkey | input | no | yes |

## Employees  (`/employees`)

| Field | Label | Component | Required | List column |
|---|---|---|---|---|
| empno | Empno | input | no | yes |
| fullname | Fullname | input | no | yes |
| lastname | Lastname | input | no | yes |
| firstname | Firstname | input | no | yes |
| phoneext | Phoneext | input | no | yes |
| hiredate | Hiredate | input | no | yes |
| salary | Salary | input | no | yes |

