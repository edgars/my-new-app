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
    // and send confirmSave: true to proceed or confirmSave: false to abort.
    if (confirmSave === undefined) {
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
        message: "Insert aborted by user.",
      });
    }

    // User confirmed — post (finalize) the in-progress order, then start a new one.
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Post the existing order: mark it as submitted/finalized.
        const postedOrder = await tx.orders.update({
          where: { id: activeOrderId },
          data: {
            status: "POSTED",
            postedAt: new Date(),
          },
        });

        // Start a new order with itemNo reset to 1.
        const newOrder = await tx.orders.create({
          data: {
            status: "EDITING",
            itemNo: 1,
            createdAt: new Date(),
          },
        });

        return { postedOrder, newOrder };
      });

      return res.status(201).json({
        message: "Previous order posted. New order created.",
        postedOrderId: result.postedOrder.id,
        newOrderId: result.newOrder.id,
        itemNo: result.newOrder.itemNo,
      });
    } catch (error) {
      console.error("ordersBeforeInsert transaction failed:", error);
      return res.status(500).json({
        code: "TRANSACTION_FAILED",
        message: "Failed to post existing order and create a new one.",
      });
    }
  }

  // No active order in progress — simply create a new order with itemNo = 1.
  try {
    const newOrder = await prisma.orders.create({
      data: {
        status: "EDITING",
        itemNo: 1,
        createdAt: new Date(),
      },
    });

    return res.status(201).json({
      message: "New order created.",
      newOrderId: newOrder.id,
      itemNo: newOrder.itemNo,
    });
  } catch (error) {
    console.error("ordersBeforeInsert failed:", error);
    return res.status(500).json({
      code: "CREATE_FAILED",
      message: "Failed to create new order.",
    });
  }
}