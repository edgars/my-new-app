// TODO(rnc): verify that the Parts table exists in the Prisma schema with fields: partno, description,
// onhand, onorder, vendorno, cost, listprice, backord; confirm default sort order (description first,
// then partno) matches legacy Delphi OrderCombo behavior; confirm pagination limits are acceptable
// for production part catalog size; verify that the returned fields are sufficient for the modal
// selection dialog and no additional joins (e.g. vendor name) are needed.

export async function searchParts(
  orderBy: "description" | "partno" = "description",
  searchTerm?: string,
  skip = 0,
  take = 50
) {
  const where = searchTerm
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
    : undefined;

  const orderByClause =
    orderBy === "partno"
      ? [{ partno: "asc" as const }]
      : [{ description: "asc" as const }, { partno: "asc" as const }];

  const [parts, total] = await prisma.$transaction([
    prisma.parts.findMany({
      where,
      orderBy: orderByClause,
      skip,
      take,
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
    prisma.parts.count({ where }),
  ]);

  return {
    parts,
    total,
    skip,
    take,
    orderBy,
  };
}