export async function handlePickOrderNoDlgFormShow(
  req: import("next").NextApiRequest,
  res: import("next").NextApiResponse
) {
  // TODO(rnc): verify that opening Orders here should load ALL orders or only a filtered subset (e.g. by customer, status, date range); confirm whether newcust field on Nextcust should filter or scope the orders returned; confirm pagination/sorting requirements matching original Delphi MastData.Orders dataset behavior

  try {
    const orders = await prisma.$transaction(async (tx) => {
      const nextcustRecord = await tx.nextcust.findFirst({
        select: {
          newcust: true,
        },
      });

      const orders = await tx.order.findMany({
        where: nextcustRecord?.newcust
          ? { custId: nextcustRecord.newcust }
          : undefined,
        orderBy: {
          orderId: "asc",
        },
      });

      return orders;
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("handlePickOrderNoDlgFormShow error:", error);
    return res.status(500).json({ error: "Failed to open orders" });
  }
}