export async function ordersAfterDeleteHandler(orderId: string) {
  // TODO(rnc): verify that this handler properly handles the cascade logic from order deletion
  // to updating parts inventory and that all related records are properly cleaned up
  return await prisma.$transaction(async (tx) => {
    // Get order items before deleting the order
    const orderItems = await tx.orderItem.findMany({
      where: { orderId },
      include: { part: true }
    });

    // Update parts inventory based on deleted order items
    for (const item of orderItems) {
      if (item.part.onorder >= item.quantity) {
        await tx.part.update({
          where: { partno: item.part.partno },
          data: {
            onorder: { decrement: item.quantity },
            backord: { decrement: item.quantity }
          }
        });
      }
    }

    // Delete the order (this will cascade delete order items due to foreign key constraints)
    await tx.order.delete({
      where: { id: orderId }
    });

    return { success: true, deletedOrderId: orderId };
  });
}