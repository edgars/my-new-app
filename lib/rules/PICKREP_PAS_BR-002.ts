export async function handlePickRptViewBtnClick(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that setting preview mode to true is the only side effect of ViewBtnClick,
  // confirm whether Preview flag should be persisted to the Nextcust/newcust record or only held
  // in transient session/UI state, and validate that no additional report-generation or
  // data-fetch logic is expected before responding.

  try {
    const { id } = req.body as { id: string };

    const updatedNextcust = await prisma.nextcust.update({
      where: { id },
      data: {
        newcust: {
          update: {
            preview: true,
          },
        },
      },
    });

    return res.status(200).json({ success: true, data: updatedNextcust });
  } catch (error) {
    console.error("handlePickRptViewBtnClick error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}