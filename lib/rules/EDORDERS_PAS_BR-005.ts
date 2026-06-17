async function handleActiveSourceStateChange(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that the ActiveSourceState logic here correctly mirrors the original Delphi
  // handler — specifically confirm that dsEdit/dsInsert states map to the correct Prisma operations
  // (create vs update), that the dataset name and state are being sourced from the right request
  // fields, and that the help context / mode indicator color semantics (red=edit, blue=browse)
  // are represented appropriately in whatever UI/API response contract replaces the VCL form.

  const { partno, description, onhand, onorder, vendorno, cost, listprice, backord, state } =
    req.body as {
      partno: string;
      description?: string;
      onhand?: number;
      onorder?: number;
      vendorno?: string;
      cost?: number;
      listprice?: number;
      backord?: number;
      state: "dsEdit" | "dsInsert" | "dsBrowse" | "dsInactive" | string;
    };

  const isEditOrInsert = state === "dsEdit" || state === "dsInsert";

  try {
    const result = await prisma.$transaction(async (tx) => {
      let part;

      if (state === "dsInsert") {
        // Inserting a new Part record
        part = await tx.parts.create({
          data: {
            partno,
            description: description ?? "",
            onhand: onhand ?? 0,
            onorder: onorder ?? 0,
            vendorno: vendorno ?? "",
            cost: cost ?? 0,
            listprice: listprice ?? 0,
            backord: backord ?? 0,
          },
        });
      } else if (state === "dsEdit") {
        // Editing an existing Part record
        part = await tx.parts.update({
          where: { partno },
          data: {
            ...(description !== undefined && { description }),
            ...(onhand !== undefined && { onhand }),
            ...(onorder !== undefined && { onorder }),
            ...(vendorno !== undefined && { vendorno }),
            ...(cost !== undefined && { cost }),
            ...(listprice !== undefined && { listprice }),
            ...(backord !== undefined && { backord }),
          },
        });
      } else {
        // Browse / Inactive / other states — read-only fetch, no writes
        part = await tx.parts.findUnique({
          where: { partno },
        });
      }

      return part;
    });

    return res.status(200).json({
      part: result,
      modeIndicator: {
        // Mirrors: if State in [dsEdit, dsInsert] then Font.Color := clRed else clBlue
        color: isEditOrInsert ? "red" : "blue",
        // Mirrors: HelpContext := HelpTopicEdit / HelpTopicBrowse
        helpContext: isEditOrInsert ? "HelpTopicEdit" : "HelpTopicBrowse",
        // Mirrors: Format('[%S: %S]', [Dataset.Name, DatasetStates[State]])
        caption: `[Parts: ${state}]`,
      },
    });
  } catch (error) {
    console.error("handleActiveSourceStateChange error:", error);
    return res.status(500).json({ error: "Failed to process state change for Parts." });
  }
}