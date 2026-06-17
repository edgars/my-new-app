export async function setPartNo(newPartNo: number): Promise<Nextcust | null> {
  // TODO(rnc): verify that locating a Nextcust record by newcust (mapped from PartNo) is the correct
  // lookup field, that the field type (Float/Double -> number) is handled correctly by Prisma,
  // and that no additional dataset switching logic (MastData.PartsSource.Dataset := MastData.Parts)
  // needs to be replicated server-side (e.g. switching active data source or view).

  const record = await prisma.nextcust.findFirst({
    where: {
      newcust: newPartNo,
    },
  });

  return record ?? null;
}