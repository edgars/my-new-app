async function ordersBeforeCancel(
  orderId: string,
  isInserting: boolean,
  userConfirmed: boolean
): Promise<{ cancelled: boolean; message?: string }> {
  // TODO(rnc): verify that isInserting correctly reflects the order being in an unsaved/insert state
  // (equivalent to Delphi dsInsert), and that userConfirmed maps to the Confirm() dialog result;
  // also confirm that "line items" corresponds to the correct related model (e.g. OrderItem) in the schema.

  if (!isInserting) {
    return { cancelled: false };
  }

  const lineItemCount = await prisma.orderItem.count({
    where: { orderId },
  });

  const hasLineItems = lineItemCount > 0;

  if (!hasLineItems) {
    return { cancelled: false };
  }

  if (!userConfirmed) {
    return {
      cancelled: false,
      message: "Cancel order being inserted and delete all line items?",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.orderItem.deleteMany({
      where: { orderId },
    });

    await tx.order.delete({
      where: { id: orderId },
    });
  });

  return { cancelled: true };
}