async function TMastData_OrdersBeforeOpen() {
  // TODO(rnc): verify that opening these datasets establishes proper read locks and that concurrent access doesn't cause race conditions
  const prisma = new PrismaClient();
  
  try {
    await prisma.$transaction(async (tx) => {
      // Open customer by company dataset
      await tx.customer.findMany({
        select: { id: true },
        where: { active: true }
      });
      
      // Open customer by orders dataset  
      await tx.customer.findMany({
        include: {
          orders: {
            where: { status: 'pending' }
          }
        }
      });
      
      // Open main customer dataset
      await tx.customer.findMany({
        select: { 
          id: true, 
          name: true, 
          creditLimit: true,
          balance: true 
        }
      });
      
      // Open employees dataset
      await tx.employee.findMany({
        select: { 
          id: true, 
          name: true, 
          department: true,
          active: true 
        },
        where: { active: true }
      });
      
      // Open items/parts dataset
      await tx.part.findMany({
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
    });
  } finally {
    await prisma.$disconnect();
  }
}