import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function rule_PICKDATE_PAS_BR_005(): Promise<{
  selectedDate: Date;
  formattedTitle: string;
  ordersInMonth: number;
  partsWithBackorder: number;
}> {
  // TODO(rnc): verify that the calling UI passes the selected calendar date into
  // this function (currently hardcoded to `new Date()` as a stand-in for
  // Calendar1.CalendarDate), and that the returned formattedTitle string is
  // applied to the equivalent of TitleLabel.Caption in the Next.js component.

  const calendarDate: Date = new Date(); // stand-in for Calendar1.CalendarDate

  // Replicate FormatDateTime('MMMM, YYYY', Calendar1.CalendarDate)
  const formattedTitle: string = calendarDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Derive the first and last moment of the selected month for range queries
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth(); // 0-based

  const monthStart = new Date(year, month, 1, 0, 0, 0, 0);
  const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const result = await prisma.$transaction(async (tx) => {
    // Count Orders whose saledate falls within the selected month
    const ordersInMonth = await tx.orders.count({
      where: {
        saledate: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    // Count Parts that currently have a backorder quantity > 0
    const partsWithBackorder = await tx.parts.count({
      where: {
        backord: {
          gt: 0,
        },
      },
    });

    return {
      ordersInMonth,
      partsWithBackorder,
    };
  });

  return {
    selectedDate: calendarDate,
    formattedTitle,
    ordersInMonth: result.ordersInMonth,
    partsWithBackorder: result.partsWithBackorder,
  };
}