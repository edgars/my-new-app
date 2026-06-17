async function itemsAfterDelete(partno: string) {
  // TODO(rnc): verify that UpdateTotals recalculates aggregate totals (e.g. total cost, total list price, total on-hand value) across all Parts records and confirm which summary/totals table or fields are being updated by this procedure

  return await prisma.$transaction(async (tx) => {
    const parts = await tx.parts.findMany({
      select: {
        partno: true,
        onhand: true,
        onorder: true,
        cost: true,
        listprice: true,
        backord: true,
      },
    });

    const totals = parts.reduce(
      (acc, part) => {
        const onhand = part.onhand ?? 0;
        const onorder = part.onorder ?? 0;
        const cost = part.cost ?? 0;
        const listprice = part.listprice ?? 0;
        const backord = part.backord ?? 0;

        acc.totalOnHand += onhand;
        acc.totalOnOrder += onorder;
        acc.totalBackord += backord;
        acc.totalCostValue += onhand * cost;
        acc.totalListValue += onhand * listprice;
        acc.partCount += 1;

        return acc;
      },
      {
        totalOnHand: 0,
        totalOnOrder: 0,
        totalBackord: 0,
        totalCostValue: 0,
        totalListValue: 0,
        partCount: 0,
      }
    );

    const updatedSummary = await tx.partsSummary.upsert({
      where: { id: 1 },
      update: {
        totalOnHand: totals.totalOnHand,
        totalOnOrder: totals.totalOnOrder,
        totalBackord: totals.totalBackord,
        totalCostValue: totals.totalCostValue,
        totalListValue: totals.totalListValue,
        partCount: totals.partCount,
        updatedAt: new Date(),
      },
      create: {
        id: 1,
        totalOnHand: totals.totalOnHand,
        totalOnOrder: totals.totalOnOrder,
        totalBackord: totals.totalBackord,
        totalCostValue: totals.totalCostValue,
        totalListValue: totals.totalListValue,
        partCount: totals.partCount,
        updatedAt: new Date(),
      },
    });

    return updatedSummary;
  });
}