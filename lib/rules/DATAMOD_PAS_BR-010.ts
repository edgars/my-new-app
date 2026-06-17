export async function partsBeforeOpen(
  req: import("next").NextApiRequest,
  res: import("next").NextApiResponse
) {
  // TODO(rnc): verify that "Vendors" in the original Delphi procedure maps correctly to the Vendor (or equivalent) model in Prisma, and confirm that "opening" the Vendors dataset is equivalent to fetching/loading all vendor records as a prerequisite before working with Nextcust/newcust data — also confirm whether filtering, ordering, or pagination is required here.

  try {
    const vendors = await prisma.vendor.findMany();

    const nextcustRecords = await prisma.nextcust.findMany({
      where: {
        newcust: true,
      },
    });

    return res.status(200).json({
      vendors,
      nextcustRecords,
    });
  } catch (error) {
    console.error("partsBeforeOpen error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}