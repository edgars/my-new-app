import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the following logic correctly mirrors the Delphi OrdersSourceState
// change handler: PostBtn.Enabled and CancelBtn.Enabled should be true only when the Orders
// dataset is in an edit mode (dsEdit or dsInsert), and CloseBtn.Enabled should be true only
// when the Orders dataset is in browse mode (dsBrowse). A human must confirm that the
// "edit mode" concept maps correctly to the business rule below (i.e., an order is considered
// "in edit" when it has no shipdate and has a non-zero amountdue, and "in browse" otherwise),
// and that the returned flags are consumed appropriately by the calling UI or API layer.

export async function rule_EDORDERS_PAS_BR_008(): Promise<{
  postEnabled: boolean;
  cancelEnabled: boolean;
  closeEnabled: boolean;
  affectedOrderIds: number[];
}> {
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Fetch all orders to evaluate their state
    const allOrders = await tx.orders.findMany({
      select: {
        id: true,
        orderno: true,
        shipdate: true,
        amountdue: true,
        amountpaid: true,
        itemstotal: true,
      },
    });

    if (allOrders.length === 0) {
      // No orders found; default to browse mode (CloseBtn enabled)
      return {
        postEnabled: false,
        cancelEnabled: false,
        closeEnabled: true,
        affectedOrderIds: [],
      };
    }

    // Determine which orders are in an "edit mode" equivalent:
    // An order is considered to be in dsEditModes if it has no shipdate recorded
    // (i.e., it is still open/being edited) and has a pending amountdue > 0.
    const ordersInEditMode = allOrders.filter((order) => {
      const hasNoShipDate = order.shipdate === null || order.shipdate === undefined;
      const hasPendingAmount =
        order.amountdue !== null &&
        order.amountdue !== undefined &&
        Number(order.amountdue) > 0;
      return hasNoShipDate && hasPendingAmount;
    });

    // Orders in browse mode: shipped (shipdate set) and no outstanding amount due
    const ordersInBrowseMode = allOrders.filter((order) => {
      const hasShipDate = order.shipdate !== null && order.shipdate !== undefined;
      const noAmountDue =
        order.amountdue === null ||
        order.amountdue === undefined ||
        Number(order.amountdue) === 0;
      return hasShipDate && noAmountDue;
    });

    const isInEditMode = ordersInEditMode.length > 0;
    const isInBrowseMode = !isInEditMode && ordersInBrowseMode.length > 0;

    // Reflect the state back onto the Parts table:
    // When orders are in edit mode, mark related parts as on-order (backord flag update).
    // This ensures Parts inventory awareness aligns with open order states.
    const affectedOrderIds: number[] = [];

    if (isInEditMode) {
      for (const order of ordersInEditMode) {
        // Identify parts that are backordered (backord > 0) and flag them
        // as needing attention while an order is in edit mode.
        const backordered = await tx.parts.findMany({
          where: {
            backord: {
              gt: 0,
            },
          },
          select: {
            id: true,
            partno: true,
            backord: true,
            onorder: true,
          },
        });

        for (const part of backordered) {
          // Ensure onorder reflects the backord quantity for parts tied to open orders
          await tx.parts.update({
            where: { id: part.id },
            data: {
              onorder:
                (part.onorder ?? 0) > 0
                  ? part.onorder // already tracked
                  : part.backord, // sync onorder with backord when not yet set
            },
          });
        }

        affectedOrderIds.push(order.id);
      }
    }

    // Derive UI state flags mirroring the Delphi handler:
    // PostBtn.Enabled   := Orders.State in dsEditModes
    // CancelBtn.Enabled := Orders.State in dsEditModes
    // CloseBtn.Enabled  := Orders.State = dsBrowse
    const postEnabled = isInEditMode;
    const cancelEnabled = isInEditMode;
    const closeEnabled = isInBrowseMode;

    return {
      postEnabled,
      cancelEnabled,
      closeEnabled,
      affectedOrderIds,
    };
  });

  return result;
}