// TODO(rnc): verify that MastData.Cust and MastData.Orders dataset associations are correctly mapped to Prisma relations,
// and confirm that the AllDataSets.Add behavior (attaching Cust and Orders datasets before print) is fully replicated
// by eagerly loading the related customer and orders data in this handler before report generation proceeds.

async function invoiceByOrderNoReportBeforePrint(
  req: import("next").NextApiRequest,
  res: import("next").NextApiResponse
) {
  const { orderNo } = req.query;

  if (!orderNo || typeof orderNo !== "string") {
    return res.status(400).json({ error: "Missing or invalid orderNo parameter" });
  }

  try {
    const reportData = await prisma.$transaction(async (tx) => {
      const newcust = await tx.nextcust.findMany({
        where: {
          orders: {
            some: {
              orderNo: orderNo,
            },
          },
        },
        include: {
          orders: {
            where: {
              orderNo: orderNo,
            },
          },
        },
      });

      if (!newcust || newcust.length === 0) {
        throw new Error(`No customer records found for orderNo: ${orderNo}`);
      }

      const allDataSets = {
        cust: newcust.map((c) => ({
          ...c,
          orders: undefined,
        })),
        orders: newcust.flatMap((c) => c.orders),
      };

      return allDataSets;
    });

    const printReport = reportData.cust.length > 0 && reportData.orders.length > 0;

    return res.status(200).json({
      printReport,
      datasets: reportData,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return res.status(500).json({ error: message });
  }
}