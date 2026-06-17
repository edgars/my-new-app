export async function setToDate(newDate: Date): Promise<{ toDateString: string }> {
  // TODO(rnc): verify that the ToEdit.Text field maps to a `toDate` (or equivalent) string field on the Nextcust entity, and confirm that DateToStr formatting should use the server locale or a fixed ISO format here

  const toDateString = newDate.toLocaleDateString();

  const updatedCust = await prisma.nextcust.updateMany({
    data: {
      newcust: toDateString,
    },
  });

  return { toDateString };
}