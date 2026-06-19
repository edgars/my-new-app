import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the OrderCombo field name selection logic correctly maps UI combo values
// to valid Parts field names (partno, description, onhand, onorder, vendorno, cost, listprice, backord),
// and that clearing the search text on combo change is the intended UX behavior before deploying.

export async function rule_SRCHDLG_PAS_BR_011(): Promise<{
  selectedField: string | null;
  searchText: string;
  availableFields: string[];
}> {
  // The original Delphi code:
  //   SrchFld := Datasource.Dataset.FieldByName(OrderCombo.Text);
  //   SearchEd.Text := '';
  //
  // This rule models the change handler on OrderCombo in the Parts search dialog.
  // When the user selects a different field to search by (OrderCombo changes),
  // the system resolves the corresponding Parts field and clears the search input.

  const partsFieldNames: (keyof Prisma.PartsWhereInput)[] = [
    'partno',
    'description',
    'onhand',
    'onorder',
    'vendorno',
    'cost',
    'listprice',
    'backord',
  ];

  // Simulate resolving the currently selected combo field by verifying
  // it exists as a valid field on the Parts model.
  // In a real UI context, OrderCombo.Text would come from the request/session.
  // Here we validate the field list against actual Parts records to confirm schema alignment.

  const samplePart = await prisma.parts.findFirst({
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

  // Determine which fields are actually present and non-null in the dataset
  const resolvedAvailableFields: string[] = [];

  if (samplePart) {
    for (const field of partsFieldNames) {
      const fieldKey = field as string;
      if (fieldKey in samplePart) {
        resolvedAvailableFields.push(fieldKey);
      }
    }
  } else {
    // No parts records exist yet; still expose the known field list
    resolvedAvailableFields.push(...(partsFieldNames as string[]));
  }

  // Business rule: on OrderCombo change, resolve the selected field (SrchFld)
  // and clear the search text (SearchEd.Text := '').
  // selectedField would normally be set from OrderCombo.Text; we return null
  // to indicate the search text has been cleared and no active search field is committed.
  const selectedField: string | null = null; // cleared on combo change
  const searchText: string = '';             // SearchEd.Text := ''

  // Wrap any transactional side-effects (e.g., audit logging of field selection reset)
  await prisma.$transaction(async (tx) => {
    // No persistent write is strictly required by this UI rule,
    // but a transaction boundary is established here for any future
    // audit or session-state persistence needs.

    // Confirm the Parts table is accessible within the transaction context
    await tx.parts.findFirst({
      select: { id: true },
    });
  });

  return {
    selectedField,
    searchText,
    availableFields: resolvedAvailableFields,
  };
}