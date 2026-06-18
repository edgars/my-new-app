import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function rule_BRCSTORD_PAS_BR_007(): Promise<{
  orders: Array<{
    id: number;
    orderno: string | null;
    custno: string | null;
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
    empno: string | null;
    terms: string | null;
    paymentmethod: string | null;
    itemstotal: Prisma.Decimal | null;
    taxrate: Prisma.Decimal | null;
    taxtotal: Prisma.Decimal | null;
    freight: Prisma.Decimal | null;
    amountpaid: Prisma.Decimal | null;
    amountdue: Prisma.Decimal | null;
    salesperson: string | null;
  }>;
  activeGridContext: {
    ordersGridAlwaysShowSelection: boolean;
    custGridAlwaysShowSelection: boolean;
  };
}> {
  // TODO(rnc): verify that the caller supplies a valid custno filter context (i.e. a customer is
  // currently selected in CustGrid) so that the orders query is correctly scoped to
  // "OrdByCustSrc" semantics (orders filtered/sorted by customer number). Also confirm that
  // the UI layer consuming this result correctly applies dgAlwaysShowSelection=true to
  // OrdersGrid and dgAlwaysShowSelection=false to CustGrid, mirroring the original Delphi
  // grid-options manipulation. Finally, verify the sort order expected by OrdByCustSrc
  // (likely custno ASC, saledate ASC) matches the orderBy clause below.

  const orders = await prisma.$transaction(async (tx) => {
    // Replicate ActiveSource := MastData.OrdByCustSrc
    // OrdByCustSrc is a customer-scoped orders data source — fetch all orders
    // ordered by custno then saledate, matching the master-detail binding pattern.
    const result = await tx.orders.findMany({
      orderBy: [
        { custno: 'asc' },
        { saledate: 'asc' },
      ],
    });

    return result;
  });

  // Replicate grid option changes:
  //   OrdersGrid.Options := OrdersGrid.Options + [dgAlwaysShowSelection]  → true
  //   CustGrid.Options   := CustGrid.Options   - [dgAlwaysShowSelection]  → false
  const activeGridContext = {
    ordersGridAlwaysShowSelection: true,
    custGridAlwaysShowSelection: false,
  };

  return {
    orders,
    activeGridContext,
  };
}