async function useRemoteData(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that MASTSQL connection string / database URL is correctly configured
  // in environment variables (e.g. DATABASE_URL), that the remote data source is reachable,
  // that credentials (equivalent to SYSDBA) are properly secured, and that the alias/connection
  // switching logic maps correctly to the Prisma datasource for Nextcust.newcust writes.

  const remoteDataUrl = process.env.MASTSQL_DATABASE_URL;
  const dataDirectory = process.env.DATA_DIRECTORY ?? "";
  const dataFile = `${dataDirectory}MASTSQL.GDB`;

  if (!remoteDataUrl) {
    return res.status(500).json({
      error: `Cannot locate remote data source: MASTSQL.GDB. Ensure MASTSQL_DATABASE_URL is set and the file exists at ${dataFile}`,
    });
  }

  const remotePrisma = new PrismaClient({
    datasources: {
      db: {
        url: remoteDataUrl,
      },
    },
  });

  try {
    await remotePrisma.$connect();

    const result = await remotePrisma.$transaction(async (tx) => {
      // Fetch remote newcust data from the MASTSQL source
      const remoteRecords = await tx.nextcust.findMany({
        select: {
          newcust: true,
        },
      });

      if (!remoteRecords || remoteRecords.length === 0) {
        throw new Error("No remote Nextcust records found in MASTSQL data source.");
      }

      // Upsert each remote record into the local/primary database
      const upsertedRecords = await Promise.all(
        remoteRecords.map((record) =>
          tx.nextcust.upsert({
            where: {
              newcust: record.newcust,
            },
            update: {
              newcust: record.newcust,
            },
            create: {
              newcust: record.newcust,
            },
          })
        )
      );

      return upsertedRecords;
    });

    return res.status(200).json({
      success: true,
      message: "Remote data alias MASTSQL resolved and data synchronized successfully.",
      data: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error during remote data sync.";
    return res.status(500).json({
      success: false,
      error: message,
    });
  } finally {
    await remotePrisma.$disconnect();
  }
}