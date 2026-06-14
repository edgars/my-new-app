async function updateOrderCalculatedFields(orderId: string) {
  // TODO(rnc): verify that the order exists and has valid numeric values for itemsTotal, taxRate, freight, and amountPaid before calculation
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: { itemsTotal: true, taxRate: true, freight: true, amountPaid: true }
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    const taxTotal = order.itemsTotal * (order.taxRate / 100);
    const amountDue = order.itemsTotal + taxTotal + order.freight - order.amountPaid;

    return await tx.order.update({
      where: { id: orderId },
      data: {
        taxTotal: taxTotal,
        amountDue: amountDue
      }
    });
  });
}