# Generated application

Modernized from a legacy system by RNC.

## Stack

- Frontend: nextjs
- Backend: nextjs + prisma
- Database: sqlite

## Entities

- Parts — `/parts`
- Vendors — `/vendors`
- Orders — `/orders`
- Customer — `/customers`
- Employee — `/employees`

## Run

```
npm install
npx prisma migrate dev
npm run dev
```
