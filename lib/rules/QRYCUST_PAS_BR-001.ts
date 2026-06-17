export async function setFromDate(newDate: Date): Promise<{ fromDate: string }> {
  // TODO(rnc): verify that the date formatting matches the expected locale/format used in the original Delphi DateToStr call, and confirm that Nextcust.newcust field is the correct target for storing or filtering by this from-date value

  const fromDateString = newDate.toLocaleDateString();

  const updatedNextcust = await prisma.nextcust.updateMany({
    data: {
      newcust: fromDateString,
    },
  });

  return { fromDate: fromDateString };
}