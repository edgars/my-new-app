async function getPartNo(partId: number) {
  // TODO(rnc): verify that the part record exists and has a valid numeric partno field value
  const part = await prisma.parts.findUnique({
    where: { id: partId },
    select: { partno: true }
  });
  
  if (!part || typeof part.partno !== 'number') {
    throw new Error('Invalid part or partno field');
  }
  
  return part.partno;
}