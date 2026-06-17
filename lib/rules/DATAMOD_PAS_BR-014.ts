async function handleNextcustOrdersAfterDelete(
  nextcustId: string,
  prisma: PrismaClient
): Promise<void> {
  // TODO(rnc): verify that the deletion cascade order (Cust -> Parts -> Items -> Orders) matches
  // the original Delphi ApplyUpdates sequence, confirm referential integrity constraints allow
  // this order, and ensure no additional business logic exists inside each dataset's BeforeDelete
  // or AfterDelete events that must be ported separately.

  await prisma.$transaction(async (tx) => {
    await tx.order.deleteMany({
      where: {
        nextcust: {
          newcust: nextcustId,
        },
      },
    });

    await tx.item.deleteMany({
      where: {
        nextcust: {
          newcust: nextcustId,
        },
      },
    });

    await tx.part.deleteMany({
      where: {
        nextcust: {
          newcust: nextcustId,
        },
      },
    });

    await tx.nextcust.delete({
      where: {
        newcust: nextcustId,
      },
    });
  });
}