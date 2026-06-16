async function handlePartsActivateQuery(userId: string) {
  // TODO(rnc): verify that user has permission to access parts data and that the activate button state is properly synchronized
  return await prisma.$transaction(async (tx) => {
    // This appears to be a query activation procedure that switches between
    // default parts dataset and a filtered/query dataset based on some condition
    // Since we don't have explicit button state in the request, we'll return
    // the base parts data as the default case (when ActivateBtn.Down is false)
    
    const parts = await tx.part.findMany({
      orderBy: {
        partno: 'asc'
      }
    });
    
    return {
      datasetType: 'parts',
      parts: parts,
      activated: false
    };
  });
}