async function handleCustGridEnter(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that switching ActiveSource to CustMasterSrc is the correct
  // data source for this context, that dgAlwaysShowSelection toggling on CustGrid
  // and removal from OrdersGrid matches intended UI behavior, and that no Parts
  // entity persistence is required for this purely UI-state-driven rule.

  try {
    // This handler mirrors the Delphi Enter event for CustGrid:
    // 1. Set the active source to CustMasterSrc (represented here as a session/state flag)
    // 2. Ensure CustGrid has AlwaysShowSelection enabled
    // 3. Ensure OrdersGrid has AlwaysShowSelection disabled
    //
    // Because this is a UI-state rule with no direct write to the Parts entity,
    // we return the resolved UI state so the client can apply it.

    const uiState = {
      activeSource: "CustMasterSrc",
      custGrid: {
        alwaysShowSelection: true,
      },
      ordersGrid: {
        alwaysShowSelection: false,
      },
    };

    // If any Parts data needs to be fetched when CustGrid is entered, do so here.
    // Example: load Parts associated with the currently selected customer.
    // const parts = await prisma.parts.findMany({
    //   where: {
    //     /* vendorno or other customer-linking field */
    //   },
    //   select: {
    //     partno: true,
    //     description: true,
    //     onhand: true,
    //     onorder: true,
    //     vendorno: true,
    //     cost: true,
    //     listprice: true,
    //     backord: true,
    //   },
    // });

    return res.status(200).json({
      success: true,
      uiState,
      // parts,
    });
  } catch (error) {
    console.error("handleCustGridEnter error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to process CustGrid enter event.",
    });
  }
}