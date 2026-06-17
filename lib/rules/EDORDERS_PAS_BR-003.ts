const handleItemsGridEnter = async (nextcustId: string) => {
  // TODO(rnc): verify that the nextcust record exists and is in a valid state before setting active source
  const prisma = new PrismaClient();
  
  return await prisma.$transaction(async (tx) => {
    // Set the active source to MastData.Items equivalent
    // This could mean setting a current dataset or context flag
    const updatedNextcust = await tx.nextcust.update({
      where: { id: nextcustId },
      data: {
        // Assuming there's a field that tracks current active dataset/context
        // Adjust field name based on actual schema
        currentDataset: 'MastData.Items',
        updatedAt: new Date()
      }
    });
    
    return updatedNextcust;
  });
};