async function handlePopupCalBtnFromClick(
  fromEditText: string,
  selectedDate: string
): Promise<string> {
  // TODO(rnc): verify that the date conversion logic matches the original Pascal implementation
  // specifically that StrToDate and DateToStr behave consistently with the Prisma date handling
  
  const currentDate = fromEditText;
  let resultDate: string;
  
  try {
    // Parse the input date string to validate it
    const parsedCurrentDate = new Date(currentDate);
    if (isNaN(parsedCurrentDate.getTime())) {
      throw new Error('Invalid date format');
    }
    
    // Use the selected date from modal as the result
    const selectedParsedDate = new Date(selectedDate);
    if (isNaN(selectedParsedDate.getTime())) {
      throw new Error('Invalid selected date format');
    }
    
    // Format the date back to string in the expected format (YYYY-MM-DD for database storage)
    resultDate = selectedParsedDate.toISOString().split('T')[0];
  } catch (error) {
    // If there's an error, return the original date
    resultDate = currentDate;
  }
  
  return resultDate;
}