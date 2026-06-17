async function handleNextcustDelete(req: NextApiRequest, res: NextApiResponse) {
  // TODO(rnc): verify that deletion should cascade to all related line items (DeleteItems equivalent),
  // confirm the exact child relations to delete, and ensure the confirmation prompt is enforced
  // on the client side before this endpoint is ever called (mirrors the Confirm() guard in TMastData.OrdersBeforeDelete).

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing Nextcust id" });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Delete child line items first to respect referential integrity
      await tx.newcust.deleteMany({
        where: {
          nextcustId: id,
        },
      });

      // Delete the parent Nextcust record
      await tx.nextcust.delete({
        where: {
          id: id,
        },
      });
    });

    return res.status(200).json({ message: "Nextcust and related line items deleted successfully" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({ error: "Nextcust record not found" });
    }
    return res.status(500).json({ error: "Failed to delete Nextcust record" });
  }
}