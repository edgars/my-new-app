import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * rule_BRCSTORD_PAS_BR_007
 *
 * Implements the business rule triggered when focus enters the OrdersGrid.
 * Original Delphi logic:
 *   - Sets the active data source to OrdByCustSrc (orders filtered by customer)
 *   - Adds dgAlwaysShowSelection to OrdersGrid.Options
 *   - Removes dgAlwaysShowSelection from CustGrid.Options
 *
 * In the Next.js/Prisma context this translates to:
 *   - Fetching all Orders joined with their related Customers and Items
 *     (representing the "OrdByCust" dataset — orders grouped/associated by customer)
 *   - Returning the result set so the UI layer can activate it as the primary
 *     grid source and adjust selection-highlight behaviour on both grids.
 */

export async function rule_BRCSTORD_PAS_BR_007(): Promise<{
  activeSource: Array<{
    order: {
      id: number;
      orderno: number | null;
      custno: number | null;
      saledate: Date | null;
      shipdate: Date | null;
      shiptocontact: string | null;
      shiptoaddr1: string | null;
      shiptoaddr2: string | null;
      shiptocity: string | null;
      shiptostate: string | null;
      shiptozip: string | null;
      shiptocountry: string | null;
      shiptophone: string | null;
      shipvia: string | null;
      po: string | null;
      empno: number | null;
      terms: string | null;
      paymentmethod: string | null;
      itemstotal: number | null;
      taxrate: number | null;
      taxtotal: number | null;
      freight: number | null;
      amountpaid: number | null;
      amountdue: number | null;
      salesperson: string | null;
    };
    customer: {
      id: number;
      custno: number | null;
      company: string | null;
      addr1: string | null;
      addr2: string | null;
      city: string | null;
      state: string | null;
      zip: string | null;
      country: string | null;
      phone: string | null;
      fax: string | null;
      taxrate: number | null;
      contact: string | null;
      lastinvoicedate: Date | null;
    } | null;
    items: Array<{
      id: number;
      itemno: number | null;
      orderno: number | null;
      description: string | null;
      sellprice: number | null;
      qty: number | null;
      discount: number | null;
      extprice: number | null;
      partno: string | null;
    }>;
  }>;
  ordersGridAlwaysShowSelection: boolean;
  custGridAlwaysShowSelection: boolean;
}> {
  // TODO(rnc): verify that:
  //   1. The "OrdByCustSrc" dataset should indeed be represented as all Orders
  //      joined to Customers (by custno) and their line Items (by orderno),
  //      sorted/filtered in the same way the original Delphi TDataSource was
  //      configured (e.g. filtered to a specific custno, or sorted by custno).
  //   2. The boolean flags returned here (ordersGridAlwaysShowSelection = true,
  //      custGridAlwaysShowSelection = false) are consumed by the UI component
  //      to toggle the "always show selection" highlight on each grid, matching
  //      the original dgAlwaysShowSelection option manipulation.
  //   3. No write operations are required by this rule; if that assumption is
  //      wrong, wrap any future writes in prisma.$transaction().

  // Fetch all orders, their associated customer, and their line items.
  // This mirrors the OrdByCustSrc dataset that becomes the active source
  // when focus enters the OrdersGrid.
  const orders = await prisma.orders.findMany({
    orderBy: [
      { custno: 'asc' },
      { orderno: 'asc' },
    ],
  });

  const activeSource = await Promise.all(
    orders.map(async (order) => {
      // Resolve the related customer by custno
      const customer = order.custno != null
        ? await prisma.customers.findFirst({
            where: { custno: order.custno },
          })
        : null;

      // Resolve all line items belonging to this order by orderno
      const items = order.orderno != null
        ? await prisma.items.findMany({
            where: { orderno: order.orderno },
            orderBy: { itemno: 'asc' },
          })
        : [];

      return {
        order,
        customer: customer ?? null,
        items,
      };
    }),
  );

  // Mirror the Delphi grid-option changes:
  //   OrdersGrid.Options := OrdersGrid.Options + [dgAlwaysShowSelection]  → true
  //   CustGrid.Options   := CustGrid.Options   - [dgAlwaysShowSelection]  → false
  const ordersGridAlwaysShowSelection = true;
  const custGridAlwaysShowSelection = false;

  return {
    activeSource,
    ordersGridAlwaysShowSelection,
    custGridAlwaysShowSelection,
  };
}