async function updateParts(partNo: number, qty: number) {
  // TODO(rnc): verify that backord field should be decremented when onhand becomes sufficient to cover it,
  // verify the exact business logic for onorder adjustment vs onhand increment,
  // verify whether qty can be negative (returns/adjustments) and if so what the expected behavior is,
  // verify whether backord should be zeroed or decremented by the fulfilled amount,
  // verify if onorder should be decremented when parts arrive (qty positive means receiving inventory)

  return await prisma.$transaction(async (tx) => {
    const part = await tx.parts.findUnique({
      where: { partno: partNo },
    });

    if (!part) {
      throw new Error(`Part not found: ${partNo}`);
    }

    const newOnHand = part.onhand + qty;
    let newOnOrder = part.onorder;
    let newBackOrd = part.backord;

    if (qty > 0) {
      // Receiving inventory — reduce onorder by the quantity received
      newOnOrder = Math.max(0, part.onorder - qty);

      // If we now have enough on hand to cover backorders, fulfill them
      if (newBackOrd > 0 && newOnHand >= newBackOrd) {
        newBackOrd = 0;
      } else if (newBackOrd > 0 && newOnHand > 0) {
        newBackOrd = Math.max(0, newBackOrd - newOnHand);
      }
    } else if (qty < 0) {
      // Consuming/selling inventory — if onhand goes negative, record backorder
      if (newOnHand < 0) {
        newBackOrd = part.backord + Math.abs(newOnHand);
      }
    }

    const updatedPart = await tx.parts.update({
      where: { partno: partNo },
      data: {
        onhand: newOnHand,
        onorder: newOnOrder,
        backord: newBackOrd,
      },
    });

    return updatedPart;
  });
}