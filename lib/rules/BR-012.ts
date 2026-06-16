async function handleSearchEdKeyPress(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO(rnc): verify that field-level character validation rules match the original Delphi SrchFld.IsValidChar logic per field type (numeric, alpha, etc.), and confirm that invalid keypress suppression behavior is correctly translated to a server-side rejection rather than a client-side beep/cancel

  const { key, searchField } = req.body as {
    key: string;
    searchField: keyof typeof fieldValidators;
  };

  if (!key || !searchField) {
    return res.status(400).json({ error: "Missing key or searchField" });
  }

  // Mirror: if Key <= ' ' (control/whitespace), allow it through without validation
  if (key.length === 1 && key <= " ") {
    return res.status(200).json({ valid: true });
  }

  const fieldValidators: Record<string, (char: string) => boolean> = {
    partno: (char: string) => /^[A-Za-z0-9\-]$/.test(char),
    description: (char: string) => /^[A-Za-z0-9\s\-.,]$/.test(char),
    onhand: (char: string) => /^[0-9]$/.test(char),
    onorder: (char: string) => /^[0-9]$/.test(char),
    vendorno: (char: string) => /^[A-Za-z0-9]$/.test(char),
    cost: (char: string) => /^[0-9.]$/.test(char),
    listprice: (char: string) => /^[0-9.]$/.test(char),
    backord: (char: string) => /^[0-9]$/.test(char),
  };

  const validator = fieldValidators[searchField];

  if (!validator) {
    return res.status(400).json({ error: `Unknown search field: ${searchField}` });
  }

  // Mirror: if SrchFld is Assigned and Key > ' ' and NOT IsValidChar(Key) => suppress (Key := #0)
  const isValid = validator(key);

  if (!isValid) {
    // Mirror: MessageBeep(0) + Key := #0 — client should suppress the character and optionally beep
    return res.status(200).json({
      valid: false,
      suppress: true,
      message: `Character '${key}' is not valid for field '${searchField}'`,
    });
  }

  // Optionally perform the actual search against Parts when a valid character is confirmed
  const searchValue = req.body.currentValue
    ? `${req.body.currentValue}${key}`
    : key;

  const parts = await prisma.parts.findMany({
    where: {
      [searchField]: {
        startsWith: searchValue,
        mode: "insensitive",
      },
    },
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
      [searchField]: "asc",
    },
    take: 50,
  });

  return res.status(200).json({ valid: true, suppress: false, results: parts });
}