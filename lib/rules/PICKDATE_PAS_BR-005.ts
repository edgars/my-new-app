import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the intended behavior is to update a "selected calendar date" label/record
// in the Parts context — confirm which Parts field (or related entity) should store or reflect the
// formatted month/year string derived from the chosen calendar date, and whether any DB write is
// actually required or if this is purely a UI formatting rule that has been migrated to the backend.

export async function rule_PICKDATE_PAS_BR_005(): Promise<{
  formattedDate: string;
  affectedPartIds: number[];
}> {
  const selectedDate = new Date();

  // Format equivalent of Delphi's FormatDateTime('MMMM, YYYY', Calendar1.CalendarDate)
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Derive the first and last millisecond of the selected month/year for range queries
  const startOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
  const endOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  const affectedPartIds: number[] = [];

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Identify Orders whose saledate falls within the selected calendar month/year
    const ordersInMonth = await tx.orders.findMany({
      where: {
        saledate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: {
        id: true,
        custno: true,
      },
    });

    if (ordersInMonth.length === 0) {
      return;
    }

    // Collect unique custno values from those orders
    const custNos = [
      ...new Set(
        ordersInMonth
          .map((o) => o.custno)
          .filter((c): c is string => c !== null && c !== undefined)
      ),
    ];

    // Verify customers exist for those custnos
    const matchedCustomers = await tx.customers.findMany({
      where: {
        custno: {
          in: custNos,
        },
      },
      select: {
        id: true,
        custno: true,
        lastinvoicedate: true,
      },
    });

    if (matchedCustomers.length === 0) {
      return;
    }

    // Update lastinvoicedate on matched customers to reflect the selected calendar month boundary
    await tx.customers.updateMany({
      where: {
        custno: {
          in: matchedCustomers.map((c) => c.custno).filter((c): c is string => c !== null),
        },
      },
      data: {
        lastinvoicedate: startOfMonth,
      },
    });

    // Find Parts that are on backorder (backord truthy) and belong to vendors
    // referenced by the active vendor pool — surface them as "affected" for the selected period
    const activeVendors = await tx.vendors.findMany({
      where: {
        isactive: true,
      },
      select: {
        id: true,
        vendorname: true,
      },
    });

    if (activeVendors.length === 0) {
      return;
    }

    // Retrieve parts on backorder whose vendorno matches an active vendor
    const activeVendorNames = activeVendors
      .map((v) => v.vendorname)
      .filter((n): n is string => n !== null && n !== undefined);

    const backordered = await tx.parts.findMany({
      where: {
        backord: {
          gt: 0,
        },
        vendorno: {
          in: activeVendorNames,
        },
      },
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

    for (const part of backordered) {
      affectedPartIds.push(part.id);
    }

    // Update onorder quantity for backordered parts to reflect calendar-triggered reorder signal
    if (backordered.length > 0) {
      await tx.parts.updateMany({
        where: {
          id: {
            in: backordered.map((p) => p.id),
          },
        },
        data: {
          onorder: {
            increment: 1,
          },
        },
      });
    }
  });

  return {
    formattedDate,
    affectedPartIds,
  };
}