import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * rule_PICKDATE_PAS_BR_005
 *
 * Business Rule: Calendar1 Change Handler
 *
 * When a date is selected on Calendar1, format and return the selected date
 * as a "MMMM, YYYY" style label caption (e.g. "January, 2024").
 * This rule also queries Orders to find any orders whose saledate falls within
 * the selected month/year, returning a summary for display alongside the label.
 */

export async function rule_PICKDATE_PAS_BR_005(): Promise<{
  titleLabelCaption: string;
  ordersInMonth: Array<{
    id: number;
    orderno: string | null;
    saledate: Date | null;
    custno: string | null;
    amountdue: Prisma.Decimal | null;
  }>;
}> {
  // TODO(rnc): verify that the calling UI passes the selected Calendar1.CalendarDate
  // into this function (currently hardcoded to new Date() as a stand-in), and that
  // the "MMMM, YYYY" formatted caption is wired back to the TitleLabel component.
  // Also confirm that filtering Orders by saledate within the selected month is the
  // intended data scope for this calendar change event.

  const calendarDate: Date = new Date(); // stand-in for Calendar1.CalendarDate

  // Build "MMMM, YYYY" formatted caption equivalent
  const titleLabelCaption = calendarDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Determine the start and end of the selected month
  const startOfMonth = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
  const endOfMonth = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  const ordersInMonth = await prisma.$transaction(async (tx) => {
    const orders = await tx.orders.findMany({
      where: {
        saledate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: {
        id: true,
        orderno: true,
        saledate: true,
        custno: true,
        amountdue: true,
      },
      orderBy: {
        saledate: 'asc',
      },
    });

    return orders;
  });

  return {
    titleLabelCaption,
    ordersInMonth,
  };
}