async function handleCalendar1Change(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that the calendarDate field sent from the client matches the Calendar1.CalendarDate source,
  // and that the formatted title (MMMM, YYYY) is meant to be stored on Nextcust.newcust or only returned as display text.

  const { id, calendarDate } = req.body;

  if (!calendarDate) {
    return res.status(400).json({ error: "calendarDate is required" });
  }

  const parsedDate = new Date(calendarDate);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: "Invalid calendarDate value" });
  }

  const formattedTitle = parsedDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const updatedNextcust = await prisma.$transaction(async (tx) => {
    const record = await tx.nextcust.update({
      where: { id: Number(id) },
      data: {
        newcust: formattedTitle,
      },
    });
    return record;
  });

  return res.status(200).json({ nextcust: updatedNextcust, title: formattedTitle });
}