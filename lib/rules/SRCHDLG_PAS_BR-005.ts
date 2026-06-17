export async function showModalCust(
  orderBy: "Company" | "CustNo" = "Company"
): Promise<Nextcust[]> {
  // TODO(rnc): verify that the Nextcust model exists in schema.prisma with fields
  // matching the legacy Cust table (e.g. Company, CustNo, and any other columns
  // rendered in the original TSearchDlg grid); confirm that "Company" and "CustNo"
  // are valid sortable field names and that the caller handles the returned list
  // to replicate the ShowModal integer result (selected record index or modal action).

  const orderByClause =
    orderBy === "CustNo"
      ? { custNo: "asc" as const }
      : { company: "asc" as const };

  const customers = await prisma.nextcust.findMany({
    orderBy: orderByClause,
    select: {
      newcust: true,
      company: true,
      custNo: true,
    },
  });

  return customers;
}