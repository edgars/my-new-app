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
  // TODO(rnc): verify the exact post-save business logic from TMastData.ItemsAfterPost —
  // confirm whether backord should be recalculated as (onorder - onhand) when onhand < onorder,
  // confirm if any audit trail or related table updates are triggered after a Parts record is saved,
  // confirm if vendorno references a Vendors table that needs a corresponding update,
  // and confirm if listprice/cost margin validation or rounding rules apply after post.

  return await prisma.$transaction(async (tx) => {
    const existing = await tx.parts.findUnique({
      where: { partno: data.partno },
    });

    // Recalculate backorder status: backord reflects demand that cannot be fulfilled from onhand
    const onhand = data.onhand ?? existing?.onhand ?? 0;
    const onorder = data.onorder ?? existing?.onorder ?? 0;
    const computedBackord = onhand < 0 ? Math.abs(onhand) : 0;

    const updatedPart = await tx.parts.upsert({
      where: { partno: data.partno },
      create: {
        partno: data.partno,
        description: data.description ?? "",
        onhand: onhand,
        onorder: onorder,
        vendorno: data.vendorno ?? "",
        cost: data.cost ?? 0,
        listprice: data.listprice ?? 0,
        backord: data.backord ?? computedBackord,
      },
      update: {
        ...(data.description !== undefined && { description: data.description }),
        ...(data.onhand !== undefined && { onhand: data.onhand }),
        ...(data.onorder !== undefined && { onorder: data.onorder }),
        ...(data.vendorno !== undefined && { vendorno: data.vendorno }),
        ...(data.cost !== undefined && { cost: data.cost }),
        ...(data.listprice !== undefined && { listprice: data.listprice }),
        backord: data.backord ?? computedBackord,
      },
    });

    // Post-save: if onhand drops below zero, flag the part as backordered
    if (updatedPart.onhand < 0 && updatedPart.backord === 0) {
      await tx.parts.update({
        where: { partno: data.partno },
        data: {
          backord: Math.abs(updatedPart.onhand),
        },
      });
    }

    // Post-save: if onhand is sufficient, clear backorder flag
    if (updatedPart.onhand >= 0 && updatedPart.backord > 0) {
      await tx.parts.update({
        where: { partno: data.partno },
        data: {
          backord: 0,
        },
      });
    }

    return await tx.parts.findUnique({
      where: { partno: data.partno },
    });
  });
}