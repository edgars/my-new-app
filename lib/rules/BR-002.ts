async function setPartNo(newPartNo: number) {
  // TODO(rnc): verify that the part number exists in the parts table and that the transaction properly updates the dataset reference
  return await prisma.$transaction(async (tx) => {
    const part = await tx.part.findUnique({
      where: { partno: newPartNo }
    });

    if (!part) {
      throw new Error(`Part with PartNo ${newPartNo} not found`);
    }

    // This mimics setting the dataset to the parts source and locating the record
    // In Prisma context, we just return the located part since there's no direct equivalent
    // to Delphi's dataset navigation
    return part;
  });
}