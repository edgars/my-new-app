import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Rule: EDORDERS_PAS_BR_008
// Condition: Change handler on OrdersSourceState
// Mirrors Delphi logic: PostBtn/CancelBtn enabled when Orders dataset is in an edit mode (dsEdit or dsInsert);
// CloseBtn enabled only when Orders dataset is in browse mode (dsBrowse).
// In a server-side context there is no visual dataset state machine, so this rule
// validates the implied state by inspecting whether a given order record exists and
// is in a consistent, committable condition before allowing a "post" (save) action.

export async function rule_EDORDERS_PAS_BR_008(): Promise<{
  canPost: boolean;
  canCancel: boolean;
  canClose: boolean;
  pendingOrderIds: number[];
  browseOrderIds: number[];
  message: string;
}> {
  // TODO(rnc): verify that the concept of "edit mode" (dsEdit/dsInsert) is correctly
  // represented here as orders whose amountdue does not yet equal (itemstotal + taxtotal + freight - amountpaid),
  // and that "browse mode" (dsBrowse) is correctly represented as fully reconciled orders.
  // Also confirm that the threshold / reconciliation logic below matches the actual
  // business intent before deploying to production.

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Fetch all orders to evaluate their implied dataset state.
    const allOrders = await tx.orders.findMany({
      select: {
        id: true,
        orderno: true,
        itemstotal: true,
        taxrate: true,
        taxtotal: true,
        freight: true,
        amountpaid: true,
        amountdue: true,
      },
    });

    // "Edit mode" (dsEdit / dsInsert): orders where the stored amountdue does not
    // match the computed expected amount due, meaning the record has unsaved /
    // inconsistent changes that need to be posted or cancelled.
    const pendingOrders = allOrders.filter((order) => {
      const itemstotal = order.itemstotal ?? new Prisma.Decimal(0);
      const taxtotal  = order.taxtotal  ?? new Prisma.Decimal(0);
      const freight   = order.freight   ?? new Prisma.Decimal(0);
      const amountpaid = order.amountpaid ?? new Prisma.Decimal(0);
      const amountdue  = order.amountdue  ?? new Prisma.Decimal(0);

      const expectedDue = new Prisma.Decimal(itemstotal)
        .plus(new Prisma.Decimal(taxtotal))
        .plus(new Prisma.Decimal(freight))
        .minus(new Prisma.Decimal(amountpaid));

      return !new Prisma.Decimal(amountdue).equals(expectedDue);
    });

    // "Browse mode" (dsBrowse): orders where amountdue is fully reconciled.
    const browseOrders = allOrders.filter((order) => {
      const itemstotal  = order.itemstotal  ?? new Prisma.Decimal(0);
      const taxtotal    = order.taxtotal    ?? new Prisma.Decimal(0);
      const freight     = order.freight     ?? new Prisma.Decimal(0);
      const amountpaid  = order.amountpaid  ?? new Prisma.Decimal(0);
      const amountdue   = order.amountdue   ?? new Prisma.Decimal(0);

      const expectedDue = new Prisma.Decimal(itemstotal)
        .plus(new Prisma.Decimal(taxtotal))
        .plus(new Prisma.Decimal(freight))
        .minus(new Prisma.Decimal(amountpaid));

      return new Prisma.Decimal(amountdue).equals(expectedDue);
    });

    // For each pending (edit-mode) order, reconcile amountdue to its computed value.
    // This mirrors the Delphi "Post" action that commits in-memory edits to the dataset.
    if (pendingOrders.length > 0) {
      for (const order of pendingOrders) {
        const itemstotal  = new Prisma.Decimal(order.itemstotal  ?? 0);
        const taxtotal    = new Prisma.Decimal(order.taxtotal    ?? 0);
        const freight     = new Prisma.Decimal(order.freight     ?? 0);
        const amountpaid  = new Prisma.Decimal(order.amountpaid  ?? 0);

        const correctedDue = itemstotal
          .plus(taxtotal)
          .plus(freight)
          .minus(amountpaid);

        await tx.orders.update({
          where: { id: order.id },
          data: { amountdue: correctedDue },
        });
      }
    }

    // Derive button-enabled states from the implied dataset state:
    // PostBtn.Enabled   := Orders.State in dsEditModes  → true when there are pending orders
    // CancelBtn.Enabled := PostBtn.Enabled              → same as PostBtn
    // CloseBtn.Enabled  := Orders.State = dsBrowse      → true when ALL orders are reconciled
    const isInEditMode = pendingOrders.length > 0;
    const isInBrowseMode = pendingOrders.length === 0;

    return {
      canPost:         isInEditMode,
      canCancel:       isInEditMode,
      canClose:        isInBrowseMode,
      pendingOrderIds: pendingOrders.map((o) => o.id),
      browseOrderIds:  browseOrders.map((o) => o.id),
      message: isInEditMode
        ? `${pendingOrders.length} order(s) were in edit mode and have been reconciled (posted).`
        : 'All orders are in browse mode; no reconciliation required.',
    };
  });

  return result;
}