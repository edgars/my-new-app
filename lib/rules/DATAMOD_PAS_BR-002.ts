export async function getDataDirectory(): Promise<string> {
  // TODO(rnc): verify that the data directory resolution logic (originally navigating two levels up
  // from the executable path to a \DATA\ folder) maps correctly to the Next.js deployment
  // environment — confirm the resolved path is accessible at runtime (serverless vs. traditional
  // server), that process.cwd() or __dirname is the right anchor point, and that the resulting
  // directory exists and has appropriate read/write permissions for Nextcust/newcust data files.

  const path = await import("path");

  const executableDir = process.cwd();

  const dataDirectory = path.resolve(executableDir, "..", "..", "DATA");

  return dataDirectory + path.sep;
}

export async function handleNextcustDataDirectory(
  nextcustId: string
): Promise<{ nextcustId: string; newcust: string; dataDirectory: string }> {
  // TODO(rnc): verify that storing or associating the resolved dataDirectory with the Nextcust
  // record via the newcust field is the intended behavior — confirm field type, max length,
  // and whether this path should be persisted to the database or only used transiently at runtime.

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  try {
    const dataDirectory = await getDataDirectory();

    const updatedNextcust = await prisma.$transaction(async (tx) => {
      const existing = await tx.nextcust.findUnique({
        where: { id: nextcustId },
      });

      if (!existing) {
        throw new Error(`Nextcust record not found for id: ${nextcustId}`);
      }

      const updated = await tx.nextcust.update({
        where: { id: nextcustId },
        data: {
          newcust: dataDirectory,
        },
      });

      return updated;
    });

    return {
      nextcustId: updatedNextcust.id,
      newcust: updatedNextcust.newcust,
      dataDirectory,
    };
  } finally {
    await prisma.$disconnect();
  }
}