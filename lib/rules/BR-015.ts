async function updateCustomerLastInvoiceDateAfterOrderPost(
  orderId: string,
  prisma: PrismaClient
) {
  // TODO(rnc): verify that the order exists, has a valid customer, and the ship date is after the current last invoice date before updating
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        items: { include: { part: true } }
      }
    });

    if (!order || !order.customer) {
      throw new Error(`Order ${orderId} not found or has no associated customer`);
    }

    const shippedItemsExist = order.items.some(item => 
      item.shipDate && new Date(item.shipDate) > new Date(order.customer.lastInvoiceDate || 0)
    );

    if (shippedItemsExist) {
      await tx.customer.update({
        where: { id: order.customer.id },
        data: {
          lastInvoiceDate: new Date()
        }
      });
    }

    // Apply updates to related parts if needed based on order items
    for (const item of order.items) {
      if (item.partId) {
        await tx.part.update({
          where: { id: item.partId },
          data: {
            onhand: { decrement: item.quantity },
            onorder: item.ordered ? { increment: item.quantity } : undefined
          }
        });
      }
    }

    return order;
  });
}