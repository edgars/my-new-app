async function handleNextcustSearch(req: Request, res: Response) {
  // TODO(rnc): verify that the search field maps correctly to `newcust` on the Nextcust model,
  // confirm case-insensitive partial matching is acceptable via Prisma `contains` + `mode: 'insensitive'`,
  // and confirm the field name passed as `searchField` is a valid/whitelisted column on Nextcust.

  const { searchField, searchValue } = req.body as {
    searchField: string;
    searchValue: string;
  };

  const ALLOWED_SEARCH_FIELDS: Array<keyof { newcust: string }> = ["newcust"];

  if (!ALLOWED_SEARCH_FIELDS.includes(searchField as "newcust")) {
    return res.status(400).json({
      found: false,
      message: `Search field '${searchField}' is not permitted.`,
    });
  }

  if (!searchValue || searchValue.trim() === "") {
    return res.status(400).json({
      found: false,
      message: "Search value must not be empty.",
    });
  }

  const matchingRecord = await prisma.nextcust.findFirst({
    where: {
      [searchField]: {
        contains: searchValue.trim(),
        mode: "insensitive",
      },
    },
  });

  if (!matchingRecord) {
    return res.status(200).json({
      found: false,
      message: "No matching record found.",
    });
  }

  return res.status(200).json({
    found: true,
    record: matchingRecord,
  });
}