async function ordersCalcFields(orderId: string) {
  // TODO(rnc): verify that OrdersItemsTotal is computed from line items (sum of qty * unit price),
  // that OrdersTaxRate is stored on the order record (percentage, e.g. 8.5 for 8.5%),
  // that OrdersFreight and OrdersAmountPaid are persisted columns on the Order table,
  // and that TaxTotal / AmountDue are stored (not purely derived) — confirm schema matches these assumptions.

  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUniqueOrThrow({
      where: { id: orderId },
      select: {
        taxRate: true,
        freight: true,
        amountPaid: true,
        items: {
          select: {
            quantity: true,
            unitPrice: true,
          },
        },
      },
    });

    const itemsTotal = order.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    const taxTotal = itemsTotal * (order.taxRate / 100);

    const amountDue =
      itemsTotal + taxTotal + order.freight - order.amountPaid;

    const updated = await tx.order.update({
      where: { id: orderId },
      data: {
        itemsTotal,
        taxTotal,
        amountDue,
      },
    });

    return updated;
  });
}