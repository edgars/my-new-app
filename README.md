# Generated application

Modernized from a legacy system by RNC.

## Stack

- Frontend: nextjs
- Backend: nextjs + prisma
- Database: sqlite

## Entities

- Parts — `/parts`
- Orders — `/orders`
- Customer — `/customers`
- Nextcust — `/nextcusts`
- Vendors — `/vendors`
- Items — `/items`
- Nextord — `/nextords`
- Employee — `/employees`
- PickRpt — `/pick_rpts`
- PickOrderNoDlg — `/pick_order_no_dlgs`
- SearchDlg — `/search_dlgs`
- QueryCustDlg — `/query_cust_dlgs`

## Run

```
npm install
npx prisma migrate dev
npm run dev
```
