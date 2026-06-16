async function ordersBeforeCancel(
  orderId: string,
  isInsertState: boolean
): Promise<{ cancelled: boolean; message?: string }> {
  // TODO(rnc): verify that isInsertState correctly reflects the equivalent of Delphi dsInsert state
  // (i.e., the order record is newly created but not yet persisted/committed), and confirm that
  // the caller surfaces the confirmation prompt to the user before invoking this handler —
  // this function assumes the user has already confirmed cancellation when called with confirmed=true.
  // Also verify that cascading delete of line items is the intended behavior and matches DB constraints.

  if (!isInsertState) {
    return { cancelled: false, message: "Order is not in insert state; cancel not applicable." };
  }

  return await prisma.$transaction(async (tx) => {
    const lineItems = await tx.orderItem.findMany({
      where: { orderId },
      select: { id: true },
    });

    const hasLineItems = lineItems.length > 0;

    if (hasLineItems) {
      // The caller must have already presented the confirmation dialog:
      // "Cancel order being inserted and delete all line items?"
      // If the user did not confirm, the caller should not invoke this function.
      // We proceed here assuming confirmation was granted.
      await tx.orderItem.deleteMany({
        where: { orderId },
      });
    }

    await tx.order.delete({
      where: { id: orderId },
    });

    return {
      cancelled: true,
      message: hasLineItems
        ? "Order and all associated line items have been deleted."
        : "Order has been deleted.",
    };
  });
}