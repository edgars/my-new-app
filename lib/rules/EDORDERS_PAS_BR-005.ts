async function handleActiveSourceStateChange(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that ActiveSourceState transitions (dsEdit/dsInsert vs browse) are correctly
  // mapped to the newcust field values, and confirm that the dataset name and state label formatting
  // matches the original Delphi Format('[%S: %S]', [Dataset.Name, DatasetStates[State]]) behavior.

  const { id, activeSourceState, datasetName } = req.body as {
    id: string;
    activeSourceState: string;
    datasetName?: string;
  };

  const EDIT_STATES = ["dsEdit", "dsInsert"];

  const isEditOrInsert = EDIT_STATES.includes(activeSourceState);

  const modeIndicatorCaption =
    datasetName && activeSourceState
      ? `[${datasetName}: ${activeSourceState}]`
      : null;

  const helpContext = isEditOrInsert ? "HelpTopicEdit" : "HelpTopicBrowse";
  const modeIndicatorFontColor = isEditOrInsert ? "red" : "blue";

  try {
    const updatedNextcust = await prisma.$transaction(async (tx) => {
      const existing = await tx.nextcust.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new Error(`Nextcust record with id ${id} not found`);
      }

      const newcustValue = {
        activeSourceState,
        modeIndicatorCaption,
        helpContext,
        modeIndicatorFontColor,
        isEditing: isEditOrInsert,
        updatedAt: new Date().toISOString(),
      };

      const updated = await tx.nextcust.update({
        where: { id },
        data: {
          newcust: JSON.stringify(newcustValue),
        },
      });

      return updated;
    });

    return res.status(200).json({
      success: true,
      data: updatedNextcust,
      meta: {
        modeIndicatorCaption,
        helpContext,
        modeIndicatorFontColor,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      success: false,
      error: message,
    });
  }
}