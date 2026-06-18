import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the search term used here reflects the actual runtime input
// that would be typed into SearchEd in the original Delphi form; confirm that the
// field(s) searched (partno, description) match the intended search scope, and that
// the "SearchButton.Enabled := SearchEd.Text <> ''" logic is correctly represented
// as a guard that skips the query when the search term is empty.

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
  searchTerm: string;
}> {
  // TODO(rnc): verify — in production this searchTerm must come from actual user input
  // (e.g. a request body or query param). Here it is stubbed as an empty string to
  // faithfully model the initial state where SearchButton.Enabled = false.
  const searchTerm: string = '';

  // Mirror the Delphi rule: SearchButton.Enabled := SearchEd.Text <> ''
  // When the search field is empty the button is disabled — no query is executed.
  const searchEnabled: boolean = searchTerm.trim() !== '';

  if (!searchEnabled) {
    return {
      searchEnabled: false,
      results: [],
      searchTerm,
    };
  }

  // When a non-empty search term is present the button becomes enabled and a
  // search across Parts is performed.
  const results = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const trimmed = searchTerm.trim();

    const parts = await tx.parts.findMany({
      where: {
        OR: [
          {
            partno: {
              contains: trimmed,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            description: {
              contains: trimmed,
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

    return parts;
  });

  return {
    searchEnabled: true,
    results,
    searchTerm,
  };
}