async function ordersBeforeCancel(
  orderId: string,
  isInsertState: boolean,
  userConfirmed: boolean
): Promise<{ cancelled: boolean; message?: string }> {
  // TODO(rnc): verify that isInsertState correctly maps to the original dsInsert state check,
  // that userConfirmed reflects the user's response to the confirmation dialog on the client,
  // and that cascading delete of line items matches the original Delphi behavior for all related items.

  if (!isInsertState) {
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
      requiresConfirmation: true,
    } as { cancelled: boolean; message?: string };
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