async function TMastData_OrdersBeforeOpen() {
  // TODO(rnc): verify that opening these datasets establishes proper read locks and that concurrent access won't cause race conditions
  const prisma = new PrismaClient();
  
  try {
    await prisma.$transaction(async (tx) => {
      // Open/ensure availability of required datasets in proper order
      await tx.customer.findMany({
        select: { id: true },
        take: 1 // Just verify accessibility
      });
      
      await tx.customerOrder.findMany({
        select: { id: true },
        take: 1
      });
      
      await tx.customer.findMany({
        select: { id: true },
        take: 1
      });
      
      await tx.employee.findMany({
        select: { id: true },
        take: 1
      });
      
      await tx.part.findMany({
        select: { id: true },
        take: 1
      });
    });
  } finally {
    await prisma.$disconnect();
  }
}