import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * rule_PICKDATE_PAS_BR_005
 *
 * Business Rule: Calendar1 Change Handler – Format and surface the selected
 * calendar date as a "MMMM, YYYY" month/year label, and return relevant
 * order/parts activity for that month so the UI can populate a title and
 * summary panel.
 */
export async function rule_PICKDATE_PAS_BR_005(): Promise<{
  formattedMonthYear: string;
  orderCount: number;
  totalSales: number;
  backorderedParts: Array<{ id: number; partno: string; description: string; backord: number }>;
}> {
  // TODO(rnc): verify that the "selected date" used here matches the value
  // bound to Calendar1.CalendarDate in the original Delphi form; currently
  // this implementation defaults to the current date (today) because no
  // parameter is accepted per the function signature contract.  A human must
  // confirm whether the calling context should pass the date in some other
  // way (e.g. environment variable, database config row, or a wrapper that
  // calls this function after storing the chosen date).

  const calendarDate: Date = new Date(); // mirrors Calendar1.CalendarDate

  // Replicate FormatDateTime('MMMM, YYYY', Calendar1.CalendarDate)
  const formattedMonthYear: string = calendarDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  }); // e.g. "July, 2025"

  // Define the inclusive date range for the selected month
  const monthStart = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
  const monthEnd = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);

  const result = await prisma.$transaction(async (tx) => {
    // ------------------------------------------------------------------ //
    // 1. Count orders whose saledate falls within the selected month       //
    // ------------------------------------------------------------------ //
    const ordersInMonth = await tx.orders.findMany({
      where: {
        saledate: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
      select: {
        id: true,
        orderno: true,
        itemstotal: true,
        taxtotal: true,
        freight: true,
        amountdue: true,
      },
    });

    const orderCount = ordersInMonth.length;

    // Sum amountdue across all orders in the month (mirrors a sales total)
    const totalSales = ordersInMonth.reduce((acc, order) => {
      const due =
        order.amountdue !== null && order.amountdue !== undefined
          ? Number(order.amountdue)
          : 0;
      return acc + due;
    }, 0);

    // ------------------------------------------------------------------ //
    // 2. Retrieve parts that are currently on back-order (backord > 0)    //
    //    so the UI can highlight supply issues alongside the date label.   //
    // ------------------------------------------------------------------ //
    const backorderedParts = await tx.parts.findMany({
      where: {
        backord: {
          gt: 0,
        },
      },
      select: {
        id: true,
        partno: true,
        description: true,
        backord: true,
      },
      orderBy: {
        backord: 'desc',
      },
    });

    return {
      formattedMonthYear,
      orderCount,
      totalSales,
      backorderedParts: backorderedParts.map((p) => ({
        id: p.id,
        partno: p.partno ?? '',
        description: p.description ?? '',
        backord: p.backord ?? 0,
      })),
    };
  });

  return result;
}