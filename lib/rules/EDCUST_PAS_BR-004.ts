export async function handleNextcustFormCloseQuery(
  newcust: boolean,
  modalResultIsOk: boolean,
  nextcustId?: string,
  data?: Partial<{ newcust: boolean }>
): Promise<{ canClose: boolean; nextcust?: any; error?: string }> {
  // TODO(rnc): verify that "applyUpdates" semantics match — in the Delphi source,
  // DataSetApplyUpdates only persists pending changes when ModalResult = mrOK;
  // if modalResultIsOk is false the dataset changes must be discarded (rolled back),
  // not saved. Confirm that the canClose return value should always be true when
  // modalResultIsOk is false (i.e. user cancelled), and that validation errors
  // during the OK path should set canClose = false and surface the error to the UI.

  if (!modalResultIsOk) {
    // User cancelled — discard changes, allow the form to close
    return { canClose: true };
  }

  if (!nextcustId && data === undefined) {
    return { canClose: false, error: "No data provided to apply updates." };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      let nextcust;

      if (!nextcustId) {
        // New record — insert
        nextcust = await tx.nextcust.create({
          data: {
            newcust: data?.newcust ?? newcust,
          },
        });
      } else {
        // Existing record — update
        nextcust = await tx.nextcust.update({
          where: { id: nextcustId },
          data: {
            ...(data?.newcust !== undefined && { newcust: data.newcust }),
          },
        });
      }

      return nextcust;
    });

    return { canClose: true, nextcust: result };
  } catch (error) {
    // Mirror Delphi behaviour: if applyUpdates fails, canClose = false
    const message =
      error instanceof Error ? error.message : "Unknown error during apply updates.";
    return { canClose: false, error: message };
  }
}