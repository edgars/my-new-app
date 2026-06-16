export async function showSearchPartsDialog() {
  // TODO(rnc): verify that this returns parts data in the correct format for the modal dialog UI
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
      }))
    };
  } catch (error) {
    console.error('Error fetching parts for search dialog:', error);
    return {
      success: false,
      error: 'Failed to load parts data'
    };
  }
}