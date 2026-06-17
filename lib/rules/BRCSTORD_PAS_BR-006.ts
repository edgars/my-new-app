import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that this rule correctly mirrors the Delphi CustGrid Enter handler —
// specifically confirm that "activating" the customer grid means marking customers as the
// active/focused dataset, that dgAlwaysShowSelection semantics map to the activeGrid flag
// stored or derived here, and that no additional UI-side effects need a server-side
// counterpart beyond what is captured in this function.

export async function rule_BRCSTORD_PAS_BR_006(): Promise<{
  activeGrid: 'CustGrid';
  custGridAlwaysShowSelection: true;
  ordersGridAlwaysShowSelection: false;
  affectedCustomers: number;
  affectedOrders: number;
}> {
  const result = await prisma.$transaction(async (tx) => {
    // Step 1: Confirm the Customers dataset is accessible and count available records,
    // mirroring "ActiveSource := MastData.CustMasterSrc" — the customer source becomes active.
    const customerCount = await tx.customers.count();

    // Step 2: Confirm the Orders dataset is accessible, mirroring the fact that
    // OrdersGrid loses dgAlwaysShowSelection (it is de-emphasised when CustGrid is entered).
    const orderCount = await tx.orders.count();

    // Step 3: Retrieve a representative sample of customers to confirm the grid
    // would have data to display with selection always shown.
    const customers = await tx.customers.findMany({
      select: {
        id: true,
        custno: true,
        company: true,
        contact: true,
        city: true,
        state: true,
        phone: true,
        lastinvoicedate: true,
      },
      orderBy: { custno: 'asc' },
      take: 50,
    });

    // Step 4: Retrieve a representative sample of orders to confirm the orders
    // dataset remains available but is no longer the "always show selection" grid.
    const orders = await tx.orders.findMany({
      select: {
        id: true,
        orderno: true,
        custno: true,
        saledate: true,
        shipdate: true,
        amountdue: true,
        salesperson: true,
      },
      orderBy: { orderno: 'asc' },
      take: 50,
    });

    // Validate that the datasets are non-empty so the UI state change is meaningful.
    if (customerCount === 0) {
      throw new Prisma.PrismaClientKnownRequestError(
        'No customer records found; CustGrid cannot become the active selection grid.',
        { code: 'P2025', clientVersion: Prisma.prismaVersion.client }
      );
    }

    return {
      // Mirrors: CustGrid.Options := CustGrid.Options + [dgAlwaysShowSelection]
      activeGrid: 'CustGrid' as const,
      custGridAlwaysShowSelection: true as const,

      // Mirrors: OrdersGrid.Options := OrdersGrid.Options - [dgAlwaysShowSelection]
      ordersGridAlwaysShowSelection: false as const,

      affectedCustomers: customerCount,
      affectedOrders: orderCount,

      // Diagnostic payloads — confirm grid would render correct rows.
      _customerSample: customers,
      _orderSample: orders,
    };
  });

  return {
    activeGrid: result.activeGrid,
    custGridAlwaysShowSelection: result.custGridAlwaysShowSelection,
    ordersGridAlwaysShowSelection: result.ordersGridAlwaysShowSelection,
    affectedCustomers: result.affectedCustomers,
    affectedOrders: result.affectedOrders,
  };
}