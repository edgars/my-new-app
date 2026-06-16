async function handleCustomerOrderActivation(
  fromDate: Date,
  toDate: Date,
  customerId: string
) {
  // TODO(rnc): verify that the date range is valid and that customer exists before proceeding
  return await prisma.$transaction(async (tx) => {
    const orders = await tx.order.findMany({
      where: {
        customerId: customerId,
        orderDate: {
          gte: fromDate,
          lte: toDate
        }
      },
      include: {
        customer: true,
        orderItems: {
          include: {
            part: true
          }
        }
      }
    });

    if (orders.length === 0) {
      throw new Error('No matching records in the specified date range.');
    }

    return {
      dataset: orders,
      customerId: customerId,
      dateRange: {
        from: fromDate,
        to: toDate
      }
    };
  });
}