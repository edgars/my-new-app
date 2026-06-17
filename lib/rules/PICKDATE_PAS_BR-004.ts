async function handleNextMonthBtnClick(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that the Nextcust entity has a date/calendar field (newcust) that stores the current
  // calendar month, and that advancing to the next month should persist the updated month value back to the
  // database for the relevant record; confirm the record identifier passed in the request and whether this
  // should update an existing row or create a new one.

  const { id } = req.body as { id: string };

  if (!id) {
    return res.status(400).json({ error: "Missing record id" });
  }

  try {
    const existing = await prisma.nextcust.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Nextcust record not found" });
    }

    const currentDate: Date =
      existing.newcust instanceof Date
        ? existing.newcust
        : new Date(existing.newcust as string);

    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

    const updated = await prisma.$transaction(async (tx) => {
      return tx.nextcust.update({
        where: { id },
        data: {
          newcust: nextMonthDate,
        },
      });
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("handleNextMonthBtnClick error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}