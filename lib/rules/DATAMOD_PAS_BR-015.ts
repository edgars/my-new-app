async function handleOrdersAfterPost(
  prisma: PrismaClient,
  orderId: string
): Promise<Nextcust | null> {
  // TODO(rnc): verify that the Orders record exists and has a valid ShipDate before calling this handler;
  // confirm that Nextcust.newcust maps correctly to the legacy CustLastInvoiceDate field;
  // confirm that the Orders → Nextcust join key (custNo / orderId) is correctly modelled in the Prisma schema;
  // verify that cascading updates to Items and Parts (legacy ApplyUpdates) are handled elsewhere or need to be added here.

  return await prisma.$transaction(async (tx) => {
    const order = await tx.orders.findUnique({
      where: { id: orderId },
      select: {
        custNo: true,
        shipDate: true,
      },
    });

    if (!order || !order.custNo || !order.shipDate) {
      return null;
    }

    const customer = await tx.nextcust.findUnique({
      where: { custNo: order.custNo },
      select: {
        id: true,
        newcust: true,
      },
    });

    if (!customer) {
      return null;
    }

    const lastInvoiceDate = customer.newcust ? new Date(customer.newcust) : null;
    const shipDate = new Date(order.shipDate);

    if (!lastInvoiceDate || lastInvoiceDate < shipDate) {
      const updated = await tx.nextcust.update({
        where: { id: customer.id },
        data: {
          newcust: shipDate.toISOString(),
        },
      });

      return updated;
    }

    return customer as Nextcust;
  });
}