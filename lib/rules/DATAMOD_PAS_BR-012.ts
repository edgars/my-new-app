export async function calcNextcustFields(id: string) {
  // TODO(rnc): verify that `newcust` is the correct field to store the BackOrd boolean,
  // and confirm that `partsOnOrder` and `partsOnHand` are the correct Prisma field names
  // on the Nextcust model that map to PartsOnOrder and PartsOnHand from TMastData.PartsQueryCalcFields.
  // Also verify whether this calc should run on read (computed) or be persisted on write.

  const record = await prisma.nextcust.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      partsOnOrder: true,
      partsOnHand: true,
    },
  });

  const backOrd = record.partsOnOrder > record.partsOnHand;

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.nextcust.update({
      where: { id },
      data: {
        newcust: backOrd,
      },
    });

    return updated;
  });
}