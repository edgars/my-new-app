export async function handleNextMonthBtnClick(
  calendarId: string,
  userId: string
) {
  // TODO(rnc): verify that this button click should only advance the calendar view
  // and not persist any date changes to parts or other entities - this appears
  // to be a UI navigation action rather than a data modification operation
  
  const updatedCalendar = await prisma.calendar.update({
    where: { 
      id: calendarId,
      userId: userId
    },
    data: {
      currentViewDate: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0),
        lt: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 31)
      }
    }
  });

  return { success: true, newDate: updatedCalendar.currentViewDate };
}