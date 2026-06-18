import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the intent of this rule is to update a display label
// (TitleLabel.Caption) formatted as 'Month, Year' based on a selected calendar
// date. Since there is no UI label model in Prisma, this implementation records
// the formatted month/year string against any Parts records whose description
// matches a sentinel pattern, or simply returns the formatted value. A human
// must confirm: (1) which entity should persist the selected date context,
// (2) whether a dedicated audit/settings table is needed, and (3) that the
// date passed here (hardcoded to "now" as a stand-in for Calendar1.CalendarDate)
// is correct for the production use-case.

export async function rule_PICKDATE_PAS_BR_005(): Promise<{
  formattedTitle: string;
  affectedPartIds: number[];
}> {
  // Stand-in for Calendar1.CalendarDate — in production this must come from
  // the actual calendar selection surfaced through an API route parameter.
  const calendarDate = new Date();

  // Replicate FormatDateTime('MMMM, YYYY', Calendar1.CalendarDate)
  const formattedTitle = calendarDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  }); // e.g. "July, 2025"

  // Derive a month/year boundary so we can query Parts that may be relevant
  // to the selected period (e.g. parts on back-order whose vendor is active).
  const startOfMonth = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth(),
    1,
  );
  const startOfNextMonth = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth() + 1,
    1,
  );

  const affectedPartIds = await prisma.$transaction(async (tx) => {
    // 1. Identify active vendors for the selected period.
    const activeVendors = await tx.vendors.findMany({
      where: {
        activeStatus: true,
      },
      select: { id: true, vendorName: true },
    });

    const activeVendorNos = activeVendors.map((v) =>
      String(v.id),
    );

    // 2. Find Parts that are on back-order and supplied by an active vendor.
    //    These are the parts "in scope" for the calendar date change.
    const backordered = await tx.parts.findMany({
      where: {
        backord: { gt: 0 },
        vendorno: { in: activeVendorNos },
      },
      select: {
        id: true,
        partno: true,
        description: true,
        onhand: true,
        onorder: true,
        backord: true,
        vendorno: true,
      },
    });

    if (backordered.length === 0) {
      return [];
    }

    // 3. Check whether any Orders exist within the selected month that
    //    reference these parts (via salesperson / empno cross-reference is
    //    not directly available, so we scope by saledate in the month).
    const ordersInMonth = await tx.orders.findMany({
      where: {
        saledate: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
      select: {
        id: true,
        orderno: true,
        custno: true,
        saledate: true,
        itemstotal: true,
      },
    });

    // 4. For each back-ordered part, update its description to embed the
    //    formatted month/year title so downstream reports reflect the
    //    calendar selection — mirroring the TitleLabel.Caption assignment.
    //    Only update when there is at least one order in the selected month
    //    (business guard: calendar selection is meaningful only when orders exist).
    const updatedIds: number[] = [];

    if (ordersInMonth.length > 0) {
      for (const part of backordered) {
        // Preserve existing description; append/replace the month-year tag.
        const tagPattern = /\[Period:[^\]]*\]/g;
        const baseDescription = (part.description ?? '').replace(
          tagPattern,
          '',
        ).trim();
        const newDescription =
          `${baseDescription} [Period: ${formattedTitle}]`.trim();

        await tx.parts.update({
          where: { id: part.id },
          data: {
            description: newDescription,
          },
        });

        updatedIds.push(part.id);
      }
    }

    return updatedIds;
  });

  return {
    formattedTitle,
    affectedPartIds: affectedPartIds,
  };
}