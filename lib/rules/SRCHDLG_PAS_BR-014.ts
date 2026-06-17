export async function handleSearchEdChange(
  customerId: string,
  searchValue: string
) {
  // TODO(rnc): verify that the customer record exists and user has permission to update it
  return await prisma.$transaction(async (tx) => {
    const updatedCustomer = await tx.nextcust.update({
      where: { id: customerId },
      data: {
        newcust: searchValue,
        // Assuming there's a field that represents the enabled state of a search button
        // Since the original pseudocode references SearchButton.Enabled, we'll track this state
        isSearchEnabled: searchValue.trim() !== ''
      }
    });
    
    return updatedCustomer;
  });
}