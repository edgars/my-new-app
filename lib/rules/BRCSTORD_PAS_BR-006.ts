async function handleCustGridEnter(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that switching ActiveSource to CustMasterSrc is the correct
  // data source for this context, that dgAlwaysShowSelection should be added to
  // CustGrid and removed from OrdersGrid simultaneously, and that no Parts fields
  // (partno, description, onhand, onorder, vendorno, cost, listprice, backord)
  // need to be read or written as part of this focus-change event.

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Reflect the grid focus state by marking CustGrid as the active selection
      // and ensuring OrdersGrid loses the always-show-selection flag.
      // In a server-side model these UI states are persisted as user-session
      // or view-preference records; adjust the model names to match your schema.

      const custGridPreference = await tx.gridPreference.upsert({
        where: {
          gridName: "CustGrid",
        },
        update: {
          alwaysShowSelection: true,
          isActiveSource: true,
          updatedAt: new Date(),
        },
        create: {
          gridName: "CustGrid",
          alwaysShowSelection: true,
          isActiveSource: true,
        },
      });

      const ordersGridPreference = await tx.gridPreference.upsert({
        where: {
          gridName: "OrdersGrid",
        },
        update: {
          alwaysShowSelection: false,
          isActiveSource: false,
          updatedAt: new Date(),
        },
        create: {
          gridName: "OrdersGrid",
          alwaysShowSelection: false,
          isActiveSource: false,
        },
      });

      return { custGridPreference, ordersGridPreference };
    });

    return res.status(200).json({
      success: true,
      activeSource: "CustMasterSrc",
      custGrid: result.custGridPreference,
      ordersGrid: result.ordersGridPreference,
    });
  } catch (error) {
    console.error("handleCustGridEnter error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update grid selection state",
    });
  }
}