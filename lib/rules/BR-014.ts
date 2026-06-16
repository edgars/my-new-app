export async function handleSearchEdChange(searchText: string): Promise<{ searchEnabled: boolean }> {
  // TODO(rnc): verify that the client-side enable/disable of the search button is also enforced
  // server-side so that empty search strings are rejected before hitting the database, and confirm
  // that trimming/whitespace-only strings should also be treated as empty (matching UI intent).

  const searchEnabled = searchText !== '';

  if (!searchEnabled) {
    return { searchEnabled: false };
  }

  const parts = await prisma.parts.findMany({
    where: {
      OR: [
        { partno: { contains: searchText, mode: 'insensitive' } },
        { description: { contains: searchText, mode: 'insensitive' } },
        { vendorno: { contains: searchText, mode: 'insensitive' } },
      ],
    },
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
  });

  return { searchEnabled: true, parts };
}