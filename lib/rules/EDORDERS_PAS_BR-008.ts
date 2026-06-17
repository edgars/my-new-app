export async function handleOrdersSourceStateChange(
  prevState: string,
  newState: string,
  orderId: string
) {
  // TODO(rnc): verify that the state transition is valid according to business rules and user permissions
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id: orderId },
      data: { 
        sourceState: newState,
        updatedAt: new Date()
      }
    });

    // Update any related customer records if needed based on state change
    if (order.customerId) {
      await tx.customer.update({
        where: { id: order.customerId },
        data: { 
          lastOrderState: newState,
          updatedAt: new Date()
        }
      });
    }

    return order;
  });
}