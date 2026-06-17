export async function editNextcust(custNo: number): Promise<Nextcust | null> {
  // TODO(rnc): verify that custNo is a valid double-compatible identifier in the Nextcust table,
  // confirm that the Locate('CustNo', CustNo, []) semantics map correctly to a unique lookup by
  // custNo (no partial/case-insensitive matching), and ensure that the original ShowModal side
  // effects (UI presentation, user edits, save-on-close) are handled by the calling layer since
  // this handler only performs the data retrieval equivalent of the Delphi Open+Locate sequence.

  const record = await prisma.nextcust.findFirst({
    where: {
      newcust: custNo,
    },
  });

  if (!record) {
    return null;
  }

  return record;
}