async function itemsAfterPost(data: {
  partno: string;
  description?: string;
  onhand?: number;
  onorder?: number;
  vendorno?: string;
  cost?: number;
  listprice?: number;
  backord?: number;
}) {
  // TODO(rnc): verify the exact post-save business logic that TMastData.ItemsAfterPost enforced —
  // e.g. recalculating derived fields, updating related records, triggering reorder logic,
  // syncing backorder status when onhand/onorder change, or notifying downstream systems.
  // Confirm whether backord should be auto-set when onhand <= 0, and whether onorder
  // should be decremented or adjusted as part of this procedure.

  return await prisma.$transaction(async (tx) => {
    const existing = await tx.parts.findUnique({
      where: { partno: data.partno },
    });

    if (!existing) {
      throw new Error(`Part ${data.partno} not found`);
    }

    const onhand = data.onhand ?? existing.onhand ?? 0;
    const onorder = data.onorder ?? existing.onorder ?? 0;

    // Derive backorder status: if onhand is zero or negative and there is demand,
    // mark as backordered — adjust this logic once the original procedure is confirmed.
    const backord =
      data.backord !== undefined
        ? data.backord
        : onhand <= 0
        ? 1
        : existing.backord ?? 0;

    const updatedPart = await tx.parts.update({
      where: { partno: data.partno },
      data: {
        ...(data.description !== undefined && { description: data.description }),
        onhand,
        onorder,
        ...(data.vendorno !== undefined && { vendorno: data.vendorno }),
        ...(data.cost !== undefined && { cost: data.cost }),
        ...(data.listprice !== undefined && { listprice: data.listprice }),
        backord,
      },
    });

    // If the part is now backordered, ensure any related vendor/order records
    // are updated accordingly — confirm exact downstream tables with original source.
    if (backord > 0 && updatedPart.vendorno) {
      await tx.parts.updateMany({
        where: {
          vendorno: updatedPart.vendorno,
          partno: { not: updatedPart.partno },
        },
        data: {},
        // TODO(rnc): confirm if sibling parts or vendor records need updating here
      });
    }

    return updatedPart;
  });
}