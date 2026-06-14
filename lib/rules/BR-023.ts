export async function handleOrdersBeforeInsert(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that this handler properly validates order state before insertion,
  // confirms user intent when an existing order is being edited, and handles the item numbering logic
  
  const { orderId, userId } = req.body;
  
  try {
    await prisma.$transaction(async (tx) => {
      // Check if there's an existing order being edited by this user
      const existingOrder = await tx.order.findFirst({
        where: {
          userId: userId,
          status: 'DRAFT' // assuming draft means being edited
        }
      });
      
      if (existingOrder) {
        // In the original Delphi code, this would show a confirmation dialog
        // Here we assume the client has already confirmed via the request
        if (!req.body.confirmSave) {
          return res.status(400).json({ error: 'User aborted order save' });
        }
        
        // Save the existing order
        await tx.order.update({
          where: { id: existingOrder.id },
          data: { 
            status: 'SAVED',
            updatedAt: new Date()
          }
        });
      }
      
      // Create new order with item number reset to 1
      const newOrder = await tx.order.create({
        data: {
          userId: userId,
          status: 'DRAFT',
          itemNo: 1, // Reset item number as per original logic
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      return res.status(200).json({ orderId: newOrder.id, itemNo: 1 });
    });
  } catch (error) {
    console.error('Error in OrdersBeforeInsert:', error);
    return res.status(500).json({ error: 'Failed to process order insertion' });
  }
}