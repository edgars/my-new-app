export async function updateParts(
  partNo: number,
  qty: number
): Promise<void> {
  // TODO(rnc): verify that `partNo` maps to the correct unique field on Nextcust (e.g. partNumber or id),
  // that `qty` is the field being updated (e.g. newcust quantity stock), confirm whether qty should
  // increment/decrement existing value or replace it, and validate any business constraints
  // (e.g. qty must not go negative, partNo must exist before update).

  await prisma.$transaction(async (tx) => {
    const existing = await tx.nextcust.findFirst({
      where: {
        partNo: partNo,
      },
    });

    if (!existing) {
      throw new Error(`Nextcust record with partNo ${partNo} not found`);
    }

    await tx.nextcust.update({
      where: {
        id: existing.id,
      },
      data: {
        newcust: existing.newcust + qty,
      },
    });
  });
}