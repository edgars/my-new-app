export async function ordersAfterCancel(nextcustId: string): Promise<void> {
  // TODO(rnc): verify that canceling updates for Cust, Parts, Items, and Orders
  // means discarding all pending/unsaved changes for the given Nextcust record
  // and its related Parts, Items, and Orders — confirm no partial rollback
  // semantics are needed and that a full discard of in-flight changes is correct.

  await prisma.$transaction(async (tx) => {
    // Cancel (revert) pending newcust changes on the Nextcust record
    await tx.nextcust.update({
      where: { id: nextcustId },
      data: {
        newcust: false,
      },
    });

    // Cancel pending updates on related Parts
    await tx.part.updateMany({
      where: { nextcustId },
      data: {
        pendingUpdate: false,
      },
    });

    // Cancel pending updates on related Items
    await tx.item.updateMany({
      where: { nextcustId },
      data: {
        pendingUpdate: false,
      },
    });

    // Cancel pending updates on related Orders
    await tx.order.updateMany({
      where: { nextcustId },
      data: {
        pendingUpdate: false,
      },
    });
  });
}