export async function handleItemsGridEnter(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that switching the active dataset to Items (MastData.Items) is the correct
  // behavior on grid enter — confirm no prior dataset state needs to be saved or restored,
  // and that Parts/Items is the intended primary dataset for this grid context.

  try {
    const items = await prisma.parts.findMany({
      select: {
        partno: true,
        description: true,
        onhand: true,
        onorder: true,
        vendorno: true,
        cost: true,
        listprice: true,
        backord: true,
      },
      orderBy: {
        partno: "asc",
      },
    });

    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error("ItemsGrid enter handler error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to load Items dataset for ItemsGrid",
    });
  }
}