async function handleNextcustBeforeInsert(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that the client sends a flag indicating whether an in-progress order
  // was confirmed/saved by the user before initiating a new one (mirrors the Delphi Confirm dialog
  // + Orders.Post logic); also verify that FItemNo reset to 1 is represented correctly in the
  // Nextcust/newcust schema (e.g. an itemNo field on the order or a session-level counter).

  const { newcust, orderInProgress, confirmedSave, currentOrderId } = req.body as {
    newcust: Record<string, unknown>;
    orderInProgress: boolean;
    confirmedSave: boolean;
    currentOrderId?: string;
  };

  if (orderInProgress) {
    if (!confirmedSave) {
      return res.status(409).json({
        error:
          "An order is being processed. Save changes and start a new one?",
        code: "ORDER_IN_PROGRESS",
      });
    }

    if (!currentOrderId) {
      return res.status(400).json({
        error: "currentOrderId is required when confirmedSave is true.",
        code: "MISSING_ORDER_ID",
      });
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        // Post (save) the in-progress order before inserting the new customer record
        const savedOrder = await tx.order.update({
          where: { id: currentOrderId },
          data: { status: "POSTED" },
        });

        // Insert the new Nextcust record with itemNo reset to 1
        const nextcust = await tx.nextcust.create({
          data: {
            ...newcust,
            itemNo: 1,
          },
        });

        return { savedOrder, nextcust };
      });

      return res.status(201).json(result);
    } catch (error) {
      console.error("handleNextcustBeforeInsert transaction error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  // No order in progress — insert the new Nextcust record directly with itemNo reset to 1
  try {
    const nextcust = await prisma.nextcust.create({
      data: {
        ...newcust,
        itemNo: 1,
      },
    });

    return res.status(201).json(nextcust);
  } catch (error) {
    console.error("handleNextcustBeforeInsert error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}