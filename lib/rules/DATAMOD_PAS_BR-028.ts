async function handleOrdersNewRecord(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that the NextOrd table exists in the schema with a single-row counter
  // (NextOrdNewKey), that concurrent requests cannot produce duplicate order numbers (the
  // atomic increment below relies on Prisma's transaction serialization), and that all default
  // field values (ShipVia, Terms, PaymentMethod, rates) still match current business requirements.

  try {
    const newOrder = await prisma.$transaction(async (tx) => {
      // Fetch and increment the next order key atomically
      const nextOrdRecord = await tx.nextcust.findFirst({
        where: { newcust: true },
      });

      if (!nextOrdRecord) {
        throw new Error("NextOrd counter record not found");
      }

      const currentKey = nextOrdRecord.newcust as unknown as number;

      // Increment the counter
      await tx.nextcust.update({
        where: { id: nextOrdRecord.id },
        data: {
          newcust: (currentKey + 1) as unknown as typeof nextOrdRecord.newcust,
        },
      });

      // Create the new order with defaults mirroring TMastData.OrdersNewRecord
      const order = await tx.order.create({
        data: {
          orderNo:       currentKey,
          saleDate:      new Date(),
          shipVia:       "UPS",
          terms:         "net 30",
          paymentMethod: "Check",
          itemsTotal:    0,
          taxRate:       0,
          freight:       0,
          amountPaid:    0,
        },
      });

      return order;
    });

    return res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("handleOrdersNewRecord error:", error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
}