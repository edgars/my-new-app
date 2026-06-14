async function handleTBrPartsFormFormShow() {
  // TODO(rnc): verify that opening the parts form triggers proper data loading and validation
  // Ensure all required parts data is available and accessible to the form
  
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
    console.error('Error in TBrPartsForm.FormShow:', error);
    return {
      success: false,
      error: 'Failed to load parts data'
    };
  }
}