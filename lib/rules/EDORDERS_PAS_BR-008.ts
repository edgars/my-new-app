async function handleOrdersSourceStateChange(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that dsEditModes maps correctly to your Prisma/application state enum values,
  // confirm that "Browse" vs "Edit" state transitions are enforced server-side and not just UI-driven,
  // and validate that the newcust field on Nextcust is updated atomically with the Orders state change.

  const { orderId, newState, newcust } = req.body as {
    orderId: string;
    newState: "browse" | "edit" | "insert";
    newcust: string;
  };

  const editModes: Array<typeof newState> = ["edit", "insert"];
  const isInEditMode = editModes.includes(newState);

  const result = await prisma.$transaction(async (tx) => {
    // Update the Orders state
    const updatedOrder = await tx.orders.update({
      where: { id: orderId },
      data: { sourceState: newState },
    });

    // Update Nextcust.newcust based on the state transition
    // PostBtn.Enabled and CancelBtn.Enabled are true when in edit modes
    // CloseBtn.Enabled is true only in browse mode
    const updatedNextcust = await tx.nextcust.updateMany({
      where: { orderId: orderId },
      data: {
        newcust: newcust,
        postEnabled: isInEditMode,
        cancelEnabled: isInEditMode,
        closeEnabled: newState === "browse",
      },
    });

    return { updatedOrder, updatedNextcust };
  });

  return res.status(200).json({
    success: true,
    orderId: result.updatedOrder.id,
    sourceState: result.updatedOrder.sourceState,
    postEnabled: isInEditMode,
    cancelEnabled: isInEditMode,
    closeEnabled: newState === "browse",
  });
}