export async function createNewOrder() {
  // TODO(rnc): verify that the order number sequence is properly incremented and all default values are set correctly
  return await prisma.$transaction(async (tx) => {
    const nextOrd = await tx.nextOrd.findFirstOrThrow();
    const newOrderNo = nextOrd.newKey;
    
    await tx.nextOrd.update({
      where: { id: nextOrd.id },
      data: { newKey: nextOrd.newKey + 1 }
    });

    const newOrder = await tx.order.create({
      data: {
        orderNo: newOrderNo,
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