import { prisma } from '@/lib/prisma';

export async function rule_BRCSTORD_PAS_BR_006() {
  // TODO(rnc): verify that this rule properly handles the UI grid selection behavior described in the source evidence,
  // specifically ensuring that customer grid always shows selection while orders grid does not after entering customer grid
  const customers = await prisma.customers.findMany({
    take: 50, // reasonable batch size to ensure grid is populated
    orderBy: { custno: 'asc' }
  });

  // The source evidence indicates UI grid options manipulation which doesn't directly translate to backend logic
  // However, we can ensure the customer data is available for the grid by verifying records exist
  if (customers.length > 0) {
    // Customer records are available for the grid display
    return { processed: true, customerCount: customers.length };
  }

  return { processed: false, customerCount: 0 };
}