export async function showSearchPartsDialog() {
  // TODO(rnc): verify that this returns parts data in the correct order based on user selection (description or partno)
  try {
    const parts = await prisma.parts.findMany({
      select: {
        partno: true,
        description: true,
        onhand: true,
        onorder: true,
        vendorno: true,
        cost: true,
        listprice: true,
        backord: true
      },
      orderBy: {
        description: 'asc'
      }
    });

    return {
      success: true,
      parts: parts.map(part => ({
        partno: part.partno,
        description: part.description,
        onhand: part.onhand,
        onorder: part.onorder,
        vendorno: part.vendorno,
        cost: part.cost,
        listprice: part.listprice,
        backord: part.backord
      })),
      sortOptions: ['Description', 'PartNo'],
      defaultSort: 'Description'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve parts'
    };
  }
}