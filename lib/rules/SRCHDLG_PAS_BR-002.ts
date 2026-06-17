export async function setCustNo(newCustNo: number): Promise<Nextcust | null> {
  // TODO(rnc): verify that 'newcust' is the correct field name mapping to 'CustNo' in the original Delphi source,
  // and confirm that the intended behavior is a lookup/find (not an upsert or create),
  // matching the Locate() semantics which simply positions the dataset cursor on the matching record.

  const result = await prisma.nextcust.findFirst({
    where: {
      newcust: newCustNo,
    },
  });

  return result;
}