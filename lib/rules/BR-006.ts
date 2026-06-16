// TODO(rnc): verify that the Parts table exists in Prisma schema with fields: partno, description,
// onhand, onorder, vendorno, cost, listprice, backord; confirm default sort order (description vs partno)
// matches legacy Delphi OrderCombo default (index 0 = 'Description'); confirm pagination limits are acceptable;
// verify that the caller handles the returned part selection appropriately.

export async function searchPartsModal(
  orderBy: "description" | "partno" = "description",
  searchTerm?: string,
  page: number = 1,
  pageSize: number = 50
): Promise<{
  parts: Array<{
    partno: string;
    description: string | null;
    onhand: number | null;
    onorder: number | null;
    vendorno: string | null;
    cost: number | null;
    listprice: number | null;
    backord: number | null;
  }>;
  total: number;
  page: number;
  pageSize: number;
  orderBy: "description" | "partno";
  sortOptions: string[];
}> {
  const sortOptions = ["description", "partno"];

  const validOrderBy =
    orderBy === "partno" ? "partno" : "description";

  const whereClause =
    searchTerm && searchTerm.trim() !== ""
      ? {
          OR: [
            {
              description: {
                contains: searchTerm.trim(),
                mode: "insensitive" as const,
              },
            },
            {
              partno: {
                contains: searchTerm.trim(),
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

  const skip = (page - 1) * pageSize;

  const [parts, total] = await prisma.$transaction([
    prisma.parts.findMany({
      where: whereClause,
      orderBy: {
        [validOrderBy]: "asc",
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
      skip,
      take: pageSize,
    }),
    prisma.parts.count({
      where: whereClause,
    }),
  ]);

  return {
    parts,
    total,
    page,
    pageSize,
    orderBy: validOrderBy,
    sortOptions,
  };
}