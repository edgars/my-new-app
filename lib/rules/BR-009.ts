export async function updateOrderSaleDate(
  orderId: string,
  newSaleDate: Date
) {
  // TODO(rnc): verify that the order exists and is editable before updating the sale date
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId }
    });
    
    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }
    
    return await tx.order.update({
      where: { id: orderId },
      data: { 
        saleDate: newSaleDate 
      }
    });
  });
}