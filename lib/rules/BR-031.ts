async function updateParts(partNo: number, qty: number) {
  // TODO(rnc): verify that backord field should be decremented when onhand is sufficient,
  // confirm the exact business logic for backorder fulfillment vs onorder replenishment,
  // and validate whether onorder should be decremented when stock arrives to fill the order.

  return await prisma.$transaction(async (tx) => {
    const part = await tx.parts.findUnique({
      where: { partno: partNo },
    });

    if (!part) {
      throw new Error(`Part with partno ${partNo} not found`);
    }

    const newOnHand = part.onhand + qty;

    if (newOnHand >= 0) {
      // Sufficient stock: fulfill any backorders if possible
      const backordFulfilled = Math.min(part.backord ?? 0, newOnHand);
      const remainingOnHand = newOnHand - backordFulfilled;
      const remainingBackord = (part.backord ?? 0) - backordFulfilled;

      const updatedPart = await tx.parts.update({
        where: { partno: partNo },
        data: {
          onhand: remainingOnHand,
          backord: remainingBackord,
        },
      });

      return updatedPart;
    } else {
      // Insufficient stock: increase backorder quantity
      const shortfall = Math.abs(newOnHand);

      const updatedPart = await tx.parts.update({
        where: { partno: partNo },
        data: {
          onhand: 0,
          backord: (part.backord ?? 0) + shortfall,
          onorder: (part.onorder ?? 0) + shortfall,
        },
      });

      return updatedPart;
    }
  });
}