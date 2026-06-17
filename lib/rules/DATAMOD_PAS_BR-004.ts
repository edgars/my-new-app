async function handleNextcustUseLocalData(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that the legacy BDE/Paradox alias resolution logic (DBDEMOS session alias check,
  // DataDirectory path resolution, ORDERS.DB file existence guard, and AddStandardAlias fallback)
  // has been correctly mapped to the Prisma datasource/connection string configuration for Nextcust,
  // and that the newcust field is populated consistently with what SetDatabaseAlias('DBDEMOS') previously provided.

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Resolve the equivalent of the DBDEMOS alias — confirm the Prisma
      // DATABASE_URL env var points to the correct migrated data source.
      const dataSourceCheck = await tx.nextcust.findFirst({
        select: { newcust: true },
      });

      if (!dataSourceCheck) {
        throw new Error(
          'Cannot locate data source for Nextcust — equivalent of missing ORDERS.DB or unresolved DBDEMOS alias.'
        );
      }

      // Apply the UseLocalData business rule: ensure newcust reflects
      // the locally resolved data directory / alias binding.
      const updatedNextcust = await tx.nextcust.updateMany({
        where: {
          newcust: null,
        },
        data: {
          newcust: 'DBDEMOS', // TODO(rnc): replace with the actual resolved local data identifier
        },
      });

      return updatedNextcust;
    });

    res.status(200).json({
      success: true,
      message: 'UseLocalData procedure applied successfully.',
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      success: false,
      message,
    });
  }
}