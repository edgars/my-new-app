export async function deleteOrderWithConfirmation(orderId: string, confirmed: boolean) {
  // TODO(rnc): verify that the user has confirmed deletion before calling this function
  if (!confirmed) {
    throw new Error('Deletion not confirmed by user');
  }

  return await prisma.$transaction(async (tx) => {
    // Delete order line items first
    await tx.orderLineItem.deleteMany({
      where: { orderId }
    });

    // Then delete the main order
    const deletedOrder = await tx.order.delete({
      where: { id: orderId }
    });

    return deletedOrder;
  });
}