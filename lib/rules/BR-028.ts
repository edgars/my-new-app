export async function handleOrdersNewRecord(req: Request, res: Response) {
  // TODO(rnc): verify that the NextOrd table exists in the Prisma schema with a `newKey` (or equivalent)
  // field that acts as the auto-increment order number sequence; confirm the Orders model field names
  // match (orderNo, saleDate, shipVia, terms, paymentMethod, itemsTotal, taxRate, freight, amountPaid);
  // confirm no existing DB-level sequence or auto-increment already handles orderNo generation;
  // confirm timezone handling for saleDate is acceptable (UTC vs local).

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Lock and fetch the next order number from the NextOrd sequence table
      const nextOrd = await tx.nextOrd.findFirstOrThrow();

      const nextOrderNo = nextOrd.newKey;

      // Increment the sequence key
      await tx.nextOrd.update({
        where: { id: nextOrd.id },
        data: {
          newKey: nextOrd.newKey + 1,
        },
      });

      // Create the new Order record with default values mirroring TMastData.OrdersNewRecord
      const newOrder = await tx.orders.create({
        data: {
          orderNo:       nextOrderNo,
          saleDate:      new Date(),
          shipVia:       'UPS',
          terms:         'net 30',
          paymentMethod: 'Check',
          itemsTotal:    0,
          taxRate:       0,
          freight:       0,
          amountPaid:    0,
        },
      });

      return newOrder;
    });

    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('[handleOrdersNewRecord] Failed to create order:', error);
    return res.status(500).json({ success: false, message: 'Failed to create new order record.' });
  }
}