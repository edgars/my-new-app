async function handleQueryCustDlg(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that fromDate and toDate are parsed from the same format used in the original Delphi TQueryCustDlg form, confirm that "ToDate = 0" sentinel means "no end date specified" (i.e. toDate is null/undefined in the JS equivalent), and ensure the Nextcust/newcust field mapping aligns with the original query dialog's intent before executing any DB reads.

  const { fromDate, toDate } = req.body as { fromDate?: string; toDate?: string };

  let parsedFromDate: Date | null = null;
  let parsedToDate: Date | null = null;

  try {
    if (fromDate) {
      parsedFromDate = new Date(fromDate);
      if (isNaN(parsedFromDate.getTime())) {
        throw new Error("Invalid fromDate");
      }
    }

    if (toDate) {
      parsedToDate = new Date(toDate);
      if (isNaN(parsedToDate.getTime())) {
        throw new Error("Invalid toDate");
      }
    }
  } catch {
    return res.status(400).json({ error: "Invalid date specified" });
  }

  // Mirror the Delphi rule: if toDate is provided (non-zero) it must not be less than fromDate
  if (parsedToDate !== null && parsedFromDate !== null) {
    if (parsedToDate < parsedFromDate) {
      return res
        .status(400)
        .json({ error: '"TO" date cannot be less than "FROM" date' });
    }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const customers = await tx.nextcust.findMany({
        where: {
          newcust: {
            ...(parsedFromDate !== null && { gte: parsedFromDate }),
            ...(parsedToDate !== null && { lte: parsedToDate }),
          },
        },
      });

      return customers;
    });

    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: "Failed to query customers" });
  }
}