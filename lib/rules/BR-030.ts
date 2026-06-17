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
  // confirm if any audit trail or related table updates are triggered after a part record is saved,
  // confirm if vendorno references a vendor master that needs a last-updated timestamp,
  // and confirm if listprice/cost margin validation or rounding rules apply after post.

  return await prisma.$transaction(async (tx) => {
    const existing = await tx.parts.findUnique({
      where: { partno: data.partno },
    });

    let backord = data.backord ?? 0;
    const onhand = data.onhand ?? 0;
    const onorder = data.onorder ?? 0;

    // Recalculate backorder quantity: if demand exceeds supply, compute shortage
    if (onorder > onhand) {
      backord = onorder - onhand;
    } else {
      backord = 0;
    }

    const part = existing
      ? await tx.parts.update({
          where: { partno: data.partno },
          data: {
            description: data.description,
            onhand: onhand,
            onorder: onorder,
            vendorno: data.vendorno,
            cost: data.cost,
            listprice: data.listprice,
            backord: backord,
          },
        })
      : await tx.parts.create({
          data: {
            partno: data.partno,
            description: data.description,
            onhand: onhand,
            onorder: onorder,
            vendorno: data.vendorno,
            cost: data.cost,
            listprice: data.listprice,
            backord: backord,
          },
        });

    // If vendor is referenced, update vendor's last activity timestamp
    if (data.vendorno) {
      await tx.vendor.updateMany({
        where: { vendorno: data.vendorno },
        data: {
          lastActivityDate: new Date(),
        },
      });
    }

    return part;
  });
}