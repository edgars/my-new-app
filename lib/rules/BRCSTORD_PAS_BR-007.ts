export async function handleOrdersGridEnter(
  customerId: string,
  prisma: PrismaClient
) {
  // TODO(rnc): verify that the customer exists and is active before updating grid options
  const existingCustomer = await prisma.nextcust.findUnique({
    where: { id: customerId }
  });

  if (!existingCustomer) {
    throw new Error(`Customer with id ${customerId} does not exist`);
  }

  // Update the customer record to indicate orders grid is active
  // This simulates setting ActiveSource := MastData.OrdByCustSrc
  await prisma.nextcust.update({
    where: { id: customerId },
    data: {
      // Assuming there's a field tracking the active source or view state
      activeView: 'orders',
      // Simulate the grid option changes through metadata
      gridOptions: {
        ordersGrid: { alwaysShowSelection: true },
        custGrid: { alwaysShowSelection: false }
      }
    }
  });
}