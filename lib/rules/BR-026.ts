async function ordersBeforeOpen(prisma: PrismaClient) {
  // TODO(rnc): verify that all five datasets (CustByComp, CustByOrd, Cust, Emps, Items/Parts)
  // are required to be pre-fetched/initialized before the Orders view/form opens;
  // confirm that no filtering, sorting, or pagination params are needed here beyond defaults;
  // confirm that "Items" maps to the Parts entity and not a separate line-items table.

  const [custByComp, custByOrd, cust, emps, items] = await prisma.$transaction([
    prisma.customer.findMany({
      orderBy: { company: "asc" },
    }),
    prisma.customer.findMany({
      orderBy: { orderId: "asc" },
    }),
    prisma.customer.findMany(),
    prisma.employee.findMany(),
    prisma.parts.findMany({
      select: {
        partno: true,
        description: true,
        onhand: true,
        onorder: true,
        vendorno: true,
        cost: true,
        listprice: true,
        backord: true,
      },
    }),
  ]);

  return {
    custByComp,
    custByOrd,
    cust,
    emps,
    items,
  };
}