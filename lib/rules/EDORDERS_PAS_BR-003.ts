import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function rule_EDORDERS_PAS_BR_003(): Promise<{
  parts: Array<{
    id: number;
    partno: string | null;
    description: string | null;
    onhand: number | null;
    onorder: number | null;
    vendorno: number | null;
    cost: number | null;
    listprice: number | null;
    backord: number | null;
  }>;
}> {
  // TODO(rnc): verify that this function correctly mirrors the Delphi "Enter handler on ItemsGrid"
  // which sets ActiveSource.Dataset := MastData.Items — meaning the active data source for the
  // items grid should be bound to the Parts dataset. Confirm that fetching all Parts records
  // is the correct scope (e.g., should it be filtered by a specific order, vendor, or other
  // context that was available at runtime in the original Delphi form but is not captured here).
  // Also confirm sort order, pagination requirements, and whether backord/onorder filtering applies.

  const parts = await prisma.$transaction(async (tx) => {
    const allParts = await tx.parts.findMany({
      select: {
        id: true,
        partno: true,
        description: true,
        onhand: true,
        onorder: true,
        vendorno: true,
        cost: true,
        listprice: true,
        backord: true,
      },
      orderBy: {
        partno: 'asc',
      },
    });

    return allParts;
  });

  return { parts };
}