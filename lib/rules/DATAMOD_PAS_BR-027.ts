async function calcOrderFields(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that ItemsTotal, TaxRate, Freight, and AmountPaid are always
  // present and numeric before calculation; confirm rounding/precision rules for
  // currency fields TaxTotal and AmountDue match business expectations; confirm
  // whether AmountPaid can exceed ItemsTotal + TaxTotal + Freight (negative AmountDue).

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing or invalid Nextcust id" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const record = await tx.nextcust.findUnique({
        where: { id: String(id) },
        select: {
          id: true,
          newcust: true,
          ordersItemsTotal: true,
          ordersTaxRate: true,
          ordersFreight: true,
          ordersAmountPaid: true,
        },
      });

      if (!record) {
        throw new Error(`Nextcust record with id ${id} not found`);
      }

      const itemsTotal = Number(record.ordersItemsTotal ?? 0);
      const taxRate = Number(record.ordersTaxRate ?? 0);
      const freight = Number(record.ordersFreight ?? 0);
      const amountPaid = Number(record.ordersAmountPaid ?? 0);

      // Mirrors: OrdersTaxTotal.Value := OrdersItemsTotal.Value * (OrdersTaxRate.Value / 100)
      const taxTotal = itemsTotal * (taxRate / 100);

      // Mirrors: OrdersAmountDue.Value := OrdersItemsTotal.Value + OrdersTaxTotal.Value
      //                                 + OrdersFreight.Value - OrdersAmountPaid.Value
      const amountDue = itemsTotal + taxTotal + freight - amountPaid;

      const updated = await tx.nextcust.update({
        where: { id: String(id) },
        data: {
          ordersTaxTotal: taxTotal,
          ordersAmountDue: amountDue,
        },
      });

      return updated;
    });

    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return res.status(500).json({ error: message });
  }
}