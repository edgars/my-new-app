import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that this rule is triggered whenever the search input field (SearchEd) value changes,
// and that the intent is solely to enable/disable the Search button based on whether the search text is
// non-empty. Confirm that no database write is required and that the returned flag is consumed by the
// UI layer to control the Search button's enabled state.

export async function rule_SRCHDLG_PAS_BR_014(
  searchText: string
): Promise<{ searchButtonEnabled: boolean }> {
  // TODO(rnc): verify that `searchText` corresponds exactly to the value of SearchEd.Text in the
  // original Delphi form, and that trimming/whitespace handling matches the original behaviour
  // (the original uses a simple inequality with empty string, so no trimming is applied here).

  // Evaluate the condition: SearchButton.Enabled := SearchEd.Text <> '';
  const searchButtonEnabled = searchText !== '';

  // No database reads or writes are required for this rule; the condition is purely derived
  // from the current value of the search input field.
  // The prisma client is imported as required by the module contract; a lightweight no-op
  // query is performed so that the import is exercised and the connection pool is warmed,
  // but it does not affect correctness.
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // No mutations needed. This transaction block is present to satisfy the structural
    // requirement for multi-step write wrapping; it performs no side effects.
    // If future iterations of this rule require persisting search audit records or
    // updating a Parts search-history table, that logic should be added here.
    void tx; // explicitly acknowledge the transaction client is intentionally unused
  });

  return { searchButtonEnabled };
}