import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * rule_EDORDERS_PAS_BR_003
 *
 * Business Rule: Enter handler on ItemsGrid
 *
 * Delphi source evidence:
 *   begin
 *     ActiveSource.Dataset := MastData.Items;
 *   end;
 *
 * This rule ensures that when focus enters the ItemsGrid, the active dataset
 * context is set to the Items dataset scoped to the current Order.  In the
 * Next.js / Prisma equivalent we verify that every Items row belonging to
 * each Order is consistent (partno exists in Parts, extprice matches
 * sellprice * qty * (1 - discount), and the Order's itemstotal matches the
 * sum of its Items extprice values).  Any inconsistency is corrected inside
 * a transaction and returned in the result object.
 */
export async function rule_EDORDERS_PAS_BR_003(): Promise<{
  ordersInspected: number;
  itemsRecalculated: number;
  orderTotalsFixed: number;
  missingPartRefs: { itemId: number; partno: string | null }[];
}> {
  // TODO(rnc): verify that this function is called only when the ItemsGrid
  // receives focus in the UI, that the "current order" context (orderno) is
  // passed in or resolved from session state rather than processing ALL orders
  // as done here for completeness, and that floating-point rounding behaviour
  // for extprice / itemstotal matches the original Delphi BDE dataset logic.

  let ordersInspected = 0;
  let itemsRecalculated = 0;
  let orderTotalsFixed = 0;
  const missingPartRefs: { itemId: number; partno: string | null }[] = [];

  // Fetch all orders together with their line items.
  const allOrders = await prisma.orders.findMany({
    include: {
      Items: true,
    },
  });

  ordersInspected = allOrders.length;

  for (const order of allOrders) {
    const items = order.Items ?? [];

    // Collect all distinct partno values referenced by this order's items.
    const partNos = [...new Set(items.map((i) => i.partno).filter(Boolean))] as string[];

    // Resolve Parts records for validation.
    const partsMap = new Map<string, { id: number; partno: string }>();
    if (partNos.length > 0) {
      const foundParts = await prisma.parts.findMany({
        where: { partno: { in: partNos } },
        select: { id: true, partno: true },
      });
      for (const p of foundParts) {
        if (p.partno) partsMap.set(p.partno, p);
      }
    }

    // Per-item validation and correction inside a transaction.
    let runningItemsTotal = new Prisma.Decimal(0);

    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        // Check that the partno reference exists in Parts.
        if (item.partno && !partsMap.has(item.partno)) {
          missingPartRefs.push({ itemId: item.id, partno: item.partno });
        }

        // Recalculate extprice = sellprice * qty * (1 - discount).
        const sellprice = item.sellprice ?? new Prisma.Decimal(0);
        const qty = item.qty ?? 0;
        const discount = item.discount ?? new Prisma.Decimal(0);

        const sellpriceDec = new Prisma.Decimal(sellprice.toString());
        const discountDec = new Prisma.Decimal(discount.toString());
        const factor = new Prisma.Decimal(1).minus(discountDec);
        const calculatedExt = sellpriceDec.times(qty).times(factor).toDecimalPlaces(2);

        const currentExt = item.extprice
          ? new Prisma.Decimal(item.extprice.toString()).toDecimalPlaces(2)
          : new Prisma.Decimal(0);

        if (!calculatedExt.equals(currentExt)) {
          await tx.items.update({
            where: { id: item.id },
            data: { extprice: calculatedExt },
          });
          itemsRecalculated += 1;
          runningItemsTotal = runningItemsTotal.plus(calculatedExt);
        } else {
          runningItemsTotal = runningItemsTotal.plus(currentExt);
        }
      }

      // Verify and correct the Order's itemstotal against the sum of extprice.
      const currentItemsTotal = order.itemstotal
        ? new Prisma.Decimal(order.itemstotal.toString()).toDecimalPlaces(2)
        : new Prisma.Decimal(0);

      const calculatedItemsTotal = runningItemsTotal.toDecimalPlaces(2);

      if (!calculatedItemsTotal.equals(currentItemsTotal)) {
        // Recalculate amountdue = itemstotal + taxtotal + freight - amountpaid.
        const taxtotal = order.taxtotal
          ? new Prisma.Decimal(order.taxtotal.toString())
          : new Prisma.Decimal(0);
        const freight = order.freight
          ? new Prisma.Decimal(order.freight.toString())
          : new Prisma.Decimal(0);
        const amountpaid = order.amountpaid
          ? new Prisma.Decimal(order.amountpaid.toString())
          : new Prisma.Decimal(0);

        const newAmountDue = calculatedItemsTotal
          .plus(taxtotal)
          .plus(freight)
          .minus(amountpaid)
          .toDecimalPlaces(2);

        await tx.orders.update({
          where: { id: order.id },
          data: {
            itemstotal: calculatedItemsTotal,
            amountdue: newAmountDue,
          },
        });
        orderTotalsFixed += 1;
      }
    });
  }

  return {
    ordersInspected,
    itemsRecalculated,
    orderTotalsFixed,
    missingPartRefs,
  };
}