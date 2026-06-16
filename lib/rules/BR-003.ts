async function handlePartsActivateQuery() {
  // TODO(rnc): verify that the activate button state determines whether to use base parts dataset or query results
  try {
    const parts = await prisma.parts.findMany({
      where: {
        // Default to all parts when activate button is down (inactive)
        // This matches the original logic where ActivateBtn.Down means use MastData.Parts
      },
      orderBy: [
        { partno: 'asc' }
      ]
    });

    return {
      success: true,
      data: parts,
      datasetType: 'parts'
    };
  } catch (error) {
    console.error('Error in parts activate query:', error);
    return {
      success: false,
      error: 'Failed to retrieve parts data',
      datasetType: 'parts'
    };
  }
}