export async function handleCustomerOrderActivation(
  fromDate: Date,
  toDate: Date
) {
  // TODO(rnc): verify that the date range filtering logic matches the original Delphi implementation
  // and that empty result sets properly fall back to the default customer dataset
  
  return await prisma.$transaction(async (tx) => {
    try {
      const customers = await tx.customer.findMany({
        where: {
          orders: {
            some: {
              orderDate: {
                gte: fromDate,
                lte: toDate
              }
            }
          }
        },
        include: {
          orders: {
            where: {
              orderDate: {
                gte: fromDate,
                lte: toDate
              }
            }
          }
        }
      });

      if (customers.length === 0) {
        throw new Error('No matching records in the specified date range');
      }

      return {
        success: true,
        customers,
        activated: true,
        message: 'Customer query activated with date range filter'
      };
    } catch (error) {
      // Fallback to default customer dataset behavior
      const allCustomers = await tx.customer.findMany();
      
      return {
        success: false,
        customers: allCustomers,
        activated: false,
        message: error instanceof Error ? error.message : 'Error processing customer query'
      };
    }
  });
}