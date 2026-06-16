async function showModalParts(
  orderBy: "description" | "partno" = "description",
  searchTerm?: string
): Promise<{ parts: any[]; total: number }> {
  // TODO(rnc): verify that the orderBy field mapping matches the original Delphi OrderCombo
  // behavior (index 0 = Description, index 1 = PartNo), and confirm that the Parts dataset
  // used here (MastData.Parts) applies no additional filters beyond the sort order change
  // triggered by OrderComboChange — also verify pagination requirements and whether
  // backord/onorder fields should be excluded from the search dialog results.

  const orderByField =
    orderBy === "description"
      ? { description: "asc" as const }
      : { partno: "asc" as const };

  const whereClause = searchTerm
    ? {
        OR: [
          {
            description: {
              contains: searchTerm,
              mode: "insensitive" as const,
            },
          },
          {
            partno: {
              contains: searchTerm,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const [parts, total] = await prisma.$transaction([
    prisma.parts.findMany({
      where: whereClause,
      orderBy: orderByField,
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
    }),
    prisma.parts.count({
      where: whereClause,
    }),
  ]);

  return { parts, total };
}