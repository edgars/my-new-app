async function updateParts(partNo: number, qty: number) {
  // TODO(rnc): verify that backord field should be decremented (not zeroed) when onhand is fulfilled,
  // confirm whether onorder should be decremented when stock arrives vs when order is placed,
  // and validate the exact business logic for partial fulfillment of backorders.

  return await prisma.$transaction(async (tx) => {
    const part = await tx.parts.findUnique({
      where: { partno: partNo },
    });

    if (!part) {
      throw new Error(`Part with partno ${partNo} not found`);
    }

    const newOnHand = part.onhand + qty;
    let newBackord = part.backord;
    let newOnOrder = part.onorder;

    if (qty > 0) {
      // Stock arriving: fulfill backorders first
      if (part.backord > 0) {
        const fulfilled = Math.min(part.backord, newOnHand);
        newBackord = Math.max(0, part.backord - fulfilled);
      }
      // Reduce onorder since stock has arrived
      newOnOrder = Math.max(0, part.onorder - qty);
    } else if (qty < 0) {
      // Stock being consumed: check if we go negative (backorder situation)
      if (newOnHand < 0) {
        newBackord = part.backord + Math.abs(newOnHand);
      }
    }

    const updatedPart = await tx.parts.update({
      where: { partno: partNo },
      data: {
        onhand: Math.max(0, newOnHand),
        onorder: newOnOrder,
        backord: newBackord,
      },
    });

    return updatedPart;
  });
}