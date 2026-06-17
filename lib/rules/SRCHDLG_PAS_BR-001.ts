export async function getCustNo(custId: string): Promise<number> {
  // TODO(rnc): verify that the Nextcust entity maps correctly to the MastData.CustCustNo field,
  // and that the returned numeric value (Double in Delphi) is safely representable as a JS number.

  const customer = await prisma.nextcust.findUniqueOrThrow({
    where: { id: custId },
    select: { newcust: true },
  });

  const custNo: number = Number(customer.newcust);

  if (isNaN(custNo)) {
    throw new Error(`Invalid CustNo value for customer id: ${custId}`);
  }

  return custNo;
}