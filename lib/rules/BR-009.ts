export async function updateOrderSaleDate(
  orderId: string,
  newSaleDate: Date
) {
  // TODO(rnc): verify that the order exists and user has permission to edit it before updating
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: { id: true }
    });

    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { saleDate: newSaleDate }
    });

    return updatedOrder;
  });
}