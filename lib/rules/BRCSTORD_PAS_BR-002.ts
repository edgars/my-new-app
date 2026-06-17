async function setCustNo(newCustNo: number): Promise<Nextcust | null> {
  // TODO(rnc): verify that the Cust dataset lookup by CustNo is equivalent to a unique find here,
  // confirm that CustNo is a unique/indexed field on Nextcust, and that no additional
  // side-effects from setting CustMasterSrc.Dataset need to be replicated server-side.

  const customer = await prisma.nextcust.findFirst({
    where: {
      newcust: newCustNo,
    },
  });

  return customer;
}