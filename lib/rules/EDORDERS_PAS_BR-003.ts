import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function rule_EDORDERS_PAS_BR_003(): Promise<{
  parts: Prisma.PartsGetPayload<object>[];
  activeSourceDataset: string;
}> {
  // TODO(rnc): verify that this rule correctly mirrors the Delphi "Enter: ItemsGrid" handler,
  // which sets ActiveSource.Dataset := MastData.Items — confirm that fetching all Parts records
  // is the intended "active dataset" behavior, and that no additional filtering (e.g. by order,
  // vendor, or active status) should be applied before returning the Parts list to the grid.

  const parts = await prisma.$transaction(async (tx) => {
    // Replicate MastData.Items dataset activation: load all Parts records
    // that are relevant for the ItemsGrid, joining vendor context for display.
    const allParts = await tx.parts.findMany({
      orderBy: [
        { partno: 'asc' },
      ],
    });

    // Validate that each part referencing a vendor has an active vendor record.
    // This mirrors the implicit dataset integrity expected when activating Items.
    const vendorNos = [
      ...new Set(
        allParts
          .map((p) => p.vendorno)
          .filter((v): v is string => v !== null && v !== undefined && v !== ''),
      ),
    ];

    if (vendorNos.length > 0) {
      const activeVendors = await tx.vendors.findMany({
        where: {
          vendorName: { in: vendorNos },
          activeStatus: true,
        },
        select: { vendorName: true },
      });

      const activeVendorSet = new Set(activeVendors.map((v) => v.vendorName));

      // Log any parts whose vendor is inactive or missing — a human must decide
      // whether to surface this as a validation error or a warning in the UI.
      const partsWithInactiveVendor = allParts.filter(
        (p) =>
          p.vendorno !== null &&
          p.vendorno !== undefined &&
          p.vendorno !== '' &&
          !activeVendorSet.has(p.vendorno),
      );

      if (partsWithInactiveVendor.length > 0) {
        // Surface as a non-fatal warning; the grid still loads all parts.
        console.warn(
          '[rule_EDORDERS_PAS_BR_003] Parts referencing inactive or unknown vendors:',
          partsWithInactiveVendor.map((p) => ({
            id: p.id,
            partno: p.partno,
            vendorno: p.vendorno,
          })),
        );
      }
    }

    return allParts;
  });

  // Return the activated dataset name alongside the records so the caller
  // can bind the result to the ItemsGrid in the same way Delphi set
  // ActiveSource.Dataset := MastData.Items.
  return {
    parts,
    activeSourceDataset: 'MastData.Items',
  };
}