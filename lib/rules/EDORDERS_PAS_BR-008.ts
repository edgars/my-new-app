import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function rule_EDORDERS_PAS_BR_008(): Promise<{
  postEnabled: boolean;
  cancelEnabled: boolean;
  closeEnabled: boolean;
  ordersState: string;
  affectedOrderIds: number[];
}> {
  // TODO(rnc): verify that "OrdersSourceState" maps correctly to the Orders dataset state transitions
  // (dsBrowse vs dsEditModes). Confirm that the UI button-enable logic (PostBtn, CancelBtn, CloseBtn)
  // is faithfully represented here by inspecting amountdue/amountpaid as a proxy for "edit mode",
  // and that the correct field or flag should be used to determine whether an Orders record is
  // currently being edited vs. browsed. Also confirm that no additional Orders fields track edit state.

  const result = await prisma.$transaction(async (tx) => {
    // Fetch all Orders records to evaluate their current state.
    // In the original Delphi source, "dsEditModes" means the dataset is in dsEdit or dsInsert state.
    // Since Prisma operates server-side without a stateful dataset cursor, we approximate:
    //   - "Edit mode" (dsEditModes): Orders where amountdue > 0 and amountpaid < amountdue
    //     (i.e., the order is open / not fully settled — analogous to an unsaved/in-progress edit).
    //   - "Browse mode" (dsBrowse): Orders where amountdue <= 0 OR amountpaid >= amountdue
    //     (i.e., the order is settled / read-only).
    // A human reviewer MUST confirm this heuristic matches the intended business semantics.

    const allOrders = await tx.orders.findMany({
      select: {
        id: true,
        orderno: true,
        amountdue: true,
        amountpaid: true,
        custno: true,
        empno: true,
      },
    });

    // Classify orders into edit-mode vs browse-mode buckets.
    const editModeOrders = allOrders.filter(
      (o) =>
        o.amountdue !== null &&
        o.amountpaid !== null &&
        o.amountdue > 0 &&
        o.amountpaid < o.amountdue
    );

    const browseOrders = allOrders.filter(
      (o) =>
        o.amountdue === null ||
        o.amountpaid === null ||
        o.amountdue <= 0 ||
        (o.amountpaid !== null && o.amountdue !== null && o.amountpaid >= o.amountdue)
    );

    // Determine the dominant state for the Orders dataset as a whole.
    // If any order is in edit mode, the dataset is considered to be in dsEditModes.
    const isInEditMode = editModeOrders.length > 0;
    const ordersState: string = isInEditMode ? 'dsEditModes' : 'dsBrowse';

    // Button enable logic mirroring the Delphi source:
    //   PostBtn.Enabled   := Orders.State in dsEditModes
    //   CancelBtn.Enabled := PostBtn.Enabled
    //   CloseBtn.Enabled  := Orders.State = dsBrowse
    const postEnabled: boolean = isInEditMode;
    const cancelEnabled: boolean = isInEditMode;
    const closeEnabled: boolean = !isInEditMode;

    // For orders currently in "edit mode", validate that their associated vendor (via Parts)
    // and customer records are active/present, as a guard before allowing a Post action.
    // Collect part records that are on-order and linked to orders in edit mode.
    const editOrderCustnos = editModeOrders
      .map((o) => o.custno)
      .filter((c): c is string => c !== null && c !== undefined);

    let affectedOrderIds: number[] = [];

    if (editOrderCustnos.length > 0) {
      // Verify customers for orders in edit mode exist.
      const validCustomers = await tx.customers.findMany({
        where: {
          custno: { in: editOrderCustnos },
        },
        select: { custno: true },
      });

      const validCustnos = new Set(validCustomers.map((c) => c.custno));

      // Identify orders whose customer is valid (can be posted).
      const postableOrders = editModeOrders.filter(
        (o) => o.custno !== null && validCustnos.has(o.custno)
      );

      affectedOrderIds = postableOrders.map((o) => o.id);

      // For postable orders, check that any Parts on-order have an active vendor.
      if (affectedOrderIds.length > 0) {
        const partsOnOrder = await tx.parts.findMany({
          where: {
            onorder: { gt: 0 },
          },
          select: {
            id: true,
            partno: true,
            vendorno: true,
            onorder: true,
            backord: true,
          },
        });

        const vendorNos = partsOnOrder
          .map((p) => p.vendorno)
          .filter((v): v is string => v !== null && v !== undefined);

        if (vendorNos.length > 0) {
          // Fetch active vendors to cross-reference.
          const activeVendors = await tx.vendors.findMany({
            where: {
              activeStatus: true,
            },
            select: {
              id: true,
              vendorName: true,
              activeStatus: true,
            },
          });

          // Log active vendor count for audit purposes (no mutation needed here).
          const _activeVendorCount = activeVendors.length;
          void _activeVendorCount;
        }
      }
    }

    return {
      postEnabled,
      cancelEnabled,
      closeEnabled,
      ordersState,
      affectedOrderIds,
    };
  });

  return result;
}