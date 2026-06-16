async function ordersBeforeInsert(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that any in-progress order for the current session/user is detected
  // correctly via the activeOrderId mechanism, that "posting" an order means finalizing/
  // submitting it in the business sense (status transition), and that FItemNo := 1 maps
  // to resetting a line-item sequence counter on the order record or in session state.

  const { activeOrderId, confirmSave } = req.body as {
    activeOrderId?: string;
    confirmSave?: boolean;
  };

  // If there is an order currently being edited/processed, we must resolve it first
  if (activeOrderId) {
    // The client must have confirmed whether to save or abort (mirrors the Confirm() dialog)
    if (confirmSave === undefined) {
      // Signal the client that a confirmation is required before proceeding
      return res.status(409).json({
        requiresConfirmation: true,
        message:
          "An order is being processed. Save changes and start a new one?",
        activeOrderId,
      });
    }

    if (!confirmSave) {
      // User chose not to save — abort the insert (mirrors Abort in Delphi)
      return res.status(400).json({
        error: "Insert aborted. The in-progress order was not saved.",
      });
    }

    // User confirmed — post (finalize) the existing order before starting a new one
    await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.orders.findUnique({
        where: { id: activeOrderId },
      });

      if (!existingOrder) {
        throw new Error(`Active order ${activeOrderId} not found.`);
      }

      // Post the in-progress order (mark it as submitted/finalized)
      await tx.orders.update({
        where: { id: activeOrderId },
        data: {
          status: "POSTED",
          postedAt: new Date(),
        },
      });
    });
  }

  // FItemNo := 1 — initialize the line-item sequence counter for the new order
  // This is stored on the new order record so subsequent item inserts can increment it
  const newOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.orders.create({
      data: {
        status: "IN_PROGRESS",
        itemNo: 1, // mirrors FItemNo := 1
        createdAt: new Date(),
      },
    });

    return order;
  });

  return res.status(201).json({
    message: "New order initialized successfully.",
    orderId: newOrder.id,
    itemNo: newOrder.itemNo,
  });
}