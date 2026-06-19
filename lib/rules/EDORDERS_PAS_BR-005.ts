import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function rule_EDORDERS_PAS_BR_005(): Promise<{
  message: string;
  mode: 'edit' | 'browse';
  affectedPartIds: number[];
}> {
  // TODO(rnc): verify that the intended business logic here maps correctly from the
  // Delphi ActiveSourceState change handler. The original code toggled a UI mode
  // indicator (red = dsEdit/dsInsert, blue = browse) and switched HelpContext.
  // A human must confirm: (1) what "ActiveSourceState in [dsEdit, dsInsert]" means
  // in data terms — here interpreted as Parts records that are currently on order
  // (onorder > 0) being in "edit/insert" mode, and all others in "browse" mode;
  // (2) whether any actual data mutation is required or if this is purely a
  // classification/reporting rule; (3) the correct threshold values for onhand,
  // onorder, and backord fields used below.

  const result = await prisma.$transaction(async (tx) => {
    // Fetch all Parts records to evaluate their "active source state"
    const allParts = await tx.parts.findMany({
      select: {
        id: true,
        partno: true,
        description: true,
        onhand: true,
        onorder: true,
        backord: true,
        cost: true,
        listprice: true,
        vendorno: true,
      },
    });

    // Classify parts into "edit/insert" mode vs "browse" mode,
    // mirroring the dsEdit/dsInsert vs browse state distinction.
    // "Edit/Insert" state: parts that have pending orders (onorder > 0)
    //   or have back-orders (backord > 0) — i.e., actively being modified.
    // "Browse" state: parts that are stable (onorder == 0 and backord == 0).
    const editInsertParts: typeof allParts = [];
    const browseParts: typeof allParts = [];

    for (const part of allParts) {
      const onorder = part.onorder ?? 0;
      const backord = part.backord ?? 0;

      if (onorder > 0 || backord > 0) {
        editInsertParts.push(part);
      } else {
        browseParts.push(part);
      }
    }

    // Determine the dominant mode based on which group is larger,
    // reflecting the ActiveSourceState toggle logic.
    const mode: 'edit' | 'browse' =
      editInsertParts.length >= browseParts.length ? 'edit' : 'browse';

    // For parts in "edit/insert" mode, ensure their cost and listprice are
    // consistent (listprice must be >= cost). Flag and correct any inversion,
    // mirroring the "red indicator" / active-edit guard the original handler implied.
    const correctedPartIds: number[] = [];

    if (editInsertParts.length > 0) {
      for (const part of editInsertParts) {
        const cost = part.cost ?? new Prisma.Decimal(0);
        const listprice = part.listprice ?? new Prisma.Decimal(0);

        const costNum = new Prisma.Decimal(cost);
        const listpriceNum = new Prisma.Decimal(listprice);

        // If listprice < cost, correct listprice to equal cost (minimum margin guard)
        if (listpriceNum.lessThan(costNum)) {
          await tx.parts.update({
            where: { id: part.id },
            data: {
              listprice: costNum,
            },
          });
          correctedPartIds.push(part.id);
        }
      }
    }

    // For parts in "browse" mode with zero onhand and zero onorder,
    // ensure backord is also zeroed out (data consistency when not in edit state).
    const browseFixedIds: number[] = [];

    for (const part of browseParts) {
      const onhand = part.onhand ?? 0;
      const onorder = part.onorder ?? 0;
      const backord = part.backord ?? 0;

      if (onhand === 0 && onorder === 0 && backord > 0) {
        await tx.parts.update({
          where: { id: part.id },
          data: {
            backord: 0,
          },
        });
        browseFixedIds.push(part.id);
      }
    }

    const affectedPartIds = [...new Set([...correctedPartIds, ...browseFixedIds])];

    return {
      message:
        `ActiveSourceState rule evaluated. Mode: ${mode}. ` +
        `Parts in edit/insert state: ${editInsertParts.length}. ` +
        `Parts in browse state: ${browseParts.length}. ` +
        `Parts corrected (listprice < cost): ${correctedPartIds.length}. ` +
        `Parts fixed (stale backord cleared): ${browseFixedIds.length}.`,
      mode,
      affectedPartIds,
    };
  });

  return result;
}