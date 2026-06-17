async function ordersBeforeOpen(prisma: PrismaClient) {
  // TODO(rnc): verify that all five datasets (CustByComp, CustByOrd, Cust, Emps, Items/Parts)
  // need to be pre-fetched/initialized together before the Orders view opens, confirm the
  // correct filter/sort criteria for each query mirrors the original Delphi dataset configuration,
  // and ensure that any dataset-level filters (IndexName, MasterSource, MasterFields) are
  // replicated in the Prisma query options below.

  const [customersByCompany, customersByOrder, customers, employees, parts] =
    await prisma.$transaction([
      prisma.customer.findMany({
        orderBy: {
          company: "asc",
        },
      }),

      prisma.customer.findMany({
        orderBy: {
          orderId: "asc",
        },
      }),

      prisma.customer.findMany({
        orderBy: {
          id: "asc",
        },
      }),

      prisma.employee.findMany({
        orderBy: {
          id: "asc",
        },
      }),

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
        orderBy: {
          partno: "asc",
        },
      }),
    ]);

  return {
    customersByCompany,
    customersByOrder,
    customers,
    employees,
    parts,
  };
}