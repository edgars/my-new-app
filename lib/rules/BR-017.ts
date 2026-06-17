async function ordersBeforeCancel(
  orderId: string,
  isInsertState: boolean,
  userConfirmed: boolean,
  tx?: Prisma.TransactionClient
): Promise<void> {
  // TODO(rnc): verify that isInsertState correctly reflects the order being in a new/unsaved insert state
  // (equivalent to Delphi dsInsert), and that userConfirmed maps to the Confirm() dialog result;
  // also confirm that "line items" maps to the correct related model (e.g. OrderItem) linked by orderId.

  if (!isInsertState) {
    return;
  }

  const prismaClient = tx ?? prisma;

  const lineItemCount = await prismaClient.orderItem.count({
    where: { orderId },
  });

  const hasLineItems = lineItemCount > 0;

  if (!hasLineItems) {
    return;
  }

  if (!userConfirmed) {
    throw new Error(
      "ABORT: User declined to cancel order and delete all line items."
    );
  }

  await (tx
    ? performCancelWithDelete(orderId, tx)
    : prisma.$transaction(async (transaction) => {
        await performCancelWithDelete(orderId, transaction);
      }));
}

async function performCancelWithDelete(
  orderId: string,
  tx: Prisma.TransactionClient
): Promise<void> {
  // TODO(rnc): verify cascade behavior — confirm whether DB already handles cascade deletes
  // on OrderItem when an Order is deleted, or if explicit deletion here is required.

  await tx.orderItem.deleteMany({
    where: { orderId },
  });

  await tx.order.delete({
    where: { id: orderId },
  });
}