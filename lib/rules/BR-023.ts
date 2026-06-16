export async function handleOrdersBeforeInsert(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that this handler properly validates order state before insertion,
  // confirms user intent when an existing order is being edited, and handles the item numbering logic
  
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
        // In the original Pascal code, this would show a confirmation dialog
        // Here we assume the frontend has already confirmed with the user
        // If not confirmed, the request shouldn't reach this point
        
        // Update the existing order to complete it if needed
        await tx.order.update({
          where: { id: existingOrder.id },
          data: { 
            status: 'COMPLETED',
            updatedAt: new Date()
          }
        });
      }
      
      // Set the starting item number for the new order
      // This mimics the FItemNo := 1 assignment from the original code
      const newOrder = await tx.order.create({
        data: {
          userId: userId,
          status: 'PROCESSING',
          currentItemNo: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      return newOrder;
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in OrdersBeforeInsert:', error);
    res.status(500).json({ error: 'Failed to process order insertion' });
  }
}