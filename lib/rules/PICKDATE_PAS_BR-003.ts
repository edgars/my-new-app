async function handlePrevMonthBtnClick(
  req: import("next").NextApiRequest,
  res: import("next").NextApiResponse
) {
  // TODO(rnc): verify that the Nextcust entity has a date/calendar field (newcust) that tracks
  // the currently displayed month, and that decrementing it by one month is the correct
  // business logic equivalent of Calendar1.PrevMonth in the original Delphi procedure.

  const { id } = req.body as { id: string | number };

  if (!id) {
    return res.status(400).json({ error: "Missing Nextcust id" });
  }

  const result = await prisma.$transaction(async (tx) => {
    const nextcust = await tx.nextcust.findUnique({
      where: { id: Number(id) },
      select: { id: true, newcust: true },
    });

    if (!nextcust) {
      throw new Error(`Nextcust record with id ${id} not found`);
    }

    const currentDate = nextcust.newcust ? new Date(nextcust.newcust) : new Date();

    const prevMonth = new Date(currentDate);
    prevMonth.setDate(1);
    prevMonth.setMonth(prevMonth.getMonth() - 1);

    const updated = await tx.nextcust.update({
      where: { id: Number(id) },
      data: {
        newcust: prevMonth,
      },
    });

    return updated;
  });

  return res.status(200).json(result);
}