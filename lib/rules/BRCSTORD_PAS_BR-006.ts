import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that this rule correctly mirrors the Delphi "Enter: CustGrid" handler —
// specifically confirm that "ActiveSource" switching (MastData.CustMasterSrc) is handled
// elsewhere in the UI layer, and that toggling dgAlwaysShowSelection on CustGrid / off
// OrdersGrid is represented here as a metadata/state update rather than a true UI option.
// Also confirm which Customers and Orders records should be fetched to populate both grids,
// and whether any write-back to the database is required by this rule or if it is read-only.

export async function rule_BRCSTORD_PAS_BR_006(): Promise<{
  activeSource: string;
  customers: Awaited<ReturnType<typeof prisma.customers.findMany>>;
  orders: Awaited<ReturnType<typeof prisma.orders.findMany>>;
  custGridAlwaysShowSelection: boolean;
  ordersGridAlwaysShowSelection: boolean;
}> {
  // This rule models the Enter handler on CustGrid:
  //   1. Set ActiveSource to CustMasterSrc (Customers is now the active/focused dataset).
  //   2. CustGrid gains dgAlwaysShowSelection (always highlight the selected customer row).
  //   3. OrdersGrid loses dgAlwaysShowSelection (de-emphasise the orders grid selection).
  //
  // Because dgAlwaysShowSelection is a pure UI option in Delphi, the server-side
  // responsibility here is to load the canonical Customers dataset (CustMasterSrc) and
  // the related Orders dataset so the client can render both grids correctly.

  const [customers, orders] = await prisma.$transaction(async (tx) => {
    // Load all customers ordered by their natural key — mirrors CustMasterSrc dataset.
    const customerRows = await tx.customers.findMany({
      orderBy: { custno: 'asc' },
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

    // Load all orders ordered by order number — mirrors the OrdersGrid dataset.
    // The UI will filter/link these to the active customer on the client side.
    const orderRows = await tx.orders.findMany({
      orderBy: { orderno: 'asc' },
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

    return [customerRows, orderRows] as const;
  });

  // Return the state that the UI layer must apply:
  //   activeSource                  → which grid/dataset owns focus ('CustMasterSrc')
  //   custGridAlwaysShowSelection   → true  (Options + [dgAlwaysShowSelection])
  //   ordersGridAlwaysShowSelection → false (Options - [dgAlwaysShowSelection])
  return {
    activeSource: 'CustMasterSrc',
    customers,
    orders,
    custGridAlwaysShowSelection: true,
    ordersGridAlwaysShowSelection: false,
  };
}