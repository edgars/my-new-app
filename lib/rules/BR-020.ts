async function ordersBeforeClose(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that closing Items, Emps, and CustByOrd datasets in the original Delphi
  // procedure maps correctly to the intended server-side cleanup/reset logic here — confirm
  // whether this should cancel open orders, clear related employee assignments, and nullify
  // customer-order associations, or if it is purely a UI dataset lifecycle concern that may
  // not require any persistent database writes at all.

  try {
    await prisma.$transaction(async (tx) => {
      // Close/reset Items — cancel or clear any open part order line items
      await tx.parts.updateMany({
        where: {
          onorder: {
            gt: 0,
          },
        },
        data: {
          onorder: 0,
          backord: 0,
        },
      });

      // Close/reset Emps — disassociate employees from open orders
      await tx.employee.updateMany({
        where: {
          hasOpenOrder: true,
        },
        data: {
          hasOpenOrder: false,
        },
      });

      // Close/reset CustByOrd — clear customer-by-order references before close
      await tx.customerOrder.updateMany({
        where: {
          status: "OPEN",
        },
        data: {
          status: "CLOSED",
          closedAt: new Date(),
        },
      });
    });

    res.status(200).json({ message: "OrdersBeforeClose completed successfully" });
  } catch (error) {
    console.error("OrdersBeforeClose failed:", error);
    res.status(500).json({ error: "Failed to execute OrdersBeforeClose procedure" });
  }
}