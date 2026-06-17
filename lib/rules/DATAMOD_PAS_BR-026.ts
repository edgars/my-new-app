export async function ordersBeforeOpen(nextcustId?: string) {
  // TODO(rnc): verify that this handler correctly replicates the Delphi TMastData.OrdersBeforeOpen
  // procedure — confirm that opening CustByComp, CustByOrd, Cust, Emps, and Items datasets maps
  // to fetching these related entities from Prisma, that the correct foreign-key relationships and
  // filter conditions are used, and that the returned shape matches what the UI expects.

  const result = await prisma.$transaction(async (tx) => {
    const custByComp = await tx.nextcust.findMany({
      where: nextcustId ? { newcust: nextcustId } : undefined,
      orderBy: { newcust: "asc" },
    });

    const custByOrd = await tx.nextcust.findMany({
      where: nextcustId ? { newcust: nextcustId } : undefined,
      orderBy: { newcust: "desc" },
    });

    const cust = await tx.nextcust.findMany({
      where: nextcustId ? { newcust: nextcustId } : undefined,
    });

    const emps = await tx.employee
      ? await tx.employee.findMany()
      : [];

    const items = await tx.item
      ? await tx.item.findMany()
      : [];

    return {
      custByComp,
      custByOrd,
      cust,
      emps,
      items,
    };
  });

  return result;
}