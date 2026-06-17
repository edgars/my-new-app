export async function activateQuery(
  req: NextApiRequest,
  res: NextApiResponse,
  activateBtnDown: boolean
) {
  // TODO(rnc): verify that the toggle between full Parts table and filtered PartsQuery
  // behaves correctly — confirm the query parameters/filters applied to PartsQuery match
  // the original Delphi PartsQuery SQL, and that falling back to the full Parts dataset
  // on query failure is the intended UX for error cases.

  try {
    await prisma.$transaction(async (tx) => {
      let parts: Nextcust[];

      if (!activateBtnDown) {
        parts = await tx.nextcust.findMany({
          where: { newcust: false },
        });

        return res.status(200).json({
          source: "parts",
          data: parts,
        });
      }

      try {
        parts = await tx.nextcust.findMany({
          where: { newcust: true },
        });

        return res.status(200).json({
          source: "partsQuery",
          data: parts,
        });
      } catch (queryError) {
        const fallbackParts = await tx.nextcust.findMany({
          where: { newcust: false },
        });

        res.status(200).json({
          source: "parts",
          data: fallbackParts,
          warning: "PartsQuery failed, fell back to full Parts dataset",
        });

        throw queryError;
      }
    });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        error: "Failed to activate query",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
}