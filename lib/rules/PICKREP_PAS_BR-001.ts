async function handleOKBtnClick(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that setting preview to false is the only side effect of OKBtnClick,
  // and confirm whether any Nextcust/newcust fields need to be persisted when the user
  // confirms the pick report dialog (original Delphi code only sets Preview := False with no DB writes).

  try {
    const preview = false;

    return res.status(200).json({
      success: true,
      preview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}