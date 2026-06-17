async function handleEditBtnClick(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that ActivateBtn.Down equivalent (isActivated flag) correctly reflects
  // the active/inactive toggle state; verify that PartsQueryPartNo vs PartsPartNo selection
  // logic maps to the correct Nextcust.newcust field source; verify that the query
  // close/reopen pattern is handled by Prisma refetch and not a stale cache issue.

  const { isActivated, partsQueryPartNo, partsPartNo } = req.body as {
    isActivated: boolean;
    partsQueryPartNo: string | undefined;
    partsPartNo: string | undefined;
  };

  if (!partsQueryPartNo && !partsPartNo) {
    return res.status(400).json({ error: "No part number provided" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      let targetPartNo: string;

      if (isActivated) {
        if (!partsQueryPartNo) {
          throw new Error("partsQueryPartNo is required when isActivated is true");
        }
        targetPartNo = partsQueryPartNo;

        const existing = await tx.nextcust.findFirst({
          where: { newcust: targetPartNo },
        });

        if (!existing) {
          throw new Error(`Nextcust record not found for newcust: ${targetPartNo}`);
        }

        const updated = await tx.nextcust.update({
          where: { id: existing.id },
          data: { newcust: targetPartNo },
        });

        const refreshed = await tx.nextcust.findMany({
          where: { newcust: targetPartNo },
        });

        return { updated, refreshed, mode: "activated" };
      } else {
        if (!partsPartNo) {
          throw new Error("partsPartNo is required when isActivated is false");
        }
        targetPartNo = partsPartNo;

        const existing = await tx.nextcust.findFirst({
          where: { newcust: targetPartNo },
        });

        if (!existing) {
          throw new Error(`Nextcust record not found for newcust: ${targetPartNo}`);
        }

        const updated = await tx.nextcust.update({
          where: { id: existing.id },
          data: { newcust: targetPartNo },
        });

        return { updated, mode: "standard" };
      }
    });

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ success: false, error: message });
  }
}