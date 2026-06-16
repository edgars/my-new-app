export async function activatePartsQuery(
  isFiltered: boolean,
  fromDate?: Date,
  toDate?: Date
) {
  // TODO(rnc): verify that the date range filter maps to the correct Parts field
  // (e.g. createdAt, updatedAt, or a domain-specific date column), confirm that
  // the fallback behaviour (returning all parts) is acceptable when no records
  // are found, and ensure the calling UI resets the "filtered" toggle on empty results.

  if (!isFiltered) {
    const parts = await prisma.parts.findMany({
      orderBy: { partno: "asc" },
    });
    return { parts, filtered: false };
  }

  if (!fromDate || !toDate) {
    throw new Error("fromDate and toDate are required when filtering is active.");
  }

  const parts = await prisma.parts.findMany({
    where: {
      // TODO(rnc): replace `createdAt` with whichever date field drives the query filter
      createdAt: {
        gte: fromDate,
        lte: toDate,
      },
    },
    orderBy: { partno: "asc" },
  });

  if (parts.length === 0) {
    // Mirror the Delphi behaviour: fall back to the full dataset and signal the
    // caller to reset the filter toggle, rather than returning an empty result.
    const allParts = await prisma.parts.findMany({
      orderBy: { partno: "asc" },
    });
    return {
      parts: allParts,
      filtered: false,
      message: "No matching records in the specified date range.",
    };
  }

  return { parts, filtered: true };
}