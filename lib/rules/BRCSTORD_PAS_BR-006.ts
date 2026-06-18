import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that this function is triggered when focus enters CustGrid in the UI,
// and confirm that the visual selection-highlight behavior (dgAlwaysShowSelection toggling)
// is handled by the frontend layer — this backend rule captures the data-side intent of
// making the Customer dataset the active/master source and ensuring Orders is treated as
// subordinate (no persistent selection emphasis). Confirm that no additional state needs
// to be persisted to the database beyond what is queried here.

export async function rule_BRCSTORD_PAS_BR_006(): Promise<{
  activeSource: string;
  customers: Prisma.CustomersGetPayload<object>[];
  orders: Prisma.OrdersGetPayload<object>[];
}> {
  const result = await prisma.$transaction(async (tx) => {
    // Activate the Customer master source — fetch all customers to represent
    // the CustMasterSrc dataset becoming the ActiveSource.
    const customers = await tx.customers.findMany({
      orderBy: { custno: 'asc' },
    });

    // Fetch orders subordinate to the customer master — represents the
    // OrdersGrid dataset whose selection emphasis is removed (dgAlwaysShowSelection off).
    const orders = await tx.orders.findMany({
      orderBy: { orderno: 'asc' },
    });

    return {
      activeSource: 'CustMasterSrc',
      customers,
      orders,
    };
  });

  return result;
}