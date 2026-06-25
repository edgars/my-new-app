# Generated application

Modernized from a legacy system by RNC.

## Stack

- Frontend: nextjs
- Backend: nextjs + prisma
- Database: sqlite

## Entities

- Parts — `/parts`
- Customer — `/customers`
- Orders — `/orders`
- Vendors — `/vendors`
- Employee — `/employees`

## Run

```
npm install
npx prisma migrate dev
npm run dev
```
