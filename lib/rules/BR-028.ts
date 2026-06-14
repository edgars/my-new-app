export async function createNewOrder() {
  // TODO(rnc): verify that the order number sequence is properly incremented and that all default values are correctly set
  return await prisma.$transaction(async (tx) => {
    const nextOrd = await tx.nextOrd.findFirstOrThrow();
    
    const updatedNextOrd = await tx.nextOrd.update({
      where: { id: nextOrd.id },
      data: { 
        newKey: nextOrd.newKey + 1 
      }
    });

    const newOrder = await tx.order.create({
      data: {
        orderNo: updatedNextOrd.newKey,
        saleDate: new Date(),
        shipVia: 'UPS',
        terms: 'net 30',
        paymentMethod: 'Check',
        itemsTotal: 0,
        taxRate: 0,
        freight: 0,
        amountPaid: 0
      }
    });

    return newOrder;
  });
}