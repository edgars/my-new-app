async function handleNextcustQRDBText1Print(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that CustByLastInvQueryLastInvoiceDate maps to the correct
  // date field on the Nextcust model, that DateToStr formatting matches the
  // locale/format expected by the frontend, and that newcust is the correct
  // field being updated with the formatted date string.

  const { id } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const nextcust = await tx.nextcust.findUnique({
        where: { id },
        select: {
          id: true,
          lastInvoiceDate: true,
        },
      });

      if (!nextcust) {
        throw new Error(`Nextcust record not found for id: ${id}`);
      }

      if (!nextcust.lastInvoiceDate) {
        throw new Error(
          `lastInvoiceDate is null or undefined for Nextcust id: ${id}`
        );
      }

      const formattedDate = nextcust.lastInvoiceDate.toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      );

      const updated = await tx.nextcust.update({
        where: { id },
        data: {
          newcust: formattedDate,
        },
      });

      return updated;
    });

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return res.status(500).json({ success: false, error: message });
  }
}