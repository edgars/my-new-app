async function handleDeleteOrder(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that the client sends an explicit confirmation flag before deletion proceeds,
  // and confirm that cascading deletion of line items is the intended behavior for all order types
  // (including backorders). Also verify that onhand/onorder quantities on Parts should be adjusted
  // when associated order line items are deleted.

  const { orderId, confirmed } = req.body;

  if (!confirmed) {
    return res.status(400).json({
      error: "Deletion requires explicit confirmation. Set confirmed: true to proceed.",
    });
  }

  if (!orderId) {
    return res.status(400).json({ error: "orderId is required." });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Fetch the order and its line items before deletion so we can adjust Part quantities
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { lineItems: true },
      });

      if (!order) {
        throw new Error(`Order with id ${orderId} not found.`);
      }

      // Adjust onorder quantity on each Part referenced by the line items being deleted
      for (const lineItem of order.lineItems) {
        await tx.parts.update({
          where: { partno: lineItem.partno },
          data: {
            onorder: {
              decrement: lineItem.quantity,
            },
            // If the line item was on backorder, clear or decrement backord as well
            backord: {
              decrement: lineItem.backordered ?? 0,
            },
          },
        });
      }

      // Delete all line items belonging to the order
      await tx.orderLineItem.deleteMany({
        where: { orderId },
      });

      // Delete the order itself
      const deletedOrder = await tx.order.delete({
        where: { id: orderId },
      });

      return deletedOrder;
    });

    return res.status(200).json({
      message: "Order and all associated line items deleted successfully.",
      deletedOrder: result,
    });
  } catch (error: any) {
    if (error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }
    console.error("Error deleting order:", error);
    return res.status(500).json({ error: "Internal server error while deleting order." });
  }
}