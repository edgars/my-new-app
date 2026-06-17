async function partsQueryCalcFields(partId: string) {
  // TODO(rnc): verify that backord should be calculated as (onorder > onhand) and persisted to DB,
  // vs. being computed at read time only — original Delphi code sets this as a calculated field
  // on the dataset, not a stored value; confirm whether writes back to DB are intended here.

  const part = await prisma.parts.findUniqueOrThrow({
    where: { id: partId },
    select: {
      id: true,
      partno: true,
      onhand: true,
      onorder: true,
    },
  });

  const backord = part.onorder > part.onhand;

  const updated = await prisma.parts.update({
    where: { id: partId },
    data: {
      backord,
    },
  });

  return updated;
}