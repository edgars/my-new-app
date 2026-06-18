import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Rule: EDORDERS_PAS_BR_008
// Condition: Change handler on OrdersSourceState
// Mirrors Delphi logic: PostBtn/CancelBtn enabled when Orders dataset is in an edit mode (dsEdit or dsInsert);
// CloseBtn enabled only when Orders dataset is in browse mode (dsBrowse).
// In a server-side context there is no visual state machine, so this rule enforces the
// equivalent data-integrity constraint: an Order that is "in-flight" (has no amountpaid
// recorded yet and amountdue > 0) is treated as being in an edit mode and must not be
// considered "closeable" / finalised until it is fully settled.

export async function rule_EDORDERS_PAS_BR_008(): Promise<{
  editModeOrders: number[];
  browseModeOrders: number[];
  lockedForClose: number[];
}> {
  // TODO(rnc): verify that the business definition of "edit mode" vs "browse mode" matches
  // the application's actual workflow state. Specifically confirm:
  //   1. Whether "edit mode" should be derived from amountdue > amountpaid, a dedicated
  //      status field, or another mechanism (no explicit status field exists on Orders).
  //   2. Whether "browse mode" (closeable) truly means amountdue == 0 or amountpaid >= amountdue.
  //   3. That PostBtn / CancelBtn / CloseBtn semantics map correctly to the server-side
  //      actions taken here (no UI mutation is performed; only classification is returned).
  //   4. That freight, taxtotal, and itemstotal are always populated before this rule runs.

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Fetch all orders with the fields needed to determine their "state"
    const allOrders = await tx.orders.findMany({
      select: {
        id: true,
        orderno: true,
        amountpaid: true,
        amountdue: true,
        itemstotal: true,
        taxtotal: true,
        freight: true,
        saledate: true,
        shipdate: true,
      },
    });

    const editModeOrders: number[] = [];   // PostBtn.Enabled = true, CancelBtn.Enabled = true
    const browseModeOrders: number[] = []; // CloseBtn.Enabled = true
    const lockedForClose: number[] = [];   // Neither fully settled nor clearly in edit — needs attention

    for (const order of allOrders) {
      const amountDue = order.amountdue ?? new Prisma.Decimal(0);
      const amountPaid = order.amountpaid ?? new Prisma.Decimal(0);

      // Derive a computed expected total so we can cross-check amountdue integrity
      const itemsTotal = order.itemstotal ?? new Prisma.Decimal(0);
      const taxTotal = order.taxtotal ?? new Prisma.Decimal(0);
      const freight = order.freight ?? new Prisma.Decimal(0);
      const computedTotal = new Prisma.Decimal(itemsTotal)
        .plus(new Prisma.Decimal(taxTotal))
        .plus(new Prisma.Decimal(freight));

      // "Edit mode" (dsEdit / dsInsert): order has outstanding balance
      // Equivalent to PostBtn.Enabled := Orders.State in dsEditModes
      const isInEditMode =
        new Prisma.Decimal(amountDue).greaterThan(new Prisma.Decimal(0)) &&
        new Prisma.Decimal(amountPaid).lessThan(new Prisma.Decimal(amountDue));

      // "Browse mode" (dsBrowse): order is fully settled — safe to close
      // Equivalent to CloseBtn.Enabled := Orders.State = dsBrowse
      const isInBrowseMode =
        new Prisma.Decimal(amountDue).equals(new Prisma.Decimal(0)) ||
        new Prisma.Decimal(amountPaid).greaterThanOrEqualTo(new Prisma.Decimal(amountDue));

      // Flag orders where computed total disagrees with stored amountdue — needs human review
      const totalMismatch = !computedTotal.equals(new Prisma.Decimal(amountDue).plus(new Prisma.Decimal(amountPaid)));

      if (isInEditMode && !totalMismatch) {
        editModeOrders.push(order.id);
      } else if (isInBrowseMode && !totalMismatch) {
        browseModeOrders.push(order.id);
      } else {
        // Mismatch or ambiguous state — lock from close, flag for review
        lockedForClose.push(order.id);
      }
    }

    // Persist a lightweight audit: mark any order whose amountdue is inconsistent
    // with its computed total by zeroing nothing — we only log via a read-only
    // classification here. No destructive writes are made without human confirmation.
    // (Actual UI enable/disable logic must be enforced in the calling layer.)

    return {
      editModeOrders,
      browseModeOrders,
      lockedForClose,
    };
  });

  return result;
}