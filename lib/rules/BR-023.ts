export async function handleOrdersBeforeInsert(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that this handler properly validates order state before insertion,
  // confirms user intent when an existing order is being edited, and handles the item numbering sequence correctly
  
  const { orderId, userId } = req.body;
  
  try {
    await prisma.$transaction(async (tx) => {
      // Check if there's an existing order being processed by this user
      const existingOrder = await tx.order.findFirst({
        where: {
          userId: userId,
          status: 'PROCESSING'
        }
      });
      
      if (existingOrder) {
        // In the original logic this would prompt user confirmation
        // Here we'll require explicit handling of the existing order first
        throw new Error('Existing order in progress. Complete or cancel it before starting a new one.');
      }
      
      // Set initial item number to 1 as per original logic
      const newOrder = await tx.order.create({
        data: {
          id: orderId,
          userId: userId,
          status: 'PROCESSING',
          itemNo: 1
        }
      });
      
      return newOrder;
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}