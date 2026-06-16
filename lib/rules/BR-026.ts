async function TMastData_OrdersBeforeOpen() {
  // TODO(rnc): verify that opening these datasets establishes proper record locks and read consistency
  // before any order processing operations commence - ensure concurrent access doesn't corrupt data integrity
  
  const transaction = await prisma.$transaction(async (tx) => {
    // Open/verify related datasets exist and are accessible
    await tx.customer.findMany({
      select: { custno: true },
      take: 1
    });
    
    await tx.order.findMany({
      select: { orderno: true },
      take: 1
    });
    
    await tx.employee.findMany({
      select: { empno: true },
      take: 1
    });
    
    await tx.parts.findMany({
      select: { partno: true },
      take: 1
    });
  });

  return transaction;
}