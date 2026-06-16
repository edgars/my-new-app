async function updateParts(partNo: number, qty: number) {
  // TODO(rnc): verify that backord field should be decremented when onhand becomes sufficient,
  // verify the exact business logic for onorder adjustment when filling backorders,
  // verify whether partial backorder fulfillment is allowed or only full fills,
  // and confirm that negative onhand values should be prevented or allowed.

  return await prisma.$transaction(async (tx) => {
    const part = await tx.parts.findUnique({
      where: { partno: partNo },
    });

    if (!part) {
      throw new Error(`Part with partno ${partNo} not found`);
    }

    let newOnHand = part.onhand + qty;
    let newOnOrder = part.onorder;
    let newBackOrd = part.backord;

    // If there are backordered quantities, attempt to fulfill them first
    if (newBackOrd > 0 && newOnHand > 0) {
      if (newOnHand >= newBackOrd) {
        // Enough stock to fulfill all backorders
        newOnHand = newOnHand - newBackOrd;
        newBackOrd = 0;
      } else {
        // Partial fulfillment of backorders
        newBackOrd = newBackOrd - newOnHand;
        newOnHand = 0;
      }
    }

    // Reduce onorder by the quantity received, but not below zero
    if (newOnOrder > 0) {
      newOnOrder = Math.max(0, newOnOrder - qty);
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