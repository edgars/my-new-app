async function handleTBrPartsFormFormShow() {
  // TODO(rnc): verify that opening the parts form triggers proper data loading and validation
  try {
    const allParts = await prisma.parts.findMany({
      select: {
        partno: true,
        description: true,
        onhand: true,
        onorder: true,
        vendorno: true,
        cost: true,
        listprice: true,
        backord: true
      }
    });
    
    return {
      success: true,
      parts: allParts
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to load parts data'
    };
  }
}