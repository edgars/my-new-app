// TODO(rnc): verify that the date picker modal logic (BrDateForm) is correctly replicated
// client-side, that ToEdit.Text maps to the `newcust` field on Nextcust, and that
// StrToDate/DateToStr locale formatting matches the expected date format in this system.

export async function handlePopupCalToBtnClick(
  req: import("next").NextApiRequest,
  res: import("next").NextApiResponse
) {
  const { id, toDateText } = req.body as { id: string; toDateText: string };

  if (!id || !toDateText) {
    return res.status(400).json({ error: "Missing required fields: id and toDateText" });
  }

  // Parse the incoming date string — mirrors StrToDate(ToEdit.Text)
  const parsedDate = new Date(toDateText);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: `Invalid date value: "${toDateText}"` });
  }

  // Normalize back to a locale-consistent string — mirrors DateToStr(BrDateForm.Date)
  const normalizedDateStr = parsedDate.toISOString().split("T")[0];

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const existing = await tx.nextcust.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new Error(`Nextcust record not found for id: ${id}`);
      }

      return tx.nextcust.update({
        where: { id },
        data: {
          newcust: normalizedDateStr,
        },
      });
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return res.status(500).json({ error: message });
  }
}