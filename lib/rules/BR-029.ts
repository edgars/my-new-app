async function itemsAfterDelete(partId: string) {
  // TODO(rnc): verify that UpdateTotals functionality is correctly implemented 
  // to recalculate inventory totals after part deletion
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
  // Recalculate inventory totals
  const totalOnHand = await tx.part.aggregate({
    _sum: { onhand: true }
  });
  
  const totalOnOrder = await tx.part.aggregate({
    _sum: { onorder: true }
  });
  
  const totalBackOrder = await tx.part.aggregate({
    _sum: { backord: true }
  });
  
  // Store totals in a summary table or update relevant records
  await tx.inventorySummary.upsert({
    where: { id: 'inventory-totals' },
    update: {
      totalOnHand: totalOnHand._sum.onhand || 0,
      totalOnOrder: totalOnOrder._sum.onorder || 0,
      totalBackOrder: totalBackOrder._sum.backord || 0
    },
    create: {
      id: 'inventory-totals',
      totalOnHand: totalOnHand._sum.onhand || 0,
      totalOnOrder: totalOnOrder._sum.onorder || 0,
      totalBackOrder: totalBackOrder._sum.backord || 0
    }
  });
}