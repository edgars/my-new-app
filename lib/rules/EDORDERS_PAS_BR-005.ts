async function handleActiveSourceStateChange(
  customerId: string,
  newState: string,
  currentUserId: string
) {
  // TODO(rnc): verify that the state transition is valid according to business rules and user permissions
  return await prisma.$transaction(async (tx) => {
    const customer = await tx.nextcust.findUnique({
      where: { id: customerId },
      select: { activeSourceState: true, datasetName: true }
    });

    if (!customer) {
      throw new Error(`Customer ${customerId} not found`);
    }

    // Update the customer's active source state
    const updatedCustomer = await tx.nextcust.update({
      where: { id: customerId },
      data: {
        activeSourceState: newState,
        updatedAt: new Date(),
        updatedBy: currentUserId
      }
    });

    // Log the state change for audit purposes
    await tx.auditLog.create({
      data: {
        entityId: customerId,
        entityType: 'Nextcust',
        action: 'ActiveSourceState_Change',
        oldValue: customer.activeSourceState,
        newValue: newState,
        changedBy: currentUserId,
        timestamp: new Date()
      }
    });

    return updatedCustomer;
  });
}