async function ordersBeforeOpen(prisma: PrismaClient) {
  // TODO(rnc): verify that all five datasets (CustByComp, CustByOrd, Cust, Emps, Items/Parts)
  // need to be pre-fetched/initialized together before the Orders view opens, confirm that
  // no filtering or ordering beyond defaults is required, and validate that eager-loading
  // these relations in a single transaction is the correct equivalent of sequentially
  // opening each TDataSet in the original Delphi procedure.

  const result = await prisma.$transaction(async (tx) => {
    const customersByCompany = await tx.customer.findMany({
      orderBy: {
        company: "asc",
      },
    });

    const customersByOrder = await tx.customer.findMany({
      orderBy: {
        orderId: "asc",
      },
      include: {
        orders: true,
      },
    });

    const customers = await tx.customer.findMany();

    const employees = await tx.employee.findMany();

    const parts = await tx.parts.findMany({
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
    });

    return {
      customersByCompany,
      customersByOrder,
      customers,
      employees,
      parts,
    };
  });

  return result;
}