import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the OrderCombo field name selection logic maps correctly to the Parts model fields
// (id, partno, description, onhand, onorder, vendorno, cost, listprice, backord), and that resetting
// the search text (SearchEd.Text := '') is the only side effect required — confirm no additional
// filtering, sorting, or UI state changes are needed beyond clearing the active search field reference.

export async function rule_SRCHDLG_PAS_BR_011(): Promise<{
  success: boolean;
  selectedField: string | null;
  clearedSearchText: string;
  availableFields: string[];
}> {
  // The original Delphi logic:
  //   SrchFld := Datasource.Dataset.FieldByName(OrderCombo.Text);
  //   SearchEd.Text := '';
  //
  // This rule models the change handler on OrderCombo in a search dialog bound to the Parts dataset.
  // When the user selects a field name from OrderCombo, the active search field (SrchFld) is resolved
  // from the Parts dataset, and the search input (SearchEd) is cleared.

  const partsFields: (keyof Prisma.PartsWhereInput)[] = [
    'id',
    'partno',
    'description',
    'onhand',
    'onorder',
    'vendorno',
    'cost',
    'listprice',
    'backord',
  ];

  // Simulate resolving the dataset field list from the Parts model.
  // In the original Delphi code, OrderCombo is populated with field names from the Parts dataset.
  // Here we verify the Parts table is accessible and retrieve a representative record to confirm
  // the dataset is live and the field names are valid.

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

  // Determine which field names are actually resolvable (non-null keys present in the dataset).
  // This mirrors FieldByName() — only fields that exist on the model are valid selections.
  const resolvedFields: string[] = partsFields.filter((field) => {
    if (!samplePart) return true; // If no data, all schema fields are still valid by definition
    return field in samplePart;
  });

  // Simulate the OrderCombo selection: default to the first available field (as if the combo
  // just changed to its first item), mirroring the Delphi handler firing on combo change.
  const selectedField: string | null =
    resolvedFields.length > 0 ? resolvedFields[0] : null;

  // SrchFld := Datasource.Dataset.FieldByName(OrderCombo.Text)
  // Validate that the selected field name resolves to a known Parts field.
  const isValidField =
    selectedField !== null && partsFields.includes(selectedField as keyof Prisma.PartsWhereInput);

  if (!isValidField) {
    return {
      success: false,
      selectedField: null,
      clearedSearchText: '',
      availableFields: resolvedFields,
    };
  }

  // SearchEd.Text := ''
  // The search editor text is cleared whenever the combo selection changes.
  const clearedSearchText = '';

  return {
    success: true,
    selectedField,
    clearedSearchText,
    availableFields: resolvedFields,
  };
}