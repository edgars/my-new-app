export async function setPartNoHandler(newPartNo: number) {
  // TODO(rnc): verify that the part number exists in the Parts table and that the locate operation successfully finds the record
  const prisma = new PrismaClient();
  
  try {
    const foundPart = await prisma.parts.findFirst({
      where: {
        partno: newPartNo
      }
    });
    
    if (!foundPart) {
      throw new Error(`Part with PartNo ${newPartNo} not found`);
    }
    
    return {
      success: true,
      part: foundPart
    };
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}