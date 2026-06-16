export async function handleOrdersNewRecord(req: Request, res: Response) {
  // TODO(rnc): verify that the NextOrd table exists in the Prisma schema with a `newKey` field
  // that acts as an auto-incrementing order number sequence; confirm the Orders model field names
  // match (orderNo, saleDate, shipVia, terms, paymentMethod, itemsTotal, taxRate, freight, amountPaid);
  // confirm that concurrent requests cannot cause duplicate orderNo values (row-level locking behavior
  // in the transaction below should be validated against your DB engine — Postgres recommended);
  // confirm that `saleDate` should default to server time (UTC) rather than client-supplied date.

  try {
    const newOrder = await prisma.$transaction(async (tx) => {
      // Lock and fetch the next order number from the sequence table
      const nextOrdRecord = await tx.nextOrd.findFirstOrThrow();

      const nextOrderNo = nextOrdRecord.newKey;

      // Increment the sequence value atomically within the transaction
      await tx.nextOrd.update({
        where: { id: nextOrdRecord.id },
        data: {
          newKey: nextOrdRecord.newKey + 1,
        },
      });

      // Create the new Order record with default values mirroring TMastData.OrdersNewRecord
      const order = await tx.orders.create({
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

      return order;
    });

    return res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error('[handleOrdersNewRecord] Failed to create order:', error);
    return res.status(500).json({ success: false, message: 'Failed to create new order record.' });
  }
}