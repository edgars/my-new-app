async function ordersBeforeCancel(
  orderId: string,
  isInserting: boolean,
  userConfirmed: boolean
): Promise<{ cancelled: boolean; message?: string }> {
  // TODO(rnc): verify that isInserting correctly reflects the order being in an unsaved/insert state
  // (equivalent to Delphi dsInsert), and that userConfirmed maps to the Confirm() dialog result;
  // also confirm that cascading delete of line items is the intended behavior and aligns with
  // any referential integrity constraints on the Items/OrderLines table.

  if (!isInserting) {
    return { cancelled: true };
  }

  const lineItems = await prisma.orderItem.findMany({
    where: { orderId },
    select: { id: true },
    take: 1,
  });

  const hasLineItems = lineItems.length > 0;

  if (!hasLineItems) {
    return { cancelled: true };
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