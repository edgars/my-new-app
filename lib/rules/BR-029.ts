async function itemsAfterDelete(partno: string) {
  // TODO(rnc): verify that UpdateTotals recalculates aggregate totals (e.g. total cost, total list price, total on-hand value) across all Parts records, and confirm which totals table/fields are being updated and whether any filtering (e.g. by vendor) is required

  return await prisma.$transaction(async (tx) => {
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

    const totalOnHand = parts.reduce((sum, p) => sum + (p.onhand ?? 0), 0);
    const totalOnOrder = parts.reduce((sum, p) => sum + (p.onorder ?? 0), 0);
    const totalBackord = parts.reduce((sum, p) => sum + (p.backord ?? 0), 0);
    const totalCostValue = parts.reduce(
      (sum, p) => sum + (p.onhand ?? 0) * (p.cost ?? 0),
      0
    );
    const totalListValue = parts.reduce(
      (sum, p) => sum + (p.onhand ?? 0) * (p.listprice ?? 0),
      0
    );
    const partCount = parts.length;

    const updatedTotals = await tx.partsTotals.upsert({
      where: { id: 1 },
      update: {
        totalOnHand,
        totalOnOrder,
        totalBackord,
        totalCostValue,
        totalListValue,
        partCount,
        updatedAt: new Date(),
      },
      create: {
        id: 1,
        totalOnHand,
        totalOnOrder,
        totalBackord,
        totalCostValue,
        totalListValue,
        partCount,
        updatedAt: new Date(),
      },
    });

    return updatedTotals;
  });
}