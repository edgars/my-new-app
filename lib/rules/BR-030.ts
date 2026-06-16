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
  // confirm if any downstream tables (e.g. vendor summaries, reorder triggers) must be updated,
  // confirm if listprice/cost margin validation or audit logging is required after every save,
  // and confirm the original Delphi DataSet event's full side-effect chain before relying on this implementation.

  const { partno, description, onhand = 0, onorder = 0, vendorno, cost = 0, listprice = 0, backord } = data;

  const computedBackord = onhand < onorder ? onorder - onhand : 0;
  const resolvedBackord = backord !== undefined ? backord : computedBackord;

  return await prisma.$transaction(async (tx) => {
    const existing = await tx.parts.findUnique({
      where: { partno },
    });

    let part;
    if (existing) {
      part = await tx.parts.update({
        where: { partno },
        data: {
          description,
          onhand,
          onorder,
          vendorno,
          cost,
          listprice,
          backord: resolvedBackord,
        },
      });
    } else {
      part = await tx.parts.create({
        data: {
          partno,
          description,
          onhand,
          onorder,
          vendorno,
          cost,
          listprice,
          backord: resolvedBackord,
        },
      });
    }

    if (vendorno) {
      const vendorExists = await tx.vendor.findUnique({
        where: { vendorno },
      });

      if (vendorExists) {
        const vendorParts = await tx.parts.findMany({
          where: { vendorno },
        });

        const totalOnOrder = vendorParts.reduce((sum, p) => sum + (p.onorder ?? 0), 0);
        const totalBackord = vendorParts.reduce((sum, p) => sum + (p.backord ?? 0), 0);

        await tx.vendor.update({
          where: { vendorno },
          data: {
            totalOnOrder,
            totalBackord,
          },
        });
      }
    }

    return part;
  });
}