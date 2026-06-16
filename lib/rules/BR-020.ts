async function ordersBeforeClose(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that closing Items, Emps, and CustByOrd datasets maps correctly to
  // clearing/resetting these related records in the DB context, and that no additional
  // cascade or cleanup logic is required before closing out orders for Parts

  try {
    await prisma.$transaction(async (tx) => {
      // Close Items — deactivate or clear open item records linked to orders
      await tx.items.updateMany({
        where: {
          status: "OPEN",
        },
        data: {
          status: "CLOSED",
        },
      });

      // Close Emps — release employee assignments tied to open orders
      await tx.emps.updateMany({
        where: {
          assignedToOrder: true,
        },
        data: {
          assignedToOrder: false,
        },
      });

      // Close CustByOrd — mark customer-by-order records as closed
      await tx.custByOrd.updateMany({
        where: {
          status: "OPEN",
        },
        data: {
          status: "CLOSED",
        },
      });
    });

    return res.status(200).json({ message: "OrdersBeforeClose completed successfully" });
  } catch (error) {
    console.error("OrdersBeforeClose failed:", error);
    return res.status(500).json({ error: "Failed to execute OrdersBeforeClose procedure" });
  }
}