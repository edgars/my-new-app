// TODO(rnc): verify that the Parts table exists in the Prisma schema with fields: partno, description,
// onhand, onorder, vendorno, cost, listprice, backord; confirm default sort order (description vs partno)
// matches legacy Delphi OrderCombo default (index 0 = 'Description'); confirm pagination requirements
// and whether all fields should be returned or a subset for the search dialog.

export async function searchParts(
  orderBy: "description" | "partno" = "description",
  searchTerm?: string
): Promise<{
  parts: {
    partno: string;
    description: string;
    onhand: number;
    onorder: number;
    vendorno: string;
    cost: number;
    listprice: number;
    backord: number;
  }[];
  orderOptions: string[];
  defaultOrder: string;
}> {
  const orderOptions = ["Description", "PartNo"];
  const defaultOrder = "Description";

  const whereClause =
    searchTerm && searchTerm.trim() !== ""
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

  const orderByClause =
    orderBy === "partno"
      ? { partno: "asc" as const }
      : { description: "asc" as const };

  const parts = await prisma.parts.findMany({
    where: whereClause,
    orderBy: orderByClause,
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

  return {
    parts,
    orderOptions,
    defaultOrder,
  };
}