import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that this rule correctly mirrors the Delphi SearchEd onChange logic —
// specifically confirm that "SearchButton.Enabled := SearchEd.Text <> ''" means the search
// action should only proceed (and return results) when a non-empty search term is provided,
// and that the Parts fields searched here (partno, description) match the actual SearchEd
// target columns used in the original form. Also confirm whether the search should be
// case-insensitive and whether partial (contains) matching is the intended behaviour.

export async function rule_SRCHDLG_PAS_BR_014(
  searchText?: string
): Promise<{
  searchEnabled: boolean;
  results: Array<{
    id: number;
    partno: string | null;
    description: string | null;
    onhand: number | null;
    onorder: number | null;
    vendorno: string | null;
    cost: number | null;
    listprice: number | null;
    backord: number | null;
  }>;
}> {
  // Replicate: SearchButton.Enabled := SearchEd.Text <> '';
  // If the search text is empty/undefined, the search button would be disabled —
  // return early with searchEnabled = false and no results.
  const trimmedSearch = (searchText ?? '').trim();

  if (trimmedSearch === '') {
    return {
      searchEnabled: false,
      results: [],
    };
  }

  // Search is enabled — perform the Parts lookup.
  const results = await prisma.$transaction(async (tx) => {
    const matchingParts = await tx.parts.findMany({
      where: {
        OR: [
          {
            partno: {
              contains: trimmedSearch,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            description: {
              contains: trimmedSearch,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      },
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
      orderBy: [
        { partno: 'asc' },
      ],
    });

    return matchingParts;
  });

  return {
    searchEnabled: true,
    results,
  };
}