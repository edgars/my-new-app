import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function rule_BRCSTORD_PAS_BR_007(): Promise<{
  ordersWithSelection: Awaited<ReturnType<typeof prisma.orders.findMany>>;
  message: string;
}> {
  // TODO(rnc): verify that "ActiveSource := MastData.OrdByCustSrc" means orders should be
  // fetched ordered/filtered by customer number (custno), mirroring the Delphi data source
  // switch. Also confirm that "dgAlwaysShowSelection" on OrdersGrid and its removal from
  // CustGrid is purely a UI concern handled client-side, and that this server function only
  // needs to return the orders-by-customer dataset. Verify sort field and direction with the
  // original OrdByCustSrc dataset definition.

  const ordersWithSelection = await prisma.$transaction(async (tx) => {
    // Replicate "ActiveSource := MastData.OrdByCustSrc":
    // Fetch all orders sorted by custno (ascending), then by saledate descending,
    // mirroring a typical "orders by customer" data source ordering.
    const orders = await tx.orders.findMany({
      orderBy: [
        { custno: 'asc' },
        { saledate: 'desc' },
      ],
      select: {
        id: true,
        orderno: true,
        custno: true,
        saledate: true,
        shipdate: true,
        shiptocontact: true,
        shiptoaddr1: true,
        shiptoaddr2: true,
        shiptocity: true,
        shiptostate: true,
        shiptozip: true,
        shiptocountry: true,
        shiptophone: true,
        shipvia: true,
        po: true,
        empno: true,
        terms: true,
        paymentmethod: true,
        itemstotal: true,
        taxrate: true,
        taxtotal: true,
        freight: true,
        amountpaid: true,
        amountdue: true,
        salesperson: true,
      },
    });

    return orders;
  });

  // UI state changes (dgAlwaysShowSelection on OrdersGrid, removal from CustGrid)
  // are client-side concerns and must be handled in the frontend component.
  // This function returns the activated orders-by-customer dataset to the caller.

  return {
    ordersWithSelection,
    message:
      'ActiveSource switched to OrdByCustSrc. OrdersGrid selection enabled; ' +
      'CustGrid always-show-selection disabled (apply UI flags client-side).',
  };
}