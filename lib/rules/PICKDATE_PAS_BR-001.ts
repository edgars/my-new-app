async function setDateHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that the incoming date value is a valid TDateTime-equivalent (ISO 8601 string or timestamp),
  // that Calendar1.CalendarDate mapping to the newcust field on Nextcust is correct,
  // and that no additional side-effects from the original Delphi SetDate procedure are missing here.

  const { id, date } = req.body;

  if (!id || !date) {
    return res.status(400).json({ error: "Missing required fields: id and date" });
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: "Invalid date value provided" });
  }

  const updatedNextcust = await prisma.$transaction(async (tx) => {
    const existing = await tx.nextcust.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error(`Nextcust record with id ${id} not found`);
    }

    const updated = await tx.nextcust.update({
      where: { id },
      data: {
        newcust: parsedDate,
      },
    });

    return updated;
  });

  return res.status(200).json(updatedNextcust);
}