# Architecture — JP-Delphi

## Stack

- Frontend: nextjs
- Backend: nextjs + prisma
- Database: sqlite

## Data model

### Parts (`parts`)

| Column | Type | Nullable |
|---|---|---|
| id | Int (PK, auto) | no |
| partno | Float | no |
| description | String | no |
| onhand | Float? | yes |
| onorder | Float? | yes |
| vendorno | Float? | yes |
| cost | Decimal? | yes |
| listprice | Decimal? | yes |
| backord | Boolean? | yes |

### Nextcust (`nextcust`)

| Column | Type | Nullable |
|---|---|---|
| id | Int (PK, auto) | no |
| newcust | Float? | yes |

### Vendors (`vendors`)

| Column | Type | Nullable |
|---|---|---|
| id | Int (PK, auto) | no |

### Orders (`orders`)

| Column | Type | Nullable |
|---|---|---|
| id | Int (PK, auto) | no |
| orderno | Float? | yes |
| custno | Float | no |
| saledate | DateTime? | yes |
| shipdate | DateTime? | yes |
| shiptocontact | String? | yes |
| shiptoaddr1 | String? | yes |
| shiptoaddr2 | String? | yes |
| shiptocity | String? | yes |
| shiptostate | String? | yes |
| shiptozip | String? | yes |
| shiptocountry | String? | yes |
| shiptophone | String? | yes |
| shipvia | String? | yes |
| po | String? | yes |
| empno | Int | no |
| terms | String? | yes |
| paymentmethod | String? | yes |
| itemstotal | Decimal? | yes |
| taxrate | Float? | yes |
| taxtotal | Decimal? | yes |
| freight | Decimal? | yes |
| amountpaid | Decimal? | yes |
| amountdue | Decimal? | yes |
| salesperson | String? | yes |

### Customer (`customer`)

| Column | Type | Nullable |
|---|---|---|
| id | Int (PK, auto) | no |
| custno | Float? | yes |
| company | String? | yes |
| addr1 | String? | yes |
| addr2 | String? | yes |
| city | String? | yes |
| state | String? | yes |
| zip | String? | yes |
| country | String? | yes |
| phone | String? | yes |
| fax | String? | yes |
| taxrate | Float? | yes |
| contact | String? | yes |
| lastinvoicedate | DateTime? | yes |

### Items (`items`)

| Column | Type | Nullable |
|---|---|---|
| id | Int (PK, auto) | no |
| itemno | Float? | yes |
| orderno | Float? | yes |
| description | String? | yes |
| sellprice | Decimal? | yes |
| qty | Int? | yes |
| discount | Float? | yes |
| extprice | Decimal? | yes |
| partno | Float? | yes |

### Nextord (`nextord`)

| Column | Type | Nullable |
|---|---|---|
| id | Int (PK, auto) | no |
| newkey | Float? | yes |

### Employee (`employee`)

| Column | Type | Nullable |
|---|---|---|
| id | Int (PK, auto) | no |
| empno | Int? | yes |
| fullname | String? | yes |
| lastname | String? | yes |
| firstname | String? | yes |
| phoneext | String? | yes |
| hiredate | DateTime? | yes |
| salary | Float? | yes |

## Architecture Decision Records

### ADR-001 — Target stack

**Decision:** build on nextjs / nextjs / sqlite.
**Why:** chosen in the RNC Architecture Canvas as a supported, modern replacement for the legacy stack.

### ADR-002 — One module per entity

**Decision:** each entity gets its own route group, API, validation schema and pages.
**Why:** mirrors the legacy screen-per-entity structure and keeps the app navigable.

### ADR-003 — Relations as dynamic lookups

**Decision:** a foreign key is edited via a dropdown sourced from the related entity's list API; the FK stores the related record's id.
**Why:** reproduces the legacy lookup behavior with referential integrity.
