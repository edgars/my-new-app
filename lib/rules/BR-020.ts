async function ordersBeforeClose(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that closing Items, Emps, and CustByOrd datasets in the original Delphi
  // procedure implies clearing/resetting related cached or derived data for Parts (e.g., open
  // orders, employee assignments, customer-by-order linkages) — confirm the intended side effects
  // and whether any Part records should be updated (e.g., backord flag, onorder qty) as part of
  // this close/reset operation before orders are finalized.

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Reset backord flag for all parts that have no remaining open orders
      const partsWithOpenOrders = await tx.parts.findMany({
        where: {
          onorder: {
            gt: 0,
          },
        },
        select: {
          partno: true,
        },
      });

      const partnosWithOpenOrders = partsWithOpenOrders.map((p) => p.partno);

      // Clear backord status for parts that no longer have open orders
      const updatedParts = await tx.parts.updateMany({
        where: {
          backord: true,
          NOT: {
            partno: {
              in: partnosWithOpenOrders,
            },
          },
        },
        data: {
          backord: false,
        },
      });

      // Reset onorder quantity for parts where orders have been closed/fulfilled
      const resetOnOrder = await tx.parts.updateMany({
        where: {
          onorder: {
            lt: 0,
          },
        },
        data: {
          onorder: 0,
        },
      });

      return {
        partsBackordCleared: updatedParts.count,
        partsOnOrderReset: resetOnOrder.count,
      };
    });

    res.status(200).json({
      success: true,
      message: "Orders before close procedure completed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in ordersBeforeClose:", error);
    res.status(500).json({
      success: false,
      message: "Failed to execute orders before close procedure",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}