import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that this function is triggered when focus enters CustGrid in the UI,
// and that the intent is to mark CustGrid as the "active" grid (always-show-selection enabled)
// while removing always-show-selection from OrdersGrid. Confirm that the application state
// management (e.g., a shared context or store) correctly reflects ActiveSource switching to
// the Customer master data source, and that downstream grid/form components respond accordingly.

export async function rule_BRCSTORD_PAS_BR_006(): Promise<{
  activeSource: string;
  custGridAlwaysShowSelection: boolean;
  ordersGridAlwaysShowSelection: boolean;
  customerCount: number;
}> {
  // Replicate the Delphi logic:
  //   ActiveSource := MastData.CustMasterSrc   → active data source is now Customers
  //   CustGrid.Options += [dgAlwaysShowSelection]    → CustGrid always shows selection
  //   OrdersGrid.Options -= [dgAlwaysShowSelection]  → OrdersGrid no longer always shows selection
  //
  // On the server side we materialise this by:
  //   1. Confirming the Customers dataset is accessible (mirrors CustMasterSrc being active).
  //   2. Confirming the Orders dataset is accessible (mirrors OrdersGrid losing focus).
  //   3. Returning the UI-state flags so the client can apply them to the grids.

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Fetch a lightweight count of active customers to confirm CustMasterSrc is live.
    const customerCount = await tx.customers.count();

    // Fetch a lightweight count of orders to confirm OrdersGrid data source is still open
    // but no longer the active/focused source.
    const orderCount = await tx.orders.count();

    return {
      customerCount,
      orderCount,
    };
  });

  // Return the resolved UI-state descriptor that the front-end must apply:
  //   activeSource                  → 'CustMasterSrc'
  //   custGridAlwaysShowSelection   → true   (dgAlwaysShowSelection added)
  //   ordersGridAlwaysShowSelection → false  (dgAlwaysShowSelection removed)
  return {
    activeSource: 'CustMasterSrc',
    custGridAlwaysShowSelection: true,
    ordersGridAlwaysShowSelection: false,
    customerCount: result.customerCount,
  };
}