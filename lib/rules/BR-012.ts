async function updatePartsBackordField(partId: string) {
  // TODO(rnc): verify that the part record exists and that onorder/onhand fields are properly updated before calculating backord flag
  return await prisma.$transaction(async (tx) => {
    const part = await tx.parts.findUnique({
      where: { id: partId },
      select: { onorder: true, onhand: true }
    });

    if (!part) {
      throw new Error(`Part with id ${partId} not found`);
    }

    const backord = part.onorder > part.onhand;

    return await tx.parts.update({
      where: { id: partId },
      data: { backord }
    });
  });
}