export async function activatePartsQuery(
  isFiltered: boolean,
  fromDate?: Date,
  toDate?: Date
) {
  // TODO(rnc): verify that the date range filter maps to the correct Parts field (e.g., a receivedAt or orderedAt timestamp),
  // confirm that "no matching records" should throw vs. return an empty indicator,
  // and ensure the fallback-to-full-list behaviour is acceptable for the Parts entity in this context.

  if (!isFiltered) {
    const parts = await prisma.parts.findMany({
      orderBy: { partno: "asc" },
    });
    return { filtered: false, parts };
  }

  if (!fromDate || !toDate) {
    throw new Error("fromDate and toDate are required when filter is active.");
  }

  const parts = await prisma.parts.findMany({
    where: {
      // TODO(rnc): replace `createdAt` with whichever date field on Parts
      // corresponds to the original query's date range parameter (e.g., orderedAt, receivedAt).
      createdAt: {
        gte: fromDate,
        lte: toDate,
      },
    },
    orderBy: { partno: "asc" },
  });

  if (parts.length === 0) {
    // Mirror the original: fall back to unfiltered list and surface a message to the caller.
    const fallbackParts = await prisma.parts.findMany({
      orderBy: { partno: "asc" },
    });
    return {
      filtered: false,
      parts: fallbackParts,
      warning: "No matching records in the specified date range.",
    };
  }

  return { filtered: true, parts };
}