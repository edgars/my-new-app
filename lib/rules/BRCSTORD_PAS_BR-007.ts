async function handleEnterOrdersGrid(prisma: PrismaClient) {
  // TODO(rnc): verify that "activating" the OrdersGrid context means the UI should shift
  // selection highlight to OrdersGrid (dgAlwaysShowSelection added) and remove it from
  // CustGrid (dgAlwaysShowSelection removed), and that MastData.OrdByCustSrc becoming the
  // ActiveSource means the Parts/Orders data should be filtered or sorted by customer —
  // confirm the correct Prisma query/ordering that mirrors OrdByCustSrc behavior.

  const [ordersWithParts, customers] = await prisma.$transaction(async (tx) => {
    const ordersWithParts = await tx.parts.findMany({
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
      orderBy: [
        { vendorno: "asc" },
        { partno: "asc" },
      ],
    });

    const customers = await tx.customer.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return [ordersWithParts, customers];
  });

  return {
    activeSource: "OrdByCustSrc",
    ordersGridOptions: {
      alwaysShowSelection: true,
    },
    custGridOptions: {
      alwaysShowSelection: false,
    },
    parts: ordersWithParts,
    customers,
  };
}