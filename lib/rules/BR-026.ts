async function ordersBeforeOpen(prisma: PrismaClient) {
  // TODO(rnc): verify that all five datasets (CustByComp, CustByOrd, Cust, Emps, Items/Parts)
  // need to be eagerly loaded before the Orders view/form opens; confirm that fetching all
  // customers, employees, and parts records up-front is intentional and not filtered by
  // current user, company, or date range — also confirm sort/index expectations that the
  // original CustByComp (by company) and CustByOrd (by order) represent.

  const [customersByCompany, customersByOrder, customers, employees, parts] =
    await prisma.$transaction([
      prisma.customer.findMany({
        orderBy: { company: "asc" },
      }),
      prisma.customer.findMany({
        orderBy: { orderno: "asc" },
      }),
      prisma.customer.findMany({
        orderBy: { id: "asc" },
      }),
      prisma.employee.findMany({
        orderBy: { id: "asc" },
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
        orderBy: { partno: "asc" },
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