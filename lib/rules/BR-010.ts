export async function activatePartsQuery(
  isFiltered: boolean,
  fromDate?: Date,
  toDate?: Date
) {
  // TODO(rnc): verify that the date range filter maps to the correct Parts field
  // (e.g. createdAt, updatedAt, or a domain-specific date column), confirm that
  // the "no matching records" fallback behaviour (returning all parts) is the
  // intended UX, and ensure the caller handles the { filtered: false } signal
  // to reset any active query/filter state in the UI.

  if (!isFiltered) {
    const parts = await prisma.parts.findMany({
      orderBy: { partno: "asc" },
    });
    return { filtered: false, parts };
  }

  if (!fromDate || !toDate) {
    throw new Error("fromDate and toDate are required when filtering is active.");
  }

  const parts = await prisma.parts.findMany({
    where: {
      // TODO(rnc): replace `createdAt` with the actual date field used for
      // customer-order date range filtering once the domain field is confirmed.
      createdAt: {
        gte: fromDate,
        lte: toDate,
      },
    },
    orderBy: { partno: "asc" },
  });

  if (parts.length === 0) {
    // Mirror the Delphi behaviour: fall back to the full dataset and signal
    // the caller to deactivate the filter toggle.
    const allParts = await prisma.parts.findMany({
      orderBy: { partno: "asc" },
    });
    return {
      filtered: false,
      parts: allParts,
      message: "No matching records in the specified date range.",
    };
  }

  return { filtered: true, parts };
}