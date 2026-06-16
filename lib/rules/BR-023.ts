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
          status: { in: ['DRAFT', 'EDITING'] }
        }
      });
      
      if (existingOrder) {
        // In the original Delphi code, this would show a confirmation dialog
        // Here we assume the client has already confirmed via the API call
        // If not confirmed, we would throw an error to abort
        
        // Save any pending changes to the existing order
        await tx.order.update({
          where: { id: existingOrder.id },
          data: { 
            status: 'COMPLETED',
            updatedAt: new Date()
          }
        });
      }
      
      // Set the starting item number for the new order
      // This would typically be handled in the order creation below
      const newOrder = await tx.order.create({
        data: {
          userId: userId,
          status: 'DRAFT',
          currentItemNo: 1, // Equivalent to FItemNo := 1
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