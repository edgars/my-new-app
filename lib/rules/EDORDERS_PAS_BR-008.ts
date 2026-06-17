async function handleOrdersSourceStateChange(
  orderId: string,
  newState: "edit" | "browse" | "insert"
): Promise<{
  postEnabled: boolean;
  cancelEnabled: boolean;
  closeEnabled: boolean;
  part?: {
    partno: string;
    description: string;
    onhand: number;
    onorder: number;
    vendorno: string;
    cost: number;
    listprice: number;
    backord: number;
  } | null;
}> {
  // TODO(rnc): verify that "dsEditModes" maps correctly to ["edit", "insert"] states in this context,
  // confirm that "dsBrowse" maps to "browse" state only, verify that the orderId is valid and the
  // associated Part record exists before deriving UI state, and confirm that no additional states
  // (e.g. "loading", "error") need to be handled beyond the three mapped here.

  const isInEditMode = newState === "edit" || newState === "insert";
  const isInBrowseMode = newState === "browse";

  const postEnabled = isInEditMode;
  const cancelEnabled = isInEditMode;
  const closeEnabled = isInBrowseMode;

  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      part: {
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
      },
    },
  });

  return {
    postEnabled,
    cancelEnabled,
    closeEnabled,
    part: order?.part ?? null,
  };
}