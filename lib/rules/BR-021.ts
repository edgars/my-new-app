async function handleDeleteOrder(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that the client sends an explicit confirmation flag before this handler is invoked,
  // matching the original Confirm('Delete order and line items?') dialog; also verify that DeleteItems
  // cascades correctly to all associated line items (Parts references) and that no additional
  // referential constraints exist beyond what Prisma cascade handles.

  const { orderId, confirmed } = req.body as { orderId: string; confirmed: boolean };

  if (!confirmed) {
    return res.status(400).json({
      error: "Deletion not confirmed. You must confirm deletion of the order and all line items.",
    });
  }

  if (!orderId) {
    return res.status(400).json({ error: "orderId is required." });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Delete all line items (Parts records) associated with this order first
      await tx.parts.deleteMany({
        where: { orderId },
      });

      // Delete the order itself
      await tx.order.delete({
        where: { id: orderId },
      });
    });

    return res.status(200).json({ message: "Order and all associated line items deleted successfully." });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Order not found." });
    }
    console.error("Error deleting order and line items:", error);
    return res.status(500).json({ error: "An unexpected error occurred while deleting the order." });
  }
}