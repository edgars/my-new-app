import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the OrderCombo field name selection logic maps correctly to the Parts/Orders/Items
// schema fields available here, and that clearing the search text (SearchEd.Text := '') is fully represented
// by resetting the searchText output field to an empty string. Also confirm which entity's dataset the
// original Datasource.Dataset refers to (assumed to be Parts here based on primary entity).

export async function rule_SRCHDLG_PAS_BR_011(): Promise<{
  selectedFieldName: string | null;
  searchText: string;
  availableFields: string[];
}> {
  // TODO(rnc): verify - human must confirm:
  // 1. The OrderCombo dropdown is populated with field names from the Parts dataset (primary entity).
  // 2. The "change handler" logic here should select a valid field name from Parts and reset search text.
  // 3. The original Delphi code calls FieldByName(OrderCombo.Text) to validate the field exists on the dataset;
  //    replicate that validation by checking against known Parts field names.
  // 4. If the primary entity dataset differs (e.g. Orders), update availableFields accordingly.

  const partsFieldNames: string[] = [
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

  // Simulate reading the current OrderCombo selection.
  // In a real Next.js handler this value would come from request parameters.
  // Here we default to the first available field to represent the change-handler firing.
  const orderComboText: string = partsFieldNames[0];

  // Replicate: SrchFld := Datasource.Dataset.FieldByName(OrderCombo.Text)
  // Validate that the selected combo value corresponds to a real field on the Parts model.
  const selectedFieldName: string | null = partsFieldNames.includes(orderComboText)
    ? orderComboText
    : null;

  if (selectedFieldName === null) {
    // The field named by OrderCombo.Text does not exist on the dataset.
    // Return with cleared search text and no valid field selected.
    return {
      selectedFieldName: null,
      searchText: '',
      availableFields: partsFieldNames,
    };
  }

  // Replicate: SearchEd.Text := ''
  // Clear the search editor text whenever the OrderCombo selection changes.
  const searchText: string = '';

  // Optionally verify the selected field actually has data in the Parts table
  // by fetching a sample record — this mirrors the dataset being live/active.
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Read one Parts record to confirm the dataset/table is accessible and
    // the field is queryable. No writes are performed; this is a read-only
    // validation consistent with the original change-handler behaviour.
    const samplePart = await tx.parts.findFirst({
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

    if (!samplePart) {
      // No parts exist; the dataset is empty. The combo change is still valid —
      // the search text is cleared and the field selection is recorded.
      return;
    }

    // Confirm the selectedFieldName key exists on the retrieved record,
    // mirroring FieldByName raising an exception for unknown fields.
    const fieldExists = Object.prototype.hasOwnProperty.call(samplePart, selectedFieldName);
    if (!fieldExists) {
      throw new Error(
        `rule_SRCHDLG_PAS_BR_011: Field "${selectedFieldName}" does not exist on Parts dataset.`
      );
    }
  });

  return {
    selectedFieldName,
    searchText,
    availableFields: partsFieldNames,
  };
}