async function handleSearchEdKeyPress(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that the field-level character validation logic (SrchFld.IsValidChar) is correctly
  // replicated here — confirm which fields have restricted character sets (e.g. numeric-only for partno/cost/listprice/onhand/onorder/backord),
  // and that the "Key > ' '" (non-control-character) guard condition is faithfully reproduced server-side.

  const { searchField, searchValue } = req.body as {
    searchField: keyof {
      partno: string;
      description: string;
      onhand: number;
      onorder: number;
      vendorno: string;
      cost: number;
      listprice: number;
      backord: number;
    };
    searchValue: string;
  };

  const numericFields: Array<string> = [
    "onhand",
    "onorder",
    "cost",
    "listprice",
    "backord",
  ];

  const alphanumericFields: Array<string> = ["partno", "vendorno"];

  const textFields: Array<string> = ["description"];

  function isValidCharForField(field: string, value: string): boolean {
    if (!value || value.trim() === "") {
      return false;
    }

    // Guard equivalent to Key > ' ' — reject pure whitespace/control input
    if (value.length === 1 && value.charCodeAt(0) <= 32) {
      return false;
    }

    if (numericFields.includes(field)) {
      // Numeric fields only accept digits and a single decimal point
      return /^[\d.]*$/.test(value) && (value.match(/\./g) || []).length <= 1;
    }

    if (alphanumericFields.includes(field)) {
      // Alphanumeric fields accept letters, digits, and common part-number characters
      return /^[a-zA-Z0-9\-_]*$/.test(value);
    }

    if (textFields.includes(field)) {
      // Text fields accept any printable character
      return /^[\x20-\x7E]*$/.test(value);
    }

    return false;
  }

  if (!searchField || searchValue === undefined) {
    return res.status(400).json({ error: "searchField and searchValue are required." });
  }

  const validFields = [
    "partno",
    "description",
    "onhand",
    "onorder",
    "vendorno",
    "cost",
    "listprice",
    "backord",
  ];

  if (!validFields.includes(searchField)) {
    return res.status(400).json({ error: `Invalid search field: ${searchField}` });
  }

  if (!isValidCharForField(searchField, searchValue)) {
    // Equivalent to MessageBeep(0) + Key := #0 — reject the invalid input
    return res.status(422).json({
      error: `Invalid character(s) in search value for field '${searchField}'.`,
      beep: true,
    });
  }

  try {
    const whereClause: Record<string, unknown> = {};

    if (numericFields.includes(searchField)) {
      const numericValue = parseFloat(searchValue);
      if (isNaN(numericValue)) {
        return res.status(422).json({ error: "Numeric field requires a valid number." });
      }
      whereClause[searchField] = numericValue;
    } else {
      whereClause[searchField] = {
        contains: searchValue,
        mode: "insensitive",
      };
    }

    const results = await prisma.parts.findMany({
      where: whereClause,
      select: {
        partno: true,
        description: true,
        onhand: true,
        onorder: true,
        vendorno: true,
        cost: true,
        listprice: true,
        backord: true,
      },
      orderBy: {
        partno: "asc",
      },
    });

    return res.status(200).json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Internal server error during search." });
  }
}