async function handleNextcustFormCreate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that the default date range (1995-01-01 to now) is correct for filtering Nextcust records by LastInvoiceDate, and confirm the label text 'Customers with LastInvoiceDate ranging:' matches the UI expectation

  const fromDate = new Date(1995, 0, 1); // EncodeDate(1995, 01, 01)
  const toDate = new Date(); // Now

  const customers = await prisma.$transaction(async (tx) => {
    const results = await tx.nextcust.findMany({
      where: {
        newcust: {
          lastInvoiceDate: {
            gte: fromDate,
            lte: toDate,
          },
        },
      },
    });
    return results;
  });

  return res.status(200).json({
    label: "Customers with LastInvoiceDate ranging:",
    fromDate: fromDate.toISOString(),
    toDate: toDate.toISOString(),
    customers,
  });
}