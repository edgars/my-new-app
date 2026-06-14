# Generated application

Modernized from a legacy system by RNC.

## Stack

- Frontend: nextjs
- Backend: nextjs + prisma
- Database: sqlite

## Entities

- AdminDetails — `/admin_details`
- CustomerDetails — `/customer_details`
- Deposite — `/deposites`
- Withdraw — `/withdraws`
- NewCustomerRegistration — `/new_customer_registrations`

## Run

```
npm install
npx prisma migrate dev
npm run dev
```
