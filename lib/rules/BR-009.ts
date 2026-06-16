export async function pickDate(orderId: string, newSaleDate: Date): Promise<{ success: boolean; updatedOrder?: any; error?: string }> {
  // TODO(rnc): verify that the date picker dialog logic (BrDateForm.ShowModal = mrOk) is handled
  // client-side before calling this handler — this function assumes the user has already confirmed
  // a valid date selection and that newSaleDate is a legitimate, validated Date object.
  // Also verify that the orderId corresponds to an existing Orders record and that the
  // calling user has permission to edit it. Confirm that SaleDateEdit.SelectAll UI behavior
  // is replicated appropriately on the client after a successful response.

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

      const order = await tx.orders.update({
        where: { id: orderId },
        data: {
          saleDate: new Date(newSaleDate),
        },
      });

      return order;
    });

    return { success: true, updatedOrder };
  } catch (error: any) {
    return { success: false, error: error.message ?? "An unexpected error occurred while updating the sale date." };
  }
}