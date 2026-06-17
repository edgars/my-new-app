export async function editNextcust(partNo: number): Promise<Nextcust | null> {
  // TODO(rnc): verify that 'partNo' maps correctly to the Nextcust.newcust field (or a dedicated
  // partNo field), that the Locate semantics (find-by-value, case-sensitive, exact match) are
  // faithfully reproduced by the Prisma findFirst below, and that no additional fields from the
  // original TEdPartsForm dataset need to be fetched or mutated as part of the Edit procedure.

  const record = await prisma.nextcust.findFirst({
    where: {
      newcust: partNo,
    },
  });

  if (!record) {
    return null;
  }

  return record;
}