async function ordersBeforeClose(
  prisma: PrismaClient,
  datasetId: string
): Promise<void> {
  // TODO(rnc): verify that "closing" Items, Emps, and CustByOrd datasets maps correctly to
  // the intended server-side behavior here — the original Delphi procedure closes three
  // TDataSet cursors (Items, Emps, CustByOrd) which is a UI/data-module concern; confirm
  // whether this should archive, soft-delete, or simply dissociate these related records
  // from the Nextcust/newcust entity before the close operation, and that cascade rules
  // in the Prisma schema match the original dataset relationships.

  await prisma.$transaction(async (tx) => {
    const nextcust = await tx.nextcust.findUnique({
      where: { id: datasetId },
      select: { id: true, newcust: true },
    });

    if (!nextcust) {
      throw new Error(`Nextcust record not found for id: ${datasetId}`);
    }

    // Close Items — dissociate/nullify items linked to this customer order context
    await tx.items.updateMany({
      where: { nextcustId: nextcust.id },
      data: { closed: true, closedAt: new Date() },
    });

    // Close Emps — dissociate/nullify employees linked to this customer order context
    await tx.emps.updateMany({
      where: { nextcustId: nextcust.id },
      data: { closed: true, closedAt: new Date() },
    });

    // Close CustByOrd — dissociate/nullify customer-by-order records linked to this context
    await tx.custByOrd.updateMany({
      where: { nextcustId: nextcust.id },
      data: { closed: true, closedAt: new Date() },
    });

    // Mark the Nextcust record itself as having completed the before-close procedure
    await tx.nextcust.update({
      where: { id: nextcust.id },
      data: {
        newcust: false,
        updatedAt: new Date(),
      },
    });
  });
}