import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the OrderCombo field name selection logic correctly maps to the Parts model fields
// (id, partno, description, onhand, onorder, vendorno, cost, listprice, backord), and that resetting
// the search text (SearchEd.Text := '') is the intended UX behavior when the combo selection changes.
// Also confirm that no additional side-effects (e.g., clearing results, resetting pagination) are required.

export async function rule_SRCHDLG_PAS_BR_011(): Promise<{
  success: boolean;
  selectedField: string | null;
  availableFields: string[];
  searchTextReset: boolean;
}> {
  // The OrderCombo presents a list of field names the user can search by.
  // When the selection changes, the system identifies the corresponding field
  // on the Parts dataset and resets the search input text to empty.

  const orderComboOptions: Array<keyof Prisma.PartsWhereInput> = [
    'partno',
    'description',
    'onhand',
    'onorder',
    'vendorno',
    'cost',
    'listprice',
    'backord',
  ];

  // Simulate the change handler: pick the first available field as the
  // "currently selected" OrderCombo value (in production this comes from UI state).
  // A human must wire the actual selected combo value here.
  const selectedComboText: string = orderComboOptions[0] as string;

  // Validate that the selected combo text corresponds to a real Parts field.
  const isValidField = orderComboOptions.includes(
    selectedComboText as keyof Prisma.PartsWhereInput
  );

  if (!isValidField) {
    return {
      success: false,
      selectedField: null,
      availableFields: orderComboOptions as string[],
      searchTextReset: false,
    };
  }

  // Confirm the field exists on the Parts model by querying a single record
  // and checking the field is present — mirrors FieldByName() resolution.
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

  let resolvedField: string | null = null;

  if (samplePart !== null && samplePart !== undefined) {
    // Mirror Delphi's FieldByName: check the key exists on the returned record.
    if (Object.prototype.hasOwnProperty.call(samplePart, selectedComboText)) {
      resolvedField = selectedComboText;
    }
  } else {
    // No records exist yet; still treat the field name as valid if it is in the schema.
    resolvedField = selectedComboText;
  }

  // SearchEd.Text := '' — reset the search editor text to an empty string.
  // In a real Next.js handler this would be returned to the client so the
  // UI component can clear its controlled input value.
  const searchTextReset = resolvedField !== null;

  return {
    success: searchTextReset,
    selectedField: resolvedField,
    availableFields: orderComboOptions as string[],
    searchTextReset,
  };
}