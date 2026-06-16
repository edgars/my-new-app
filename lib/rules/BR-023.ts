async function ordersBeforeInsert(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that any in-progress order for the current session/user is detected
  // correctly via the activeOrderId mechanism, that "posting" an order means finalizing/
  // submitting it in your domain logic (status transition), and that FItemNo := 1 maps
  // to resetting a lineitem sequence counter on the order record or in session state.

  const { activeOrderId, confirmSave } = req.body as {
    activeOrderId?: string;
    confirmSave?: boolean;
  };

  // If there is an order currently being edited/processed, we must resolve it first
  if (activeOrderId) {
    // The client must present a confirmation dialog equivalent to:
    // "An order is being processed. Save changes and start a new one?"
    // and send confirmSave: true to proceed, or confirmSave: false to abort.
    if (confirmSave === undefined || confirmSave === null) {
      return res.status(409).json({
        conflict: true,
        message:
          "An order is being processed. Save changes and start a new one?",
        activeOrderId,
      });
    }

    if (!confirmSave) {
      // Equivalent to Abort — do not proceed with the new insert
      return res.status(400).json({
        aborted: true,
        message: "Insert aborted by user.",
      });
    }

    // confirmSave === true: post (finalize) the in-progress order, then allow new insert
    await prisma.$transaction(async (tx) => {
      // "Post" the existing order — mark it as submitted/finalized
      const existingOrder = await tx.order.findUnique({
        where: { id: activeOrderId },
      });

      if (!existingOrder) {
        throw new Error(`Active order ${activeOrderId} not found.`);
      }

      await tx.order.update({
        where: { id: activeOrderId },
        data: {
          status: "SUBMITTED",
          submittedAt: new Date(),
        },
      });
    });
  }

  // FItemNo := 1 — initialize the line-item sequence counter for the new order
  // This is returned to the client to seed the first item number, or stored server-side
  const initialItemNo = 1;

  // Create the new order record with itemNo counter reset
  const newOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        status: "DRAFT",
        nextItemNo: initialItemNo,
        createdAt: new Date(),
      },
    });

    return order;
  });

  return res.status(201).json({
    success: true,
    orderId: newOrder.id,
    nextItemNo: initialItemNo,
  });
}