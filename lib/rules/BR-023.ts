async function ordersBeforeInsert(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that any in-progress order for the current session/user is detected
  // correctly via the activeOrderId mechanism, that "posting" an order means finalizing/
  // submitting it in the business sense (status transition), and that FItemNo := 1 maps
  // to resetting a line-item sequence counter on the order record or a session variable.

  const { activeOrderId, confirmSave } = req.body as {
    activeOrderId?: string;
    confirmSave?: boolean;
  };

  // If there is an order currently being edited/processed, we must resolve it first.
  if (activeOrderId) {
    // The client must present a confirmation dialog equivalent to:
    // "An order is being processed. Save changes and start a new one?"
    // and send confirmSave = true to proceed, or confirmSave = false to abort.
    if (confirmSave === undefined || confirmSave === null) {
      return res.status(409).json({
        code: "ORDER_IN_PROGRESS",
        message:
          "An order is being processed. Save changes and start a new one?",
        requiresConfirmation: true,
      });
    }

    if (!confirmSave) {
      // User chose not to save — abort the insert entirely.
      return res.status(400).json({
        code: "INSERT_ABORTED",
        message: "Insert aborted by user: existing order was not saved.",
      });
    }

    // User confirmed: post (finalize) the existing order before starting a new one.
    await prisma.$transaction(async (tx) => {
      // "Post" the in-progress order — mark it as submitted/finalized.
      const existingOrder = await tx.orders.findUnique({
        where: { id: activeOrderId },
      });

      if (!existingOrder) {
        throw new Error(`Active order ${activeOrderId} not found.`);
      }

      // TODO(rnc): confirm the correct status value that represents a "posted" order
      // in your domain (e.g., "SUBMITTED", "CONFIRMED", "POSTED").
      await tx.orders.update({
        where: { id: activeOrderId },
        data: {
          status: "POSTED",
          updatedAt: new Date(),
        },
      });
    });
  }

  // FItemNo := 1 — initialize the line-item sequence counter for the new order.
  // This is returned to the client so it can track item numbering, or stored
  // server-side in a new order record.
  // TODO(rnc): confirm whether itemNo is a field on the Orders table or managed
  // purely client-side as a UI sequence counter.
  const initialItemNo = 1;

  // Create the new order with itemNo reset to 1.
  const newOrder = await prisma.$transaction(async (tx) => {
    // TODO(rnc): confirm required fields for a new Orders record in your schema
    // (e.g., userId, createdAt, status defaults).
    const order = await tx.orders.create({
      data: {
        status: "DRAFT",
        itemNo: initialItemNo,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return order;
  });

  return res.status(201).json({
    message: "Ready to insert new order.",
    orderId: newOrder.id,
    itemNo: initialItemNo,
  });
}