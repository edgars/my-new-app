async function handleCalendar1Change(selectedDate: Date): Promise<{ title: string }> {
  // TODO(rnc): verify that Calendar1 date change should only update a display title and requires no Parts entity persistence, and confirm whether any Parts filtering by date (e.g., backorder date, order date) should also be triggered when the calendar selection changes

  const title = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return { title };
}