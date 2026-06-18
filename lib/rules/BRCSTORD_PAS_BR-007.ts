import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that this rule correctly mirrors the legacy Delphi "Enter: OrdersGrid" handler,
// which switches the active data source to OrdByCustSrc, enables dgAlwaysShowSelection on OrdersGrid,
// and disables dgAlwaysShowSelection on CustGrid. Confirm that the UI-focus semantics (active grid
// selection state) are fully represented by the data-layer query below, and that any additional
// side-effects of switching the active source (e.g. filtering orders by the currently selected
// customer) are handled upstream by the caller.

export async function rule_BRCSTORD_PAS_BR_007(): Promise<{
  orders: {
    id: number;
    orderno: string | null;
    custno: string | null;
    saledate: Date | null;
    shipdate: Date | null;
    amountdue: Prisma.Decimal | null;
    amountpaid: Prisma.Decimal | null;
    salesperson: string | null;
  }[];
  customers: {
    id: number;
    custno: string | null;
    company: string | null;
    city: string | null;
    state: string | null;
    phone: string | null;
    lastinvoicedate: Date | null;
  }[];
  activeGrid: 'OrdersGrid';
  ordersGridAlwaysShowSelection: boolean;
  custGridAlwaysShowSelection: boolean;
}> {
  // Replicate OrdByCustSrc: fetch all orders sorted by custno then saledate,
  // mirroring the dataset that becomes the active source when focus enters OrdersGrid.
  const [orders, customers] = await prisma.$transaction(async (tx) => {
    const fetchedOrders = await tx.orders.findMany({
      orderBy: [
        { custno: 'asc' },
        { saledate: 'asc' },
      ],
      select: {
        id: true,
        orderno: true,
        custno: true,
        saledate: true,
        shipdate: true,
        amountdue: true,
        amountpaid: true,
        salesperson: true,
      },
    });

    // Fetch customers so the caller can reflect the CustGrid state
    // (selection highlight removed — dgAlwaysShowSelection disabled).
    const fetchedCustomers = await tx.customers.findMany({
      orderBy: [
        { custno: 'asc' },
      ],
      select: {
        id: true,
        custno: true,
        company: true,
        city: true,
        state: true,
        phone: true,
        lastinvoicedate: true,
      },
    });

    return [fetchedOrders, fetchedCustomers] as const;
  });

  // Return the UI-state flags that the legacy handler toggled so that the
  // front-end (or a higher-level orchestrator) can apply them to the grids.
  return {
    orders,
    customers,
    activeGrid: 'OrdersGrid',          // ActiveSource := MastData.OrdByCustSrc
    ordersGridAlwaysShowSelection: true, // OrdersGrid.Options + [dgAlwaysShowSelection]
    custGridAlwaysShowSelection: false,  // CustGrid.Options  - [dgAlwaysShowSelection]
  };
}