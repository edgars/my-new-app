async function handlePopupCalBtnFromClick(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that the incoming date string is properly formatted and valid before parsing,
  // confirm that the calendar dialog equivalent (BrDateForm) behavior is fully replicated client-side,
  // and ensure the returned date string format matches the expected locale/format used downstream by FromEdit.Text

  const { currentFromDate, newcust } = req.body as {
    currentFromDate: string;
    newcust: string;
  };

  if (!currentFromDate || typeof currentFromDate !== "string") {
    return res.status(400).json({ error: "currentFromDate is required and must be a string" });
  }

  const parsedDate = new Date(currentFromDate);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: "currentFromDate is not a valid date string" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingCust = await tx.nextcust.findFirst({
        where: { newcust },
      });

      if (!existingCust) {
        throw new Error(`Nextcust record with newcust '${newcust}' not found`);
      }

      const updatedCust = await tx.nextcust.update({
        where: { id: existingCust.id },
        data: {
          fromDate: parsedDate,
        },
      });

      return updatedCust;
    });

    const formattedDate = result.fromDate
      ? new Date(result.fromDate).toLocaleDateString()
      : null;

    return res.status(200).json({
      success: true,
      selectedDate: formattedDate,
      record: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return res.status(500).json({ error: message });
  }
}