async function TMastData_OrdersBeforeClose() {
  // TODO(rnc): verify that closing these datasets/orders prevents new orders from being created
  // and ensures all pending orders are properly processed before system close
  
  const prisma = new PrismaClient();
  
  return await prisma.$transaction(async (tx) => {
    // Close/lock orders data to prevent new modifications
    await tx.order.updateMany({
      where: { 
        status: 'PENDING'
      },
      data: { 
        status: 'CLOSED',
        updatedAt: new Date()
      }
    });
    
    // Close/lock items related to orders
    await tx.item.updateMany({
      where: {
        orderId: {
          not: null
        },
        status: 'AVAILABLE'
      },
      data: {
        status: 'ORDER_CLOSED',
        updatedAt: new Date()
      }
    });
    
    // Close/lock employee access to order creation during close process
    await tx.employee.updateMany({
      where: {
        canCreateOrders: true,
        active: true
      },
      data: {
        canCreateOrders: false,
        updatedAt: new Date()
      }
    });
    
    // Close/lock customer order access
    await tx.customer.updateMany({
      where: {
        hasOpenOrders: true
      },
      data: {
        hasOpenOrders: false,
        updatedAt: new Date()
      }
    });
  });
}