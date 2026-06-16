export async function activatePartsQuery(
  isFiltered: boolean,
  fromDate?: Date,
  toDate?: Date
) {
  // TODO(rnc): verify that the date range filter maps to the correct Parts field (e.g., createdAt, updatedAt, or a dedicated order/backorder date), confirm that "no matching records" should throw vs. return empty, and ensure the fallback-to-full-list behaviour is acceptable for the Parts entity in this context.

  if (!isFiltered) {
    const parts = await prisma.parts.findMany({
      orderBy: { partno: "asc" },
    });
    return { filtered: false, parts };
  }

  if (!fromDate || !toDate) {
    throw new Error("fromDate and toDate are required when filter is active.");
  }

  let parts: Awaited<ReturnType<typeof prisma.parts.findMany>>;

  try {
    parts = await prisma.parts.findMany({
      where: {
        // TODO(rnc): replace `createdAt` with the actual date field relevant to the query intent (e.g., order date, backorder date)
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
      orderBy: { partno: "asc" },
    });
  } catch (error) {
    // On query failure fall back to full unfiltered list, mirroring the
    // original Delphi except-block behaviour.
    const fallbackParts = await prisma.parts.findMany({
      orderBy: { partno: "asc" },
    });
    return {
      filtered: false,
      fallback: true,
      message: "Query failed; returning all parts.",
      parts: fallbackParts,
    };
  }

  // Mirror the Delphi `if BOF and EOF then Abort` — no records is treated as
  // an exceptional condition when the filter is active.
  if (parts.length === 0) {
    // Fall back to full list and signal the caller, matching the original
    // ShowMessage + ActivateBtn.Down := false behaviour.
    const fallbackParts = await prisma.parts.findMany({
      orderBy: { partno: "asc" },
    });
    return {
      filtered: false,
      fallback: true,
      message: "No matching records in the specified date range.",
      parts: fallbackParts,
    };
  }

  return { filtered: true, fallback: false, parts };
}