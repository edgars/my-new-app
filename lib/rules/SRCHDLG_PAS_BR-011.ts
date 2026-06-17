async function handleOrderComboChange(
  req: NextApiRequest,
  res: NextApiResponse,
  prisma: PrismaClient
) {
  // TODO(rnc): verify that OrderCombo contains a valid field name from the Parts entity
  // (partno, description, onhand, onorder, vendorno, cost, listprice, backord),
  // that the selected field is appropriate for searching/filtering Parts records,
  // and that resetting the search input (SearchEd) on combo change is the desired UX behavior
  // (i.e. any active search/filter should be cleared when the search field selection changes).

  const { orderComboValue } = req.body as { orderComboValue: string };

  const validPartFields: (keyof {
    partno: string;
    description: string;
    onhand: number;
    onorder: number;
    vendorno: string;
    cost: number;
    listprice: number;
    backord: number;
  })[] = [
    "partno",
    "description",
    "onhand",
    "onorder",
    "vendorno",
    "cost",
    "listprice",
    "backord",
  ];

  if (!orderComboValue || !validPartFields.includes(orderComboValue as never)) {
    return res.status(400).json({
      error: `Invalid field selection. Must be one of: ${validPartFields.join(", ")}`,
    });
  }

  try {
    // Reflect back the selected search field and signal that the search input should be cleared,
    // mirroring the Delphi behavior: set the active datasource search field and reset SearchEd.Text to ''.
    return res.status(200).json({
      selectedField: orderComboValue,
      searchText: "",
    });
  } catch (error) {
    console.error("handleOrderComboChange error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}