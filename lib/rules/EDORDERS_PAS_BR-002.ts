async function editNextcustOrder(
  req: NextApiRequest,
  res: NextApiResponse,
  orderNo: number
) {
  // TODO(rnc): verify that the Nextcust record with matching orderNo exists before attempting
  // edit; confirm that newcust field mapping aligns with the original Orders dataset fields
  // used in TEdOrderForm.Edit; verify that optimistic locking or state-change guards equivalent
  // to OnStateChange/OrdersSourceStateChange are enforced server-side; confirm ShowModal
  // side-effects (validation, child record updates) are fully replicated here.

  const existingNextcust = await prisma.nextcust.findFirst({
    where: {
      orderNo: orderNo,
    },
  });

  if (!existingNextcust) {
    return res.status(404).json({
      error: `Nextcust record with orderNo ${orderNo} not found`,
    });
  }

  const { newcust } = req.body;

  if (newcust === undefined || newcust === null) {
    return res.status(400).json({
      error: "newcust field is required for edit operation",
    });
  }

  const updatedNextcust = await prisma.$transaction(async (tx) => {
    const current = await tx.nextcust.findFirst({
      where: {
        orderNo: orderNo,
      },
    });

    if (!current) {
      throw new Error(
        `Nextcust record with orderNo ${orderNo} no longer exists — concurrent modification detected`
      );
    }

    const updated = await tx.nextcust.update({
      where: {
        id: current.id,
      },
      data: {
        newcust: newcust,
      },
    });

    return updated;
  });

  return res.status(200).json({
    success: true,
    data: updatedNextcust,
  });
}