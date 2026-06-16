export async function handleOrdersNewRecord(req: Request, res: Response) {
  // TODO(rnc): verify that the NextOrd table exists in the Prisma schema with a `newKey` (or equivalent)
  // field that acts as the auto-increment order number sequence; confirm the Orders model field names
  // match (orderNo, saleDate, shipVia, terms, paymentMethod, itemsTotal, taxRate, freight, amountPaid);
  // confirm that concurrent requests cannot race on the NextOrd counter (the transaction + select-for-update
  // pattern below must be supported by the underlying DB, e.g. PostgreSQL); confirm timezone handling for
  // saleDate is acceptable (UTC new Date() used here).

  try {
    const newOrder = await prisma.$transaction(async (tx) => {
      // Lock the NextOrd row and read the current key
      const nextOrdRecords = await tx.$queryRaw<{ id: number; newKey: number }[]>`
        SELECT id, "newKey" FROM "NextOrd" LIMIT 1 FOR UPDATE
      `;

      if (!nextOrdRecords || nextOrdRecords.length === 0) {
        throw new Error("NextOrd record not found");
      }

      const nextOrdRecord = nextOrdRecords[0];
      const assignedOrderNo = nextOrdRecord.newKey;

      // Increment the key in NextOrd
      await tx.$executeRaw`
        UPDATE "NextOrd" SET "newKey" = ${assignedOrderNo + 1} WHERE id = ${nextOrdRecord.id}
      `;

      // Create the new Order with defaults mirroring TMastData.OrdersNewRecord
      const order = await tx.orders.create({
        data: {
          orderNo: assignedOrderNo,
          saleDate: new Date(),
          shipVia: "UPS",
          terms: "net 30",
          paymentMethod: "Check",
          itemsTotal: 0,
          taxRate: 0,
          freight: 0,
          amountPaid: 0,
        },
      });

      return order;
    });

    return res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("handleOrdersNewRecord error:", error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create order",
    });
  }
}