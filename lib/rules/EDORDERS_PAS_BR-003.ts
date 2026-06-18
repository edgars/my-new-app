import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function rule_EDORDERS_PAS_BR_003(): Promise<{
  items: Array<{
    id: number;
    itemno: number | null;
    orderno: number | null;
    description: string | null;
    sellprice: number | null;
    qty: number | null;
    discount: number | null;
    extprice: number | null;
    partno: string | null;
  }>;
}> {
  // TODO(rnc): verify that the calling context supplies the active orderno used to
  // filter Items records, and confirm that switching the ActiveSource dataset to
  // MastData.Items is fully represented by returning the Items rows here (i.e. no
  // additional UI-binding side-effects need to be replicated server-side).

  const result = await prisma.$transaction(async (tx) => {
    // Replicate "ActiveSource.Dataset := MastData.Items":
    // The active dataset is now the Items table, scoped to the current order
    // context.  Because this is a server-side rule we return ALL Items rows so
    // the caller can filter / bind them to the appropriate order.

    const items = await tx.items.findMany({
      orderBy: [
        { orderno: 'asc' },
        { itemno: 'asc' },
      ],
      select: {
        id: true,
        itemno: true,
        orderno: true,
        description: true,
        sellprice: true,
        qty: true,
        discount: true,
        extprice: true,
        partno: true,
      },
    });

    return { items };
  });

  return result;
}