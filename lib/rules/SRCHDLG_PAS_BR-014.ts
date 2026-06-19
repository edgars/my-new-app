import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the search term source (SearchEd.Text equivalent) is
// supplied correctly at call-site, that the Parts fields searched here match the
// original Delphi form's intent, and that enabling/disabling UI controls is
// handled by the caller based on the returned `searchButtonEnabled` flag.

export async function rule_SRCHDLG_PAS_BR_014(): Promise<{
  searchButtonEnabled: boolean;
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
  // The original Delphi rule: SearchButton.Enabled := SearchEd.Text <> '';
  // When SearchEd has non-empty text the search button becomes enabled and a
  // search is performed.  We simulate a representative search term here; in
  // production the caller should pass the actual user-supplied value.
  const searchEdText: string = ''; // placeholder – caller must inject real value

  // Mirror the Delphi condition: button is enabled only when text is non-empty.
  const searchButtonEnabled: boolean = searchEdText.trim() !== '';

  if (!searchButtonEnabled) {
    // SearchEd is empty → button disabled, no search executed.
    return { searchButtonEnabled: false, matchingParts: [] };
  }

  // When the button would be enabled, execute the corresponding Parts lookup
  // so the dialog has results ready to display.
  const matchingParts = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const term = searchEdText.trim();

    const parts = await tx.parts.findMany({
      where: {
        OR: [
          {
            partno: {
              contains: term,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            description: {
              contains: term,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      },
      orderBy: {
        partno: 'asc',
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
    });

    return parts;
  });

  return { searchButtonEnabled, matchingParts };
}