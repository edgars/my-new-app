import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the intended behavior is to update a display label or
// record reflecting the selected calendar date formatted as 'Month, Year'
// (e.g. "January, 2024"). Confirm which entity/field should store or reflect
// this formatted date value, and whether any Parts, Orders, or other records
// should be filtered or updated based on the selected month+year. The original
// Delphi code only updated a UI caption — ensure the correct server-side
// equivalent action is captured here.

export async function rule_PICKDATE_PAS_BR_005(): Promise<{
  selectedMonth: number;
  selectedYear: number;
  formattedLabel: string;
  partsSnapshot: {
    id: number;
    partno: string | null;
    description: string | null;
    onhand: number | null;
    onorder: number | null;
    backord: number | null;
  }[];
  ordersInPeriod: {
    id: number;
    orderno: string | null;
    saledate: Date | null;
    shipdate: Date | null;
    itemstotal: Prisma.Decimal | null;
    amountdue: Prisma.Decimal | null;
  }[];
}> {
  // Replicate Calendar1.CalendarDate — use current date as the selected date
  // (in a real UI integration this would be passed in; here we default to now).
  const calendarDate = new Date();

  const selectedYear = calendarDate.getFullYear();
  const selectedMonth = calendarDate.getMonth(); // 0-based

  // FormatDateTime('MMMM, YYYY', Calendar1.CalendarDate)
  const formattedLabel = calendarDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Define the inclusive date range for the selected month/year
  const periodStart = new Date(selectedYear, selectedMonth, 1, 0, 0, 0, 0);
  const periodEnd = new Date(selectedYear, selectedMonth + 1, 1, 0, 0, 0, 0); // exclusive upper bound

  const result = await prisma.$transaction(async (tx) => {
    // Fetch all parts to provide a snapshot (mirrors what a calendar-driven
    // parts availability view would display for the chosen period).
    const parts = await tx.parts.findMany({
      select: {
        id: true,
        partno: true,
        description: true,
        onhand: true,
        onorder: true,
        backord: true,
      },
      orderBy: { partno: 'asc' },
    });

    // Fetch orders whose saledate falls within the selected month/year,
    // reflecting the calendar selection context.
    const orders = await tx.orders.findMany({
      where: {
        saledate: {
          gte: periodStart,
          lt: periodEnd,
        },
      },
      select: {
        id: true,
        orderno: true,
        saledate: true,
        shipdate: true,
        itemstotal: true,
        amountdue: true,
      },
      orderBy: { saledate: 'asc' },
    });

    return { parts, orders };
  });

  return {
    selectedMonth: selectedMonth + 1, // return 1-based month for readability
    selectedYear,
    formattedLabel,
    partsSnapshot: result.parts,
    ordersInPeriod: result.orders,
  };
}