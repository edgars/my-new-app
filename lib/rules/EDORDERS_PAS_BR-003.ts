async function handleItemsGridEnter(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that MastData.Items is the correct Prisma model/relation to activate as the
  // dataset source when the ItemsGrid receives focus, and confirm that no additional filtering or
  // ordering is required beyond a basic findMany on the Nextcust items relation.

  try {
    const nextcustId = req.query.id as string;

    if (!nextcustId) {
      return res.status(400).json({ error: "Nextcust ID is required" });
    }

    const items = await prisma.$transaction(async (tx) => {
      const nextcust = await tx.nextcust.findUnique({
        where: { id: nextcustId },
        select: { newcust: true },
      });

      if (!nextcust) {
        throw new Error(`Nextcust record not found for id: ${nextcustId}`);
      }

      const mastDataItems = await tx.nextcust.findUnique({
        where: { id: nextcustId },
        include: {
          items: true,
        },
      });

      return mastDataItems?.items ?? [];
    });

    return res.status(200).json({ dataset: items });
  } catch (error) {
    console.error("Error handling ItemsGrid enter:", error);
    return res.status(500).json({ error: "Failed to activate items dataset" });
  }
}