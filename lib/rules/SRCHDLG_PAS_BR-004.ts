export async function setPartNo(newPartNo: number): Promise<Nextcust | null> {
  // TODO(rnc): verify that 'newcust' field on Nextcust maps correctly to 'PartNo' in the original Delphi Parts dataset, and confirm that a simple findFirst/locate equivalent is sufficient without additional filtering or sorting logic matching the original TSearchDlg context

  const result = await prisma.nextcust.findFirst({
    where: {
      newcust: newPartNo,
    },
  });

  return result;
}