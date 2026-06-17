async function getPartNo(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that `newcust` on Nextcust maps correctly to the PartsPartNo field from MastData,
  // and confirm that the returned value should be treated as a floating-point Double equivalent (number in JS),
  // and that no additional filtering or join logic from TSearchDlg context is missing here.

  const nextcust = await prisma.nextcust.findFirst({
    select: {
      newcust: true,
    },
  });

  if (!nextcust) {
    return res.status(404).json({ error: "Nextcust record not found" });
  }

  const partNo: number = Number(nextcust.newcust);

  if (isNaN(partNo)) {
    return res.status(422).json({ error: "newcust value cannot be converted to a valid part number" });
  }

  return res.status(200).json({ partNo });
}