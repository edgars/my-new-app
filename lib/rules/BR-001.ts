async function getPartNo(partId: number) {
  // TODO(rnc): verify that the part record exists and has a valid partno field value
  const part = await prisma.parts.findUnique({
    where: { id: partId },
    select: { partno: true }
  });
  
  if (!part) {
    throw new Error(`Part with id ${partId} not found`);
  }
  
  return Number(part.partno);
}