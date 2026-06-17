export async function calcNextcustPartsFields(nextcustId: string) {
  // TODO(rnc): verify that `newcust` maps correctly to the Nextcust entity, and confirm
  // that PartsOnOrder, PartsOnHand, and PartsBackOrd are actual fields on the Nextcust
  // model in schema.prisma (names may differ from the Delphi DataSet field names);
  // also confirm whether PartsBackOrd should be a Boolean column or some other type.

  return await prisma.$transaction(async (tx) => {
    const record = await tx.nextcust.findUniqueOrThrow({
      where: { id: nextcustId },
      select: {
        id: true,
        partsOnOrder: true,
        partsOnHand: true,
      },
    });

    const partsBackOrd = record.partsOnOrder > record.partsOnHand;

    const updated = await tx.nextcust.update({
      where: { id: nextcustId },
      data: {
        partsBackOrd,
      },
    });

    return updated;
  });
}