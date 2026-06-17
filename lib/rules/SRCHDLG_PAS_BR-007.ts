export async function handleDBGrid1DblClick(
  req: import("next").NextApiRequest,
  res: import("next").NextApiResponse
) {
  // TODO(rnc): verify that double-clicking a row in the search dialog grid should
  // immediately confirm the selection (ModalResult := mrOK equivalent), closing
  // the dialog and returning the selected Nextcust/newcust record to the caller —
  // confirm no validation, dirty-check, or save is required before confirming.

  const { id } = req.body as { id: string | number };

  if (!id) {
    return res.status(400).json({ error: "Missing record id for selection" });
  }

  const selectedRecord = await prisma.nextcust.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      newcust: true,
    },
  });

  if (!selectedRecord) {
    return res.status(404).json({ error: "Nextcust record not found" });
  }

  return res.status(200).json({
    modalResult: "OK",
    selected: selectedRecord,
  });
}