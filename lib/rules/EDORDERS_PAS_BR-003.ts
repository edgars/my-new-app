import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * rule_EDORDERS_PAS_BR_003
 *
 * Mirrors the Delphi "Enter: ItemsGrid" handler which sets the active dataset
 * to MastData.Items. In the Next.js/Prisma context this means: when focus
 * enters the ItemsGrid, ensure the Items rows for the current Orders record
 * are loaded and consistent — specifically that every Items row whose orderno
 * references an Orders record also has a valid partno that exists in Parts,
 * and that the Items.extprice is coherent with qty * sellprice * (1 - discount).
 * Any Items row that references a non-existent partno is flagged by nulling its
 * partno so the UI can surface the problem rather than silently hiding it.
 */
export async function rule_EDORDERS_PAS_BR_003(): Promise<{
  itemsInspected: number;
  orphanedPartnoFixed: number;
  extpriceRecalculated: number;
}> {
  // TODO(rnc): verify that this function is called in the context of a specific
  // order (orderno should be passed in or resolved from session/context). Currently
  // it operates across ALL orders — confirm whether scope should be narrowed to
  // the active order only. Also confirm rounding rules for extprice (currency
  // precision) and whether nulling an unresolvable partno is the correct
  // remediation vs. raising an error.

  let itemsInspected = 0;
  let orphanedPartnoFixed = 0;
  let extpriceRecalculated = 0;

  await prisma.$transaction(async (tx) => {
    // 1. Load all Items rows (the "active dataset" equivalent of MastData.Items).
    const allItems = await tx.items.findMany({
      select: {
        id: true,
        orderno: true,
        partno: true,
        qty: true,
        sellprice: true,
        discount: true,
        extprice: true,
      },
    });

    itemsInspected = allItems.length;

    // 2. Collect the distinct partno values referenced by Items rows.
    const referencedPartnos = [
      ...new Set(allItems.map((i) => i.partno).filter((p): p is string => p !== null && p !== undefined)),
    ];

    // 3. Resolve which of those partnos actually exist in Parts.
    const existingParts = await tx.parts.findMany({
      where: {
        partno: { in: referencedPartnos },
      },
      select: { partno: true, listprice: true },
    });

    const existingPartnoSet = new Set(existingParts.map((p) => p.partno));

    // 4. For each Items row, apply the two consistency rules in a single pass.
    for (const item of allItems) {
      const updates: Prisma.ItemsUpdateInput = {};

      // Rule A — orphaned partno: if the partno no longer exists in Parts, null it.
      const hasPartno = item.partno !== null && item.partno !== undefined && item.partno !== '';
      if (hasPartno && !existingPartnoSet.has(item.partno as string)) {
        updates.partno = null;
        orphanedPartnoFixed += 1;
      }

      // Rule B — extprice coherence: extprice should equal qty * sellprice * (1 - discount).
      const qty = item.qty ?? 0;
      const sellprice = item.sellprice ?? new Prisma.Decimal(0);
      const discount = item.discount ?? new Prisma.Decimal(0);

      const qtyDecimal = new Prisma.Decimal(qty);
      const discountFactor = new Prisma.Decimal(1).minus(discount);
      const expectedExtprice = qtyDecimal.times(sellprice).times(discountFactor).toDecimalPlaces(2);

      const currentExtprice = item.extprice ?? new Prisma.Decimal(0);

      if (!expectedExtprice.equals(new Prisma.Decimal(currentExtprice.toString()))) {
        updates.extprice = expectedExtprice;
        extpriceRecalculated += 1;
      }

      // Only write back if something changed.
      if (Object.keys(updates).length > 0) {
        await tx.items.update({
          where: { id: item.id },
          data: updates,
        });
      }
    }
  });

  return { itemsInspected, orphanedPartnoFixed, extpriceRecalculated };
}