export async function deleteOrderWithConfirmation(orderId: string, userId: string) {
  // TODO(rnc): verify that the user has confirmed deletion before calling this function
  return await prisma.$transaction(async (tx) => {
    // First delete all related order line items
    await tx.orderLine.deleteMany({
      where: { orderId }
    });

    // Then delete the main order record
    const deletedOrder = await tx.order.delete({
      where: { id: orderId },
      select: { id: true, orderNo: true }
    });

    return deletedOrder;
  });
}