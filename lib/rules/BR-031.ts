export async function updateParts(partNo: number, qty: number) {
  // TODO(rnc): verify that the part exists before attempting to update quantities and that the quantity adjustment is valid (not causing negative onhand values without proper backorder handling)
  return await prisma.$transaction(async (tx) => {
    const part = await tx.parts.findUnique({
      where: { partno: partNo }
    });

    if (!part) {
      throw new Error(`Part with partno ${partNo} not found`);
    }

    const newOnHand = part.onhand + qty;
    
    // If we're reducing inventory below zero, check if backordering is allowed
    if (newOnHand < 0 && !part.backord) {
      throw new Error(`Insufficient inventory for part ${partNo}. Current onhand: ${part.onhand}, requested change: ${qty}`);
    }

    const updatedPart = await tx.parts.update({
      where: { partno: partNo },
      data: {
        onhand: newOnHand,
        onorder: qty > 0 ? part.onorder : part.onorder // Only adjust onorder if needed based on business logic
      }
    });

    return updatedPart;
  });
}