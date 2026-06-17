export async function handleOrdersNewRecord(req: Request, res: Response) {
  // TODO(rnc): verify that the NextOrd table exists in the Prisma schema with a `newKey` (or equivalent)
  // field that acts as the auto-increment order number sequence; confirm the Orders model field names
  // match (orderNo, saleDate, shipVia, terms, paymentMethod, itemsTotal, taxRate, freight, amountPaid);
  // confirm that concurrent requests cannot cause duplicate orderNo values (the transaction + atomic
  // increment below is intended to handle this, but the DB isolation level should be verified).

  try {
    const newOrder = await prisma.$transaction(async (tx) => {
      // Fetch and increment the next order number atomically
      const nextOrdRecord = await tx.nextOrd.findFirstOrThrow();

      const assignedOrderNo = nextOrdRecord.newKey;

      await tx.nextOrd.update({
        where: { id: nextOrdRecord.id },
        data: { newKey: nextOrdRecord.newKey + 1 },
      });

      // Create the new Order with default values mirroring TMastData.OrdersNewRecord
      const order = await tx.orders.create({
        data: {
          orderNo:       assignedOrderNo,
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

    return res.status(201).json(newOrder);
  } catch (error) {
    console.error('handleOrdersNewRecord error:', error);
    return res.status(500).json({ error: 'Failed to create new order record.' });
  }
}