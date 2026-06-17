import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that this rule is triggered whenever the search input value changes,
// and confirm that "SearchButton.Enabled" maps to a UI state flag or a returned boolean
// that the frontend uses to enable/disable the search button. Also confirm that the
// Parts entity is the correct primary search target for this dialog context.

export async function rule_SRCHDLG_PAS_BR_014(): Promise<{
  searchButtonEnabled: boolean;
  searchText: string;
  matchingParts: Array<{
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
  // TODO(rnc): verify that searchText is sourced from a real request context (e.g. query param,
  // request body, or session) rather than a hardcoded empty string used here as a stand-in.
  // Replace the placeholder below with the actual runtime value from the calling context.
  const searchText: string = '';

  // Replicate Delphi logic:
  //   SearchButton.Enabled := SearchEd.Text <> '';
  // i.e. the search button is only enabled (and a search is only meaningful) when
  // the search field is non-empty.
  const searchButtonEnabled: boolean = searchText.trim() !== '';

  if (!searchButtonEnabled) {
    // Search field is empty — return early with button disabled and no results,
    // mirroring the Delphi behaviour where the button would simply be disabled.
    return {
      searchButtonEnabled: false,
      searchText,
      matchingParts: [],
    };
  }

  // When the search field is non-empty the button is enabled; perform the
  // corresponding Parts lookup so the caller has data ready to display.
  const matchingParts = await prisma.$transaction(async (tx) => {
    const parts = await tx.parts.findMany({
      where: {
        OR: [
          {
            partno: {
              contains: searchText,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            description: {
              contains: searchText,
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
    searchButtonEnabled,
    searchText,
    matchingParts,
  };
}