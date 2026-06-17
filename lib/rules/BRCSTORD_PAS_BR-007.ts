import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that this rule correctly mirrors the Delphi OnEnter handler for OrdersGrid —
// specifically confirm that "activating" the orders data source means the UI should reflect
// orders filtered by the currently selected customer (OrdByCustSrc), and that the
// dgAlwaysShowSelection toggle on both grids is handled purely on the client/UI layer;
// the server-side portion here fetches the relevant orders and customers to support that state.

export async function rule_BRCSTORD_PAS_BR_007(): Promise<{
  orders: Awaited<ReturnType<typeof prisma.orders.findMany>>;
  customers: Awaited<ReturnType<typeof prisma.customers.findMany>>;
}> {
  // This rule corresponds to the Enter event on OrdersGrid in the Delphi form.
  // When the user enters (focuses) the OrdersGrid:
  //   1. The active data source switches to OrdByCustSrc (orders filtered by current customer).
  //   2. OrdersGrid gains dgAlwaysShowSelection (selection always visible).
  //   3. CustGrid loses dgAlwaysShowSelection (selection no longer always visible).
  //
  // On the server side we materialise the "OrdByCustSrc" dataset: all orders joined
  // with their customer, ordered so the UI can highlight the correct row.

  const result = await prisma.$transaction(async (tx) => {
    // Fetch all customers so the caller can identify the "currently selected" customer
    // and apply dgAlwaysShowSelection logic on the client/UI layer.
    const customers = await tx.customers.findMany({
      orderBy: [{ custno: 'asc' }],
      select: {
        id: true,
        custno: true,
        company: true,
        addr1: true,
        addr2: true,
        city: true,
        state: true,
        zip: true,
        country: true,
        phone: true,
        fax: true,
        taxrate: true,
        contact: true,
        lastinvoicedate: true,
      },
    });

    // Fetch all orders ordered by customer number then order number,
    // mirroring OrdByCustSrc (orders grouped/sorted by customer).
    const orders = await tx.orders.findMany({
      orderBy: [
        { custno: 'asc' },
        { orderno: 'asc' },
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

    return { orders, customers };
  });

  return result;
}