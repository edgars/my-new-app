export async function pickDate(orderId: string, newSaleDate: Date): Promise<{ success: boolean; updatedOrder: any }> {
  // TODO(rnc): verify that the date picker modal validation (BrDateForm.ShowModal = mrOk) is enforced
  // on the client side before calling this handler, and that newSaleDate is a valid, non-null Date
  // object equivalent to what BrDateForm.Date would have returned; also confirm that the Orders
  // dataset Edit mode semantics (optimistic vs pessimistic locking) are correctly replicated here.

  if (!orderId || !newSaleDate || isNaN(new Date(newSaleDate).getTime())) {
    throw new Error("Invalid orderId or newSaleDate provided.");
  }

  const updatedOrder = await prisma.$transaction(async (tx) => {
    const existingOrder = await tx.orders.findUnique({
      where: { id: orderId },
      select: { id: true, saleDate: true },
    });

    if (!existingOrder) {
      throw new Error(`Order with id ${orderId} not found.`);
    }

    const result = await tx.orders.update({
      where: { id: orderId },
      data: {
        saleDate: new Date(newSaleDate),
      },
    });

    return result;
  });

  return {
    success: true,
    updatedOrder,
  };
}