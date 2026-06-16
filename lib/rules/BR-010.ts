async function handleCustomerOrderActivation(
  fromDate: Date,
  toDate: Date,
  activateBtnDown: boolean
) {
  // TODO(rnc): verify that the date range filtering logic matches the original Delphi implementation
  // and that empty result sets properly trigger the fallback to default customer dataset
  
  if (!activateBtnDown) {
    // Return default customer dataset without date filtering
    return await prisma.customer.findMany({
      where: {
        active: true
      }
    });
  } else {
    try {
      // Apply date range filtering similar to the query parameters in original code
      const customers = await prisma.customer.findMany({
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
        distinct: ['id'] // Ensure unique customers within date range
      });

      // If no matching records found (empty result set), throw error to trigger fallback
      if (customers.length === 0) {
        throw new Error('No matching records in the specified date range');
      }

      return customers;
    } catch (error) {
      // Fallback to default customer dataset when query fails or returns no results
      console.warn('Customer query failed, falling back to default dataset:', error.message);
      
      return await prisma.customer.findMany({
        where: {
          active: true
        }
      });
    }
  }
}