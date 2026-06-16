async function TMastData_OrdersBeforeOpen() {
  // TODO(rnc): verify that opening these datasets establishes proper read locks and that concurrent access won't cause race conditions
  const prisma = new PrismaClient();
  
  try {
    await prisma.$transaction(async (tx) => {
      // Open/ensure related datasets are accessible before order processing
      await tx.customer.findMany({
        select: { id: true },
        take: 1 // Verify table accessibility
      });
      
      await tx.customerOrder.findMany({
        select: { id: true },
        take: 1 // Verify table accessibility  
      });
      
      await tx.employee.findMany({
        select: { id: true },
        take: 1 // Verify table accessibility
      });
      
      await tx.part.findMany({
        select: { id: true },
        take: 1 // Verify table accessibility
      });
    });
  } finally {
    await prisma.$disconnect();
  }
}