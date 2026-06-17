async function getCustNo(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that the first field (index 0) of the CustMaster dataset maps to the correct
  // primary key or customer number column in the Nextcust model, and that AsFloat semantics
  // (returning a Double) are acceptable as a numeric type in the Prisma schema for newcust.

  const firstCustomer = await prisma.nextcust.findFirst({
    orderBy: {
      id: "asc",
    },
  });

  if (!firstCustomer) {
    return res.status(404).json({ error: "No customer record found" });
  }

  const custNo: number = parseFloat(String(firstCustomer.newcust));

  if (isNaN(custNo)) {
    return res.status(422).json({ error: "Customer number field could not be parsed as a numeric value" });
  }

  return res.status(200).json({ custNo });
}