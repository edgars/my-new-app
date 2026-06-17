import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Rule: EDORDERS_PAS_BR_008
// Condition: Change handler on OrdersSourceState
// Mirrors Delphi logic: PostBtn/CancelBtn enabled when Orders dataset is in an edit mode (dsEdit or dsInsert);
// CloseBtn enabled only when Orders dataset is in browse mode (dsBrowse).
// In a server-side context there is no visual dataset state machine, so this rule
// enforces the equivalent business invariant:
//   - An Order that is currently "open for editing" (has no shipdate, i.e. not yet posted/closed)
//     must have all required header fields populated before it can be considered "browsable/closeable".
//   - If the Order is incomplete (missing required fields), it is treated as still in edit mode
//     and cannot be closed/finalised.
//   - Any Order that is fully populated is treated as browse mode and is eligible to be closed.
// The function audits all Orders and:
//   1. Identifies Orders in "edit mode" (incomplete – missing shipdate, custno, or empno).
//   2. Identifies Orders in "browse mode" (complete – all key fields present).
//   3. For incomplete Orders, ensures amountdue is recalculated (itemstotal + taxtotal + freight - amountpaid).
//   4. For complete Orders, confirms amountdue is consistent (same recalculation).
// Returns a summary of how many orders were found in each state and how many had amountdue corrected.

export async function rule_EDORDERS_PAS_BR_008(): Promise<{
  editModeCount: number;
  browseModeCount: number;
  correctedCount: number;
}> {
  // TODO(rnc): verify that the "edit mode" heuristic (missing shipdate | custno | empno) correctly
  // maps to the Delphi dsEditModes check in your application's workflow. Also confirm that
  // amountdue recalculation formula (itemstotal + taxtotal + freight - amountpaid) matches
  // the authoritative calculation used elsewhere in the system. Verify that correcting amountdue
  // server-side does not conflict with any client-side pending edits or optimistic-lock strategy.

  const allOrders = await prisma.orders.findMany({
    select: {
      id: true,
      orderno: true,
      custno: true,
      empno: true,
      shipdate: true,
      itemstotal: true,
      taxtotal: true,
      freight: true,
      amountpaid: true,
      amountdue: true,
    },
  });

  type OrderSummary = {
    id: number;
    orderno: number | null;
    custno: number | null;
    empno: number | null;
    shipdate: Date | null;
    itemstotal: Prisma.Decimal | null;
    taxtotal: Prisma.Decimal | null;
    freight: Prisma.Decimal | null;
    amountpaid: Prisma.Decimal | null;
    amountdue: Prisma.Decimal | null;
  };

  const editModeOrders: OrderSummary[] = [];
  const browseModeOrders: OrderSummary[] = [];

  for (const order of allOrders as OrderSummary[]) {
    const isIncomplete =
      order.shipdate === null ||
      order.custno === null ||
      order.empno === null;

    if (isIncomplete) {
      editModeOrders.push(order);
    } else {
      browseModeOrders.push(order);
    }
  }

  const toDecimal = (v: Prisma.Decimal | null): Prisma.Decimal =>
    v ?? new Prisma.Decimal(0);

  const recalcAmountDue = (order: OrderSummary): Prisma.Decimal =>
    toDecimal(order.itemstotal)
      .plus(toDecimal(order.taxtotal))
      .plus(toDecimal(order.freight))
      .minus(toDecimal(order.amountpaid));

  const needsCorrection = (order: OrderSummary): boolean => {
    const expected = recalcAmountDue(order);
    const current = toDecimal(order.amountdue);
    return !expected.equals(current);
  };

  const allRelevantOrders = [...editModeOrders, ...browseModeOrders];
  const ordersToCorrect = allRelevantOrders.filter(needsCorrection);

  let correctedCount = 0;

  if (ordersToCorrect.length > 0) {
    await prisma.$transaction(async (tx) => {
      for (const order of ordersToCorrect) {
        const newAmountDue = recalcAmountDue(order);

        await tx.orders.update({
          where: { id: order.id },
          data: {
            amountdue: newAmountDue,
          },
        });

        correctedCount++;
      }
    });
  }

  return {
    editModeCount: editModeOrders.length,
    browseModeCount: browseModeOrders.length,
    correctedCount,
  };
}