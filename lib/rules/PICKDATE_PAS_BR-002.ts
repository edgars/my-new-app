async function getNextcustDate(
  prisma: PrismaClient,
  nextcustId: string
): Promise<Date> {
  // TODO(rnc): verify that the Calendar1.CalendarDate equivalent is the `newcust` field on Nextcust,
  // and that no additional timezone normalization or date-only truncation is required before returning.

  const nextcust = await prisma.nextcust.findUniqueOrThrow({
    where: { id: nextcustId },
    select: { newcust: true },
  });

  if (!nextcust.newcust) {
    throw new Error(`Nextcust ${nextcustId} has no date value in newcust field`);
  }

  return nextcust.newcust;
}