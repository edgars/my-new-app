export async function deleteOrderWithConfirmation(orderId: string, userId: string) {
  // TODO(rnc): verify that the user has confirmed deletion before calling this function
  return await prisma.$transaction(async (tx) => {
    // First check if order exists and belongs to user context if needed
    const existingOrder = await tx.order.findUnique({
      where: { id: orderId },
      select: { id: true }
    });
    
    if (!existingOrder) {
      throw new Error('Order not found');
    }

    // Delete order line items first
    await tx.orderLineItem.deleteMany({
      where: { orderId: orderId }
    });

    // Then delete the main order
    const deletedOrder = await tx.order.delete({
      where: { id: orderId }
    });

    return deletedOrder;
  });
}