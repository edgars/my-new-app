export async function updateParts(partNo: number, qty: number) {
  // TODO(rnc): verify that the part exists before attempting to update quantities and that the quantity adjustment is valid (not causing negative onhand below zero without backorder allowance)
  return await prisma.$transaction(async (tx) => {
    const part = await tx.parts.findUnique({
      where: { partno: partNo }
    });

    if (!part) {
      throw new Error(`Part with partno ${partNo} not found`);
    }

    // Calculate new onhand quantity (adding the qty - assuming positive qty increases inventory)
    let newOnHand = part.onhand + qty;
    let newBackOrder = part.backord;

    // If we're reducing inventory and there are backorders, handle backorder fulfillment
    if (qty < 0 && part.backord > 0) {
      const availableForBackorders = Math.abs(qty);
      newBackOrder = Math.max(0, part.backord - availableForBackorders);
    } 
    // If adding inventory and have backorders, fulfill as much as possible
    else if (qty > 0 && part.backord > 0) {
      newBackOrder = Math.max(0, part.backord - qty);
    }

    // Prevent negative onhand unless backordering is allowed
    if (newOnHand < 0) {
      newBackOrder = newBackOrder - newOnHand; // Add deficit to backorders
      newOnHand = 0;
    }

    const updatedPart = await tx.parts.update({
      where: { partno: partNo },
      data: {
        onhand: newOnHand,
        backord: newBackOrder
      }
    });

    return updatedPart;
  });
}