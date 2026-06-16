async function ordersCalcFields(orderId: string) {
  // TODO(rnc): verify that OrdersItemsTotal is computed from line items (sum of qty * price),
  // that OrdersTaxRate is stored on the order record (percentage, e.g. 8.5 for 8.5%),
  // that OrdersFreight and OrdersAmountPaid are persisted columns on the orders table,
  // and that taxTotal / amountDue are stored columns (not purely derived at query time).

  return await prisma.$transaction(async (tx) => {
    const order = await tx.orders.findUniqueOrThrow({
      where: { id: orderId },
      select: {
        id: true,
        itemsTotal: true,
        taxRate: true,
        freight: true,
        amountPaid: true,
      },
    });

    const itemsTotal = order.itemsTotal ?? 0;
    const taxRate = order.taxRate ?? 0;
    const freight = order.freight ?? 0;
    const amountPaid = order.amountPaid ?? 0;

    const taxTotal = itemsTotal * (taxRate / 100);
    const amountDue = itemsTotal + taxTotal + freight - amountPaid;

    const updated = await tx.orders.update({
      where: { id: orderId },
      data: {
        taxTotal,
        amountDue,
      },
    });

    return updated;
  });
}