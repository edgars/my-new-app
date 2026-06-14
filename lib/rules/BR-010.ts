async function partsBeforeOpen() {
  // TODO(rnc): verify that opening the Parts dataset triggers the vendor validation check to ensure all referenced vendors exist before proceeding
  const prisma = new PrismaClient();
  
  try {
    await prisma.$transaction(async (tx) => {
      // This procedure appears to validate vendor references exist before opening parts data
      // The original Delphi code calls Vendors.Open which likely validates foreign key relationships
      // In Prisma context, we ensure referential integrity by checking vendor existence
      
      const partsWithInvalidVendors = await tx.part.findMany({
        where: {
          vendorno: {
            not: null
          }
        },
        select: {
          partno: true,
          vendorno: true
        }
      });
      
      if (partsWithInvalidVendors.length > 0) {
        // Verify all referenced vendors exist
        const vendorIds = partsWithInvalidVendors.map(p => p.vendorno);
        const existingVendors = await tx.vendor.findMany({
          where: {
            vendorno: {
              in: vendorIds as number[]
            }
          },
          select: {
            vendorno: true
          }
        });
        
        const existingVendorIds = new Set(existingVendors.map(v => v.vendorno));
        const invalidParts = partsWithInvalidVendors.filter(p => !existingVendorIds.has(p.vendorno as number));
        
        if (invalidParts.length > 0) {
          throw new Error(`Parts reference non-existent vendors: ${invalidParts.map(p => p.partno).join(', ')}`);
        }
      }
    });
  } finally {
    await prisma.$disconnect();
  }
}