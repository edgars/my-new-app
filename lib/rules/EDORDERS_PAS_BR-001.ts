async function handleNextcustEnter(
  req: import("next").NextApiRequest,
  res: import("next").NextApiResponse
) {
  // TODO(rnc): verify that opening a new order and immediately inserting a blank record is the intended
  // behavior — confirm whether the modal/form submission is what actually persists the record or whether
  // the insert should be deferred until the user confirms; also verify that Nextcust.newcust should be
  // initialized/defaulted here and that any OnStateChange side-effects have an equivalent hook in this flow.

  const { newcust, ...orderData } = req.body ?? {};

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Mirror TEdOrderForm.Enter: open the Orders dataset and insert a new blank record,
      // equivalent to the user seeing an empty order form ready for input.
      const nextcust = await tx.nextcust.create({
        data: {
          newcust: newcust ?? true, // flag indicating this is a freshly inserted, unsaved order record
          ...orderData,
        },
      });

      return nextcust;
    });

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("[handleNextcustEnter] failed to insert new order record:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to open and insert new order record.",
    });
  }
}