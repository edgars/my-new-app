async function setOrderNo(newOrderNo: number): Promise<Part | null> {
  // TODO(rnc): verify that this procedure is intended to locate/fetch a Part record
  // associated with the given OrderNo, and confirm the correct relationship between
  // Parts and Orders in the schema (e.g., Parts linked via vendorno or a join table).
  // Also confirm whether a "not found" case should throw or return null.

  const part = await prisma.part.findFirst({
    where: {
      orderNo: newOrderNo,
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
  });

  return part;
}