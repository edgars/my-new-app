async function handlePartsActivateQuery(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that the activate button state determines whether to use base parts dataset or query results
  const { activateBtnDown } = req.body;
  
  if (!activateBtnDown) {
    // Use standard parts dataset
    const parts = await prisma.parts.findMany();
    return res.status(200).json(parts);
  } else {
    // Attempt to use query-based dataset
    try {
      // In Prisma context, this would be a filtered/queried result
      // The original Delphi code suggests there's a PartsQuery object that gets opened
      // For Next.js + Prisma, we'd typically have a specific query method
      const queryResults = await prisma.parts.findMany({
        where: {
          // Apply any active filters that would correspond to the query
          // This is placeholder - actual query logic depends on what PartsQuery represents
        }
      });
      
      return res.status(200).json(queryResults);
    } catch (error) {
      // Fallback to standard parts dataset if query fails
      const fallbackParts = await prisma.parts.findMany();
      return res.status(200).json(fallbackParts);
    }
  }
}