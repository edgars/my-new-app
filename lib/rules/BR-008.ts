async function handleTBrPartsFormFormShow() {
  // TODO(rnc): verify that opening the parts form triggers data loading and that all parts records are accessible
  try {
    const parts = await prisma.parts.findMany({
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
      parts: parts
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to load parts data'
    };
  }
}