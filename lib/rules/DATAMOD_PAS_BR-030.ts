async function handleNextcustAfterPost(
  prisma: PrismaClient,
  data: { newcust?: string | null; [key: string]: unknown },
  id?: string | number
) {
  // TODO(rnc): verify the original TMastData.ItemsAfterPost Delphi procedure logic —
  // confirm what post-write side effects, cascading updates, or related record
  // synchronisation were performed after saving a Nextcust/newcust record,
  // and ensure all affected tables/fields are reflected in the Prisma writes below.

  const result = await prisma.$transaction(async (tx) => {
    let nextcustRecord;

    if (id) {
      nextcustRecord = await tx.nextcust.update({
        where: { id: Number(id) },
        data: {
          newcust: data.newcust ?? null,
          updatedAt: new Date(),
        },
      });
    } else {
      nextcustRecord = await tx.nextcust.create({
        data: {
          newcust: data.newcust ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // TODO(rnc): replace or extend the block below with the actual after-post
    // business logic derived from TMastData.ItemsAfterPost — e.g. updating a
    // master record, recalculating aggregates, writing an audit row, or
    // triggering status changes on related entities.
    const afterPostSideEffect = await tx.nextcust.findUnique({
      where: { id: nextcustRecord.id },
    });

    if (!afterPostSideEffect) {
      throw new Error(
        `Nextcust record with id ${nextcustRecord.id} not found after post`
      );
    }

    // TODO(rnc): if ItemsAfterPost updated a parent/master dataset (e.g. MastData),
    // add the corresponding tx.mastData.update(...) call here using the
    // foreign-key linking Nextcust to its master record.

    return nextcustRecord;
  });

  return result;
}