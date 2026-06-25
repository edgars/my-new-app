import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the search term source (e.g. request body, query param, or
// session context) is correctly wired up before calling this function, and that the
// returned parts list is consumed by the appropriate UI layer. Also confirm that
// partial/case-insensitive matching behaviour matches the original Delphi SearchEd logic.

export async function rule_SRCHDLG_PAS_BR_014(): Promise<{
  searchEnabled: boolean;
  searchTerm: string;
  matchedParts: Array<{
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
  // TODO(rnc): verify — in the original Delphi code, SearchButton.Enabled is set to
  // (SearchEd.Text <> ''), meaning the search action is only permitted when the search
  // field is non-empty. A human must confirm: (1) where the search term is sourced from
  // at runtime (request, session, env, etc.), (2) that the empty-string guard below
  // faithfully replicates the Delphi condition, and (3) that case-insensitive LIKE
  // matching is acceptable for the target database engine.

  // Simulate the SearchEd.Text value — in production this would come from a
  // validated request parameter; placeholder empty string disables the search.
  const searchEdText: string = '';

  // Mirror: SearchButton.Enabled := SearchEd.Text <> '';
  const searchEnabled: boolean = searchEdText.trim() !== '';

  if (!searchEnabled) {
    // Search is disabled (SearchEd is empty) — return early with no results,
    // exactly as the Delphi form would disable the SearchButton.
    return {
      searchEnabled: false,
      searchTerm: searchEdText,
      matchedParts: [],
    };
  }

  // When the search term is non-empty the button is enabled and a search may proceed.
  // Execute the parts lookup inside a transaction so any future multi-step extensions
  // remain atomic.
  const matchedParts = await prisma.$transaction(async (tx) => {
    const term = `%${searchEdText.trim()}%`;

    const parts = await tx.parts.findMany({
      where: {
        OR: [
          {
            partno: {
              contains: searchEdText.trim(),
              // Note: case sensitivity depends on DB collation; adjust mode if needed.
            },
          },
          {
            description: {
              contains: searchEdText.trim(),
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
    searchTerm: searchEdText,
    matchedParts,
  };
}