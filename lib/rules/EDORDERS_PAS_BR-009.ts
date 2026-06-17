async function handlePickDate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that the incoming date value is validated on the client before submission,
  // that OrdersSaleDate maps correctly to the saleDate field on the Nextcust/Order model,
  // and that the user has permission to edit the target order record before updating it.

  const { orderId, selectedDate } = req.body;

  if (!orderId || !selectedDate) {
    return res.status(400).json({ error: "orderId and selectedDate are required" });
  }

  const parsedDate = new Date(selectedDate);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: "selectedDate is not a valid date" });
  }

  try {
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.nextcust.findUnique({
        where: { id: orderId },
        select: { id: true, newcust: true, saleDate: true },
      });

      if (!existingOrder) {
        throw new Error(`Order with id ${orderId} not found`);
      }

      const order = await tx.nextcust.update({
        where: { id: orderId },
        data: {
          saleDate: parsedDate,
        },
      });

      return order;
    });

    return res.status(200).json({ success: true, order: updatedOrder });
  } catch (error: any) {
    if (error.message?.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Failed to update sale date" });
  }
}