async function itemsAfterDelete(partId: string) {
  // TODO(rnc): verify that UpdateTotals functionality is properly implemented to recalculate inventory totals after part deletion
  return await prisma.$transaction(async (tx) => {
    // Delete the part record
    await tx.part.delete({
      where: { id: partId }
    });

    // Recalculate totals - this would typically involve updating summary records
    // or recalculating aggregated values across remaining parts
    await tx.$executeRaw`
      UPDATE inventory_summary 
      SET total_parts = (SELECT COUNT(*) FROM parts),
          total_onhand = (SELECT COALESCE(SUM(onhand), 0) FROM parts),
          total_onorder = (SELECT COALESCE(SUM(onorder), 0) FROM parts),
          total_value = (SELECT COALESCE(SUM(onhand * cost), 0) FROM parts)
      WHERE id = 1
    `;
  });
}