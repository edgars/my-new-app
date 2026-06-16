# Generated application

Modernized from a legacy system by RNC.

## Stack

- Frontend: nextjs
- Backend: nextjs + prisma
- Database: sqlite

## Entities

- Parts — `/parts`
- Nextcust — `/nextcusts`
- Vendors — `/vendors`
- Orders — `/orders`
- Customer — `/customers`
- Items — `/items`
- Nextord — `/nextords`
- Employee — `/employees`

## Run

```
npm install
npx prisma migrate dev
npm run dev
```
