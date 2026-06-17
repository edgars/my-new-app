async function getPartNo(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that the first field (index 0) of the Nextcust dataset maps to `newcust` in Prisma schema, and that returning it as a float/number is the correct type for downstream consumers

  try {
    const result = await prisma.$transaction(async (tx) => {
      const record = await tx.nextcust.findFirst({
        select: {
          newcust: true,
        },
        orderBy: {
          newcust: 'asc',
        },
      });

      if (!record) {
        throw new Error('No Nextcust record found');
      }

      const partNo: number = parseFloat(String(record.newcust));

      if (isNaN(partNo)) {
        throw new Error(`newcust value "${record.newcust}" cannot be converted to a float`);
      }

      return partNo;
    });

    return res.status(200).json({ partNo: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}