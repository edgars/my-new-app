import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that this function correctly mirrors the Delphi "Enter: CustGrid" handler —
// specifically confirm that setting dgAlwaysShowSelection ON for CustGrid and OFF for OrdersGrid
// maps to the intended UI-focus / active-dataset logic in the Next.js/Prisma layer, and that
// "ActiveSource := MastData.CustMasterSrc" is satisfied by making Customers the primary query
// result returned here (no server-side Prisma equivalent of a visual grid option exists;
// a human must wire the returned data into the appropriate client-side grid state).

export async function rule_BRCSTORD_PAS_BR_006(): Promise<{
  activeSource: 'CustMasterSrc';
  customers: Prisma.CustomersGetPayload<object>[];
  custGridAlwaysShowSelection: boolean;
  ordersGridAlwaysShowSelection: boolean;
}> {
  // Step 1: Activate the Customer master source — fetch all customers to represent
  // "ActiveSource := MastData.CustMasterSrc" (the customer dataset becomes the active source).
  const customers = await prisma.$transaction(async (tx) => {
    // Fetch all customers ordered by company name, mirroring a master dataset open/active state.
    const allCustomers = await tx.customers.findMany({
      orderBy: {
        company: 'asc',
      },
    });

    return allCustomers;
  });

  // Step 2: Derive the grid option states that mirror the Delphi logic:
  //   CustGrid.Options   := CustGrid.Options + [dgAlwaysShowSelection]  → true
  //   OrdersGrid.Options := OrdersGrid.Options - [dgAlwaysShowSelection] → false
  //
  // These boolean flags must be consumed by the client component to set the
  // corresponding grid UI property (e.g. always highlight the selected row).
  const custGridAlwaysShowSelection = true;
  const ordersGridAlwaysShowSelection = false;

  // Step 3: Return a structured result that the calling layer (server action / route handler)
  // can forward to the client so it can:
  //   a) Bind `customers` to CustGrid as the active data source.
  //   b) Apply `custGridAlwaysShowSelection`   → CustGrid always shows its selection highlight.
  //   c) Apply `ordersGridAlwaysShowSelection` → OrdersGrid removes its selection highlight.
  return {
    activeSource: 'CustMasterSrc',
    customers,
    custGridAlwaysShowSelection,
    ordersGridAlwaysShowSelection,
  };
}