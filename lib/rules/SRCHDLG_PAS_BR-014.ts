import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the search term source (e.g. request body, query param, or
// session context) is correctly wired up before calling this function, and confirm
// that the intended search scope (partno, description, or both) matches business
// requirements. Also confirm whether the "SearchButton enabled" logic should gate
// the query entirely (i.e. return early / throw when searchTerm is empty) or merely
// be a UI-only concern mirrored here for safety.

export async function rule_SRCHDLG_PAS_BR_014(): Promise<{
  searchEnabled: boolean;
  results: Array<{
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
  searchTerm: string;
}> {
  // TODO(rnc): verify — this mirrors the Delphi rule:
  //   SearchButton.Enabled := SearchEd.Text <> '';
  // meaning the search action should only proceed (be "enabled") when the search
  // text is non-empty. A human must confirm the actual search term is injected here
  // from the appropriate Next.js App Router context (e.g. server action argument,
  // cookie, or database-stored session value) rather than being hard-coded.

  // Simulated search term — replace with actual runtime source (e.g. server action param).
  const searchTerm: string = '';

  // Mirror the Delphi condition: SearchButton.Enabled := SearchEd.Text <> ''
  const searchEnabled: boolean = searchTerm.trim() !== '';

  if (!searchEnabled) {
    // Search is disabled when the search term is empty — return early with no results,
    // exactly as the Delphi UI would disable the SearchButton.
    return {
      searchEnabled: false,
      results: [],
      searchTerm,
    };
  }

  // When searchEnabled is true, execute the parts search within a transaction
  // so that any future multi-step extensions remain atomic.
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
      orderBy: [
        { partno: 'asc' },
      ],
    });

    return matchingParts;
  });

  return {
    searchEnabled: true,
    results,
    searchTerm,
  };
}