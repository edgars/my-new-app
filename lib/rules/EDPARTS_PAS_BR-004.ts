export async function handleEdPartsFormCloseQuery(
  canClose: boolean,
  modalResultIsOk: boolean,
  nextcustData: { newcust?: string | null; [key: string]: unknown },
  nextcustId?: string
): Promise<{ canClose: boolean; success: boolean; error?: string }> {
  // TODO(rnc): verify that MastData.DataSetApplyUpdates logic is fully replicated here —
  // confirm that "applyUpdates" should only persist when modalResultIsOk is true,
  // that canClose should be set to false on failure (matching Delphi behaviour),
  // and that all Nextcust fields mapped from the Parts dataset are correctly identified.

  if (!canClose) {
    return { canClose: false, success: false };
  }

  if (!modalResultIsOk) {
    // User cancelled — discard pending changes, allow close without persisting
    return { canClose: true, success: true };
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (nextcustId) {
        await tx.nextcust.update({
          where: { id: nextcustId },
          data: {
            newcust: nextcustData.newcust,
          },
        });
      } else {
        await tx.nextcust.create({
          data: {
            newcust: nextcustData.newcust,
          },
        });
      }
    });

    return { canClose: true, success: true };
  } catch (error) {
    // Mirrors Delphi behaviour: if ApplyUpdates fails, CanClose is set to false
    return {
      canClose: false,
      success: false,
      error: error instanceof Error ? error.message : "Failed to apply updates to Nextcust",
    };
  }
}