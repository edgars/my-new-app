async function handleOrderComboChange(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that OrderCombo.Text maps to a valid field name on Nextcust,
  // that the field lookup logic (FieldByName equivalent) correctly resolves against
  // the Nextcust schema, and that clearing SearchEd.Text (newcust reset) is the
  // intended side effect in the Next.js/Prisma context.

  const { orderComboText, nextcustId } = req.body;

  if (!orderComboText || !nextcustId) {
    return res.status(400).json({ error: "orderComboText and nextcustId are required" });
  }

  const validFields: (keyof Prisma.NextcustUpdateInput)[] = ["newcust"];

  if (!validFields.includes(orderComboText as keyof Prisma.NextcustUpdateInput)) {
    return res.status(400).json({ error: `Invalid field name: ${orderComboText}` });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingRecord = await tx.nextcust.findUnique({
        where: { id: nextcustId },
      });

      if (!existingRecord) {
        throw new Error(`Nextcust record not found for id: ${nextcustId}`);
      }

      const fieldValue = existingRecord[orderComboText as keyof typeof existingRecord];

      const updatedRecord = await tx.nextcust.update({
        where: { id: nextcustId },
        data: {
          newcust: "",
        },
      });

      return {
        updatedRecord,
        resolvedField: orderComboText,
        resolvedFieldValue: fieldValue,
      };
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}