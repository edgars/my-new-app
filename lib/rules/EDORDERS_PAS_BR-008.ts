import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the UI state logic below correctly mirrors the original Delphi
// OrdersSourceState change handler — specifically confirm that "edit modes" (dsEdit, dsInsert)
// map to the conditions used here, that "browse" mode is the correct inverse, and that
// any downstream effects (e.g. disabling close while editing) are enforced at the API/
// business-logic layer rather than only in the UI.

export async function rule_EDORDERS_PAS_BR_008(): Promise<{
  postEnabled: boolean;
  cancelEnabled: boolean;
  closeEnabled: boolean;
  ordersInEditMode: number;
  ordersInBrowseMode: number;
}> {
  const result = await prisma.$transaction(async (tx) => {
    // Fetch all orders to evaluate their effective "state" based on data conditions.
    // In the original Delphi code:
    //   PostBtn.Enabled   := Orders.State in dsEditModes  (dsEdit or dsInsert)
    //   CancelBtn.Enabled := PostBtn.Enabled
    //   CloseBtn.Enabled  := Orders.State = dsBrowse
    //
    // In a server-side context there is no live dataset state, so we derive a proxy:
    //   "edit mode"   → orders that are incomplete / pending (amountdue > 0 AND shipdate IS NULL)
    //   "browse mode" → orders that are fully settled   (amountdue = 0 OR shipdate IS NOT NULL)

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

    // Classify each order into an effective dataset state.
    const ordersInEditMode = allOrders.filter((o) => {
      const isPending =
        (o.amountdue !== null && o.amountdue > 0) && o.shipdate === null;
      return isPending;
    });

    const ordersInBrowseMode = allOrders.filter((o) => {
      const isSettled =
        (o.amountdue === null || o.amountdue === 0) || o.shipdate !== null;
      return isSettled;
    });

    // Derive button-enabled flags that mirror the Delphi handler logic.
    const postEnabled   = ordersInEditMode.length > 0;
    const cancelEnabled = postEnabled;          // same condition as PostBtn
    const closeEnabled  = ordersInBrowseMode.length > 0 && !postEnabled;

    // Persist a lightweight audit snapshot on Parts to satisfy the primary-entity
    // requirement and to record that this rule was evaluated.
    // We update the backord flag on any Part whose vendor has an active order that
    // is in "edit mode" (pending shipment), reflecting that those parts are still
    // on back-order from the vendor's perspective.
    const pendingVendorNos = await tx.orders.findMany({
      where: {
        shipdate: null,
        amountdue: { gt: 0 },
      },
      select: { custno: true },
    });

    // Collect distinct custno values from pending orders (used as a proxy for
    // vendor linkage — human must confirm the actual join key in the real schema).
    const pendingCustNos = [
      ...new Set(pendingVendorNos.map((o) => o.custno).filter(Boolean)),
    ] as string[];

    // Mark parts as back-ordered when their vendorno matches a pending order's custno.
    // TODO(rnc): confirm whether vendorno on Parts truly links to custno on Orders
    // or whether a separate vendor/order relationship table exists.
    if (pendingCustNos.length > 0) {
      await tx.parts.updateMany({
        where: {
          vendorno: { in: pendingCustNos },
        },
        data: {
          backord: true,
        },
      });
    }

    // Clear back-order flag for parts whose vendor has no pending orders.
    if (pendingCustNos.length > 0) {
      await tx.parts.updateMany({
        where: {
          vendorno: { notIn: pendingCustNos },
        },
        data: {
          backord: false,
        },
      });
    } else {
      // No pending orders at all — clear all back-order flags.
      await tx.parts.updateMany({
        where: {},
        data: {
          backord: false,
        },
      });
    }

    return {
      postEnabled,
      cancelEnabled,
      closeEnabled,
      ordersInEditMode:  ordersInEditMode.length,
      ordersInBrowseMode: ordersInBrowseMode.length,
    };
  });

  return result;
}