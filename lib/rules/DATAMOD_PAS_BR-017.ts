async function handleOrdersBeforeCancel(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that cancellation of an in-progress insert truly deletes all associated line items,
  // and confirm the user-facing prompt text matches business expectations before allowing destructive action.

  const { newcust, orderId, confirmed } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "orderId is required" });
  }

  const order = await prisma.nextcust.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const isInsertState = order.newcust === true;
  const hasLineItems = order.items && order.items.length > 0;

  if (isInsertState && hasLineItems) {
    if (!confirmed) {
      return res.status(200).json({
        requiresConfirmation: true,
        message: "Cancel order being inserted and delete all line items?",
      });
    }

    if (confirmed === false) {
      return res.status(200).json({
        aborted: true,
        message: "Cancel operation aborted by user",
      });
    }

    try {
      await prisma.$transaction(async (tx) => {
        await tx.item.deleteMany({
          where: { orderId: orderId },
        });

        await tx.nextcust.delete({
          where: { id: orderId },
        });
      });

      return res.status(200).json({
        success: true,
        message: "Order and all line items have been cancelled and deleted",
      });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to cancel order and delete line items",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (isInsertState && !hasLineItems) {
    try {
      await prisma.nextcust.delete({
        where: { id: orderId },
      });

      return res.status(200).json({
        success: true,
        message: "Order cancelled and deleted (no line items present)",
      });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to cancel order",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return res.status(200).json({
    success: true,
    message: "No cancellation action required; order is not in insert state",
  });
}