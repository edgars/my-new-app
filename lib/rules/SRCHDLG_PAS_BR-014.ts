async function handleSearchEdChange(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that SearchButton.Enabled mirrors whether searchEd is non-empty,
  // and confirm no additional validation or side effects are required before toggling enabled state

  const { searchEd } = req.body as { searchEd: string };

  const searchButtonEnabled = searchEd !== undefined && searchEd.trim() !== '';

  return res.status(200).json({ searchButtonEnabled });
}