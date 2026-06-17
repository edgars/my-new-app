export async function handleNextcustFormShow(
  req: Request,
  res: Response
) {
  // TODO(rnc): verify that opening the Parts dataset on FormShow should eagerly load all Nextcust/newcust records with no filter, and confirm pagination/limit requirements match the original Delphi MastData.Parts.Open behavior

  const nextcustRecords = await prisma.nextcust.findMany({
    select: {
      newcust: true,
    },
  });

  return nextcustRecords;
}