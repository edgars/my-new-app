async function ordersCalcFields(orderId: string) {
  // TODO(rnc): verify that OrdersItemsTotal is computed from line items (sum of qty * price),
  // that OrdersTaxRate is stored on the order record (percentage, e.g. 8.5 for 8.5%),
  // that OrdersFreight and OrdersAmountPaid are persisted columns on the Order table,
  // and that taxTotal / amountDue are stored columns (not purely derived at query time).
  // Also confirm rounding rules (2 decimal places) match the original Delphi behavior.

  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUniqueOrThrow({
      where: { id: orderId },
      select: {
        id: true,
        itemsTotal: true,
        taxRate: true,
        freight: true,
        amountPaid: true,
      },
    });

    const taxTotal = parseFloat(
      (order.itemsTotal.toNumber() * (order.taxRate.toNumber() / 100)).toFixed(2)
    );

    const amountDue = parseFloat(
      (
        order.itemsTotal.toNumber() +
        taxTotal +
        order.freight.toNumber() -
        order.amountPaid.toNumber()
      ).toFixed(2)
    );

    const updated = await tx.order.update({
      where: { id: orderId },
      data: {
        taxTotal,
        amountDue,
      },
      select: {
        id: true,
        itemsTotal: true,
        taxRate: true,
        taxTotal: true,
        freight: true,
        amountPaid: true,
        amountDue: true,
      },
    });

    return updated;
  });
}