async function ordersBeforeInsert(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that the client sends a flag indicating whether an in-progress order exists
  // and that the user has explicitly confirmed saving it before starting a new one;
  // also verify that FItemNo reset to 1 is handled per-session/per-order on the client or session store.

  const { confirmedSaveExisting, existingOrderId } = req.body as {
    confirmedSaveExisting?: boolean;
    existingOrderId?: string;
  };

  // If there is an order currently being edited, the client must confirm saving it first.
  if (existingOrderId) {
    if (!confirmedSaveExisting) {
      return res.status(409).json({
        code: "ORDER_IN_PROGRESS",
        message:
          "An order is being processed. Save changes and start a new one?",
      });
    }

    // User confirmed — post (finalize) the existing order before inserting a new one.
    await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { id: existingOrderId },
      });

      if (!existingOrder) {
        throw new Error(`Order ${existingOrderId} not found.`);
      }

      // Mark the existing order as posted/finalized.
      await tx.order.update({
        where: { id: existingOrderId },
        data: {
          status: "POSTED",
          updatedAt: new Date(),
        },
      });

      // Create the new order with itemNo reset to 1.
      const newOrder = await tx.order.create({
        data: {
          itemNo: 1,
          status: "DRAFT",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return newOrder;
    }).then((newOrder) => {
      return res.status(201).json({
        message: "Existing order saved. New order created.",
        newOrderId: newOrder.id,
        itemNo: newOrder.itemNo,
      });
    });

    return;
  }

  // No existing in-progress order — simply initialize a new order with itemNo = 1.
  const newOrder = await prisma.order.create({
    data: {
      itemNo: 1,
      status: "DRAFT",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return res.status(201).json({
    message: "New order created.",
    newOrderId: newOrder.id,
    itemNo: newOrder.itemNo,
  });
}