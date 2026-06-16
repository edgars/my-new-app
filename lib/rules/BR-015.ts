async function handleQueryCustDlgFormCreate() {
  // TODO(rnc): verify that this initialization only occurs on form creation and doesn't persist data changes
  const msgLabCaption = 'Customers with LastInvoiceDate ranging:';
  const fromDate = new Date(1995, 0, 1); // January 1st, 1995 (month is 0-indexed)
  const toDate = new Date(); // Current date/time
  
  // This appears to be a UI initialization procedure that doesn't modify database records
  // Returning the initialized values for client-side use
  return {
    msgLabCaption,
    fromDate,
    toDate
  };
}