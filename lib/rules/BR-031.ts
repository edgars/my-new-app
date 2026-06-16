export async function updateParts(partNo: number, qty: number) {
  // TODO(rnc): verify that the part exists before attempting to update quantities and that the quantity adjustment is valid (not causing negative onhand below zero without backorder flag)
  
  return await prisma.$transaction(async (tx) => {
    const part = await tx.parts.findUnique({
      where: { partno: partNo }
    });

    if (!part) {
      throw new Error(`Part with partno ${partNo} not found`);
    }

    // Calculate new onhand quantity
    const newOnHand = part.onhand + qty;
    
    // If reducing inventory below zero, check if backorder is allowed
    if (newOnHand < 0 && !part.backord) {
      throw new Error(`Cannot reduce part ${partNo} inventory below zero without backorder permission`);
    }

    const updatedPart = await tx.parts.update({
      where: { partno: partNo },
      data: {
        onhand: newOnHand,
        // If we're ordering more items, update onorder field accordingly
        // This assumes positive qty means adding to inventory (could be from purchase/receipt)
        // Negative qty would mean shipping/delivering items
        ...(qty < 0 && Math.abs(qty) <= part.onorder ? { 
          onorder: part.onorder + qty 
        } : {}),
      }
    });

    return updatedPart;
  });
}