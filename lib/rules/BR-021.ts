async function handleDeleteOrder(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that the client sends an explicit confirmation flag before deletion proceeds,
  // and confirm that cascading deletion of line items is the intended behavior for all order types
  // (including backorders). Also verify that onhand/onorder quantities on Parts should be adjusted
  // when an order and its line items are deleted.

  const { orderId, confirmed } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "orderId is required" });
  }

  if (!confirmed) {
    return res.status(200).json({
      requiresConfirmation: true,
      message: "Delete order and line items?",
    });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { lineItems: true },
      });

      if (!order) {
        throw new Error(`Order with id ${orderId} not found`);
      }

      const partUpdates = order.lineItems.map((item) =>
        tx.parts.updateMany({
          where: { partno: item.partno },
          data: {
            onorder: {
              decrement: item.quantity,
            },
            backord: {
              decrement: item.backorderedQuantity ?? 0,
            },
          },
        })
      );

      await Promise.all(partUpdates);

      await tx.lineItem.deleteMany({
        where: { orderId: orderId },
      });

      const deletedOrder = await tx.order.delete({
        where: { id: orderId },
      });

      return deletedOrder;
    });

    return res.status(200).json({
      success: true,
      deletedOrder: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Failed to delete order and line items" });
  }
}