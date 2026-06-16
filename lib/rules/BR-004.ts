async function nextMonthBtnClick(
  currentDate: Date
): Promise<{ year: number; month: number }> {
  // TODO(rnc): verify that the calendar navigation logic matches the original Delphi Calendar1.NextMonth behavior,
  // including edge cases for December rollover to January of the next year, and that no Parts data
  // mutation is intended — this appears to be a pure UI date navigation procedure with no database writes.

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const nextMonth = new Date(year, month + 1, 1);

  return {
    year: nextMonth.getFullYear(),
    month: nextMonth.getMonth() + 1, // return 1-indexed month
  };
}