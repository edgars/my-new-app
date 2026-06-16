async function ordersBeforeOpen(prisma: PrismaClient) {
  // TODO(rnc): verify that all five datasets (CustByComp, CustByOrd, Cust, Emps, Items/Parts)
  // are required to be pre-fetched together before any Orders screen/process opens;
  // confirm that the returned data shapes match what the consuming UI or service expects,
  // and that no additional filtering (e.g. by company, by user) should be applied here.

  const [customersByCompany, customersByOrder, customers, employees, parts] =
    await prisma.$transaction([
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
    customersByCompany,
    customersByOrder,
    customers,
    employees,
    parts,
  };
}