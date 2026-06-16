async function itemsAfterDelete(partId: string) {
  // TODO(rnc): verify that UpdateTotals functionality is properly implemented to recalculate inventory totals after part deletion
  return await prisma.$transaction(async (tx) => {
    const deletedPart = await tx.part.delete({
      where: { id: partId }
    });
    
    // Trigger totals update after deletion
    await updateTotals(tx);
    
    return deletedPart;
  });
}

async function updateTotals(tx: any) {
  // Recalculate total inventory values
  const totals = await tx.part.aggregate({
    _sum: {
      onhand: true,
      onorder: true,
      cost: true,
      listprice: true
    }
  });
  
  // Store totals in system settings or totals table as needed
  await tx.systemSetting.upsert({
    where: { key: 'inventory_totals' },
    update: {
      value: JSON.stringify({
        totalOnHand: totals._sum.onhand || 0,
        totalOnOrder: totals._sum.onorder || 0,
        totalCost: totals._sum.cost || 0,
        totalListPrice: totals._sum.listprice || 0
      })
    },
    create: {
      key: 'inventory_totals',
      value: JSON.stringify({
        totalOnHand: totals._sum.onhand || 0,
        totalOnOrder: totals._sum.onorder || 0,
        totalCost: totals._sum.cost || 0,
        totalListPrice: totals._sum.listprice || 0
      })
    }
  });
}