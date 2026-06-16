export async function pickDate(orderId: string, newSaleDate: Date): Promise<{ success: boolean; updatedOrder?: any; error?: string }> {
  // TODO(rnc): verify that the date picker modal validation (BrDateForm.ShowModal = mrOk) is enforced
  // on the client side before calling this handler, and that newSaleDate is a valid, user-confirmed
  // date value equivalent to BrDateForm.Date — this handler assumes mrOk was already returned.

  if (!orderId || !newSaleDate || isNaN(new Date(newSaleDate).getTime())) {
    return { success: false, error: "Invalid orderId or newSaleDate provided." };
  }

  try {
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

    return { success: true, updatedOrder };
  } catch (error: any) {
    return { success: false, error: error.message ?? "An unexpected error occurred while updating the sale date." };
  }
}