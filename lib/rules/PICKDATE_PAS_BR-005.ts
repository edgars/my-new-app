import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the intended behavior is to update a display/label caption
// reflecting the selected calendar date formatted as 'Month, Year' (e.g. "January, 2024").
// Confirm which Parts (or related) records should be filtered or grouped by the selected
// month/year, and whether this function should persist any date selection state to the
// database or simply return formatted period metadata for UI consumption.

export async function rule_PICKDATE_PAS_BR_005(): Promise<{
  selectedPeriodLabel: string;
  periodYear: number;
  periodMonth: number;
  partsWithBackorders: Array<{
    id: number;
    partno: string | null;
    description: string | null;
    onhand: number | null;
    onorder: number | null;
    backord: number | null;
  }>;
  ordersInPeriod: Array<{
    id: number;
    orderno: number | null;
    custno: number | null;
    saledate: Date | null;
    amountdue: Prisma.Decimal | null;
  }>;
}> {
  // Simulate Calendar1.CalendarDate — in production this would come from user input/state.
  const calendarDate = new Date();

  const periodYear = calendarDate.getFullYear();
  const periodMonth = calendarDate.getMonth(); // 0-indexed

  // Replicate FormatDateTime('MMMM, YYYY', Calendar1.CalendarDate)
  const selectedPeriodLabel = calendarDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Define the inclusive date range for the selected month/year
  const periodStart = new Date(periodYear, periodMonth, 1, 0, 0, 0, 0);
  const periodEnd = new Date(periodYear, periodMonth + 1, 0, 23, 59, 59, 999);

  const [partsWithBackorders, ordersInPeriod] = await prisma.$transaction(
    async (tx) => {
      // Retrieve Parts that have active backorders in the selected period context
      const parts = await tx.parts.findMany({
        where: {
          backord: {
            gt: 0,
          },
        },
        select: {
          id: true,
          partno: true,
          description: true,
          onhand: true,
          onorder: true,
          backord: true,
        },
        orderBy: {
          partno: 'asc',
        },
      });

      // Retrieve Orders whose saledate falls within the selected calendar month/year
      const orders = await tx.orders.findMany({
        where: {
          saledate: {
            gte: periodStart,
            lte: periodEnd,
          },
        },
        select: {
          id: true,
          orderno: true,
          custno: true,
          saledate: true,
          amountdue: true,
        },
        orderBy: {
          saledate: 'asc',
        },
      });

      return [parts, orders] as const;
    }
  );

  return {
    selectedPeriodLabel,
    periodYear,
    periodMonth: periodMonth + 1, // return 1-indexed month for readability
    partsWithBackorders,
    ordersInPeriod,
  };
}