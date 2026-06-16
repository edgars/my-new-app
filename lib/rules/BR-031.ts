export async function updateParts(partNo: number, qty: number) {
  // TODO(rnc): verify that the part exists before attempting to update quantities and that the quantity adjustment is valid (not causing negative onhand below zero without backorder allowance)
  return await prisma.$transaction(async (tx) => {
    const part = await tx.parts.findUnique({
      where: { partno: partNo }
    });

    if (!part) {
      throw new Error(`Part with partno ${partNo} not found`);
    }

    // Calculate new onhand quantity (adding the qty - assuming positive qty means increase in stock)
    let newOnHand = part.onhand + qty;
    
    // If new onhand would be negative and backorder is not allowed, throw error
    if (newOnHand < 0 && !part.backord) {
      throw new Error(`Cannot reduce part ${partNo} onhand below zero as backordering is not allowed`);
    }

    // If we're reducing inventory below zero, set onhand to 0 and potentially handle backorder logic
    let actualNewOnHand = Math.max(0, newOnHand);
    
    const updatedPart = await tx.parts.update({
      where: { partno: partNo },
      data: {
        onhand: actualNewOnHand,
        ...(newOnHand < 0 && part.backord ? { backord: part.backord + Math.abs(newOnHand) } : {})
      }
    });

    return updatedPart;
  });
}