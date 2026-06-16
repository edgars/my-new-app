export async function handleNextMonthBtnClick(
  calendarId: string,
  userId: string
) {
  // TODO(rnc): verify that the user has permission to modify this calendar and that the calendar exists
  return await prisma.$transaction(async (tx) => {
    const calendar = await tx.calendar.update({
      where: {
        id: calendarId,
        userId: userId
      },
      data: {
        currentMonth: {
          increment: 1
        }
      }
    });

    return { success: true, newMonth: calendar.currentMonth };
  });
}