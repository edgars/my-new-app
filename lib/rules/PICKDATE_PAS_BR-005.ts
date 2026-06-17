export async function handleCalendar1Change(
  customerId: string,
  calendarDate: Date
) {
  // TODO(rnc): verify that the customer exists and has permission to modify calendar data
  const prisma = new PrismaClient();
  
  const transactionResult = await prisma.$transaction(async (tx) => {
    const customer = await tx.nextcust.findUnique({
      where: { id: customerId }
    });
    
    if (!customer) {
      throw new Error(`Customer with id ${customerId} not found`);
    }
    
    const formattedDate = new Date(calendarDate).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
    
    const updatedCustomer = await tx.nextcust.update({
      where: { id: customerId },
      data: {
        titleLabelCaption: formattedDate,
        calendar1: calendarDate
      }
    });
    
    return updatedCustomer;
  });
  
  return transactionResult;
}