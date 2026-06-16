export async function handlePopupCalToBtnClick(
  currentDate: string,
  selectedDate: string
) {
  // TODO(rnc): verify that the date conversion logic matches the original Delphi implementation
  // specifically that StrToDate/DateToStr behavior is preserved in the date formatting
  
  const parsedCurrentDate = new Date(currentDate);
  const parsedSelectedDate = new Date(selectedDate);
  
  // Validate dates are valid
  if (isNaN(parsedCurrentDate.getTime()) || isNaN(parsedSelectedDate.getTime())) {
    throw new Error('Invalid date format provided');
  }
  
  // In the original Delphi code, this was just updating UI text fields
  // For server-side handling, we might need to store this date selection
  // or return the formatted date string for client-side update
  
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  };
  
  return {
    updatedDate: formatDate(parsedSelectedDate),
    originalDate: formatDate(parsedCurrentDate)
  };
}