async function handleShowModalParts(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that the Nextcust/newcust entity is the correct target for parts search results,
  // confirm that 'Description' and 'PartNo' are valid sortable fields on the Parts model,
  // and confirm that the default sort order (Description ascending) matches legacy TSearchDlg behavior.

  const { orderBy = 'Description', search = '' } = req.query;

  const allowedOrderFields = ['Description', 'PartNo'] as const;
  type AllowedOrderField = typeof allowedOrderFields[number];

  const resolvedOrderBy: AllowedOrderField = allowedOrderFields.includes(orderBy as AllowedOrderField)
    ? (orderBy as AllowedOrderField)
    : 'Description';

  try {
    const parts = await prisma.$transaction(async (tx) => {
      const results = await tx.nextcust.findMany({
        where: {
          newcust: search
            ? {
                contains: String(search),
                mode: 'insensitive',
              }
            : undefined,
        },
        orderBy: {
          [resolvedOrderBy]: 'asc',
        },
        select: {
          id: true,
          newcust: true,
        },
      });

      return results;
    });

    const orderOptions = ['Description', 'PartNo'];

    return res.status(200).json({
      caption: 'Select a Part',
      defaultOrderIndex: 0,
      orderOptions,
      selectedOrder: resolvedOrderBy,
      parts,
    });
  } catch (error) {
    console.error('[handleShowModalParts] error:', error);
    return res.status(500).json({ error: 'Failed to load parts for selection dialog.' });
  }
}