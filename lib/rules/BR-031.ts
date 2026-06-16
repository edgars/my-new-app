async function updateParts(partNo: number, qty: number) {
  // TODO(rnc): verify the exact business logic for UpdateParts — confirm whether qty represents
  // units received (reducing backord, increasing onhand), units ordered (increasing onorder),
  // or a general adjustment; confirm rounding/precision rules for partno as Double mapped to
  // Prisma Float/Decimal; confirm whether backord should be decremented when onhand increases
  // and whether onorder should be decremented when stock is received; confirm negative qty handling.

  return await prisma.$transaction(async (tx) => {
    const part = await tx.parts.findFirst({
      where: {
        partno: partNo,
      },
    });

    if (!part) {
      throw new Error(`Part with partno ${partNo} not found`);
    }

    const currentOnHand = part.onhand ?? 0;
    const currentOnOrder = part.onorder ?? 0;
    const currentBackOrd = part.backord ?? 0;

    // Receiving qty units into stock:
    // - increase onhand by qty
    // - decrease onorder by qty (clamped to 0)
    // - decrease backord by qty (clamped to 0)
    const newOnHand = currentOnHand + qty;
    const newOnOrder = Math.max(0, currentOnOrder - qty);
    const newBackOrd = Math.max(0, currentBackOrd - qty);

    const updatedPart = await tx.parts.update({
      where: {
        partno: partNo,
      },
      data: {
        onhand: newOnHand,
        onorder: newOnOrder,
        backord: newBackOrd,
      },
    });

    return updatedPart;
  });
}