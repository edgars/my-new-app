async function handleNextcustAfterDelete(
  prisma: PrismaClient,
  nextcustId: string
): Promise<void> {
  // TODO(rnc): verify that UpdateTotals recalculates all aggregate/summary fields
  // on the parent or related entity after a Nextcust record is deleted — confirm
  // which totals fields are affected, which table they live on, and whether any
  // additional cascade logic exists inside UpdateTotals beyond what is modelled here.

  await prisma.$transaction(async (tx) => {
    const deleted = await tx.nextcust.findUnique({
      where: { id: nextcustId },
    });

    if (!deleted) {
      throw new Error(`Nextcust record with id ${nextcustId} not found`);
    }

    await tx.nextcust.delete({
      where: { id: nextcustId },
    });

    const aggregates = await tx.nextcust.aggregate({
      _sum: {
        newcust: true,
      },
    });

    const totalNewcust = aggregates._sum.newcust ?? 0;

    await tx.nextcust.updateMany({
      data: {
        newcust: totalNewcust,
      },
      where: {
        isSummaryRecord: true,
      },
    });
  });
}