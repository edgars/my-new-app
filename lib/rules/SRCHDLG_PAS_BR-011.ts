async function handleOrderComboChange(
  orderId: string,
  newValue: string
) {
  // TODO(rnc): verify that OrderCombo field updates correctly trigger this handler and that the search field reset logic matches the original Delphi behavior
  return await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { 
        OrderCombo: newValue,
        searchField: '' // Reset search field as per original logic
      }
    });

    return updatedOrder;
  });
}