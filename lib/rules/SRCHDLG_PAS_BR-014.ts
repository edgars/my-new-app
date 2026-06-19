import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the search term used here matches the intended field(s)
// on the Parts model (e.g. partno, description) and that the enable/disable
// logic mirrors the original Delphi SearchButton.Enabled := SearchEd.Text <> '';
// A human must confirm which Part fields should be searched and whether
// additional filtering (e.g. by vendor, active status) is required.

export async function rule_SRCHDLG_PAS_BR_014(): Promise<{
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
  // TODO(rnc): verify — the original rule enables the Search button only when
  // SearchEd.Text is non-empty. Here we simulate a non-empty search term via a
  // placeholder; in production this value must come from validated request input
  // (e.g. a query parameter or request body parsed upstream in the App Router
  // route handler). Confirm the search fields (partno, description) are correct.

  const searchTerm: string = ''; // Replace with actual runtime input

  // Mirror the Delphi condition: SearchButton.Enabled := SearchEd.Text <> '';
  const searchEnabled = searchTerm.trim() !== '';

  if (!searchEnabled) {
    // Search button would be disabled — return early with no results,
    // matching the original behaviour where no search is performed.
    return {
      searchEnabled: false,
      results: [],
    };
  }

  // Search is enabled — execute the query within a transaction so that any
  // future multi-step writes added here remain atomic.
  const results = await prisma.$transaction(async (tx) => {
    const matchingParts = await tx.parts.findMany({
      where: {
        OR: [
          {
            partno: {
              contains: searchTerm.trim(),
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            description: {
              contains: searchTerm.trim(),
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
      orderBy: {
        partno: 'asc',
      },
    });

    return matchingParts;
  });

  return {
    searchEnabled: true,
    results,
  };
}