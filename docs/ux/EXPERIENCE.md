# UX — Experience & Flows

Every entity follows the same flow:

1. **List** — the user opens `/entity` and sees a table of records (only the *list column* fields), with search and pagination.
2. **Create** — the user clicks *New*, fills the form (all fields, in order), saves.
3. **Edit** — the user clicks a row, edits the prefilled form, saves or deletes.

## Per-entity routes

| Entity | List | Create | Edit |
|---|---|---|---|
| Parts | `/parts` | `/parts/new` | `/parts/[id]/edit` |
| Nextcusts | `/nextcusts` | `/nextcusts/new` | `/nextcusts/[id]/edit` |
| Vendors | `/vendors` | `/vendors/new` | `/vendors/[id]/edit` |
| Orders | `/orders` | `/orders/new` | `/orders/[id]/edit` |
| Customers | `/customers` | `/customers/new` | `/customers/[id]/edit` |
| Items | `/items` | `/items/new` | `/items/[id]/edit` |
| Nextords | `/nextords` | `/nextords/new` | `/nextords/[id]/edit` |
| Employees | `/employees` | `/employees/new` | `/employees/[id]/edit` |

