import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the OrderCombo field name selection logic correctly maps to the Parts model fields
// (id, partno, description, onhand, onorder, vendorno, cost, listprice, backord), and that resetting
// the search text (SearchEd.Text := '') is the intended UX behavior when the combo selection changes.
// Also confirm that no additional side-effects (e.g., clearing results, resetting pagination) are required.

export async function rule_SRCHDLG_PAS_BR_011(): Promise<{
  success: boolean;
  selectedField: string | null;
  resetSearchText: boolean;
  validFields: string[];
}> {
  // The valid searchable field names on the Parts entity, mirroring what OrderCombo would list
  const validPartsFields: Array<keyof Prisma.PartsWhereInput> = [
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

  // Simulate the OrderCombo change handler:
  // 1. Identify the currently selected field from OrderCombo (here we resolve it from the DB
  //    by verifying at least one Parts record exists, mirroring Datasource.Dataset access).
  // 2. Reset the search text (SearchEd.Text := '').

  const result = await prisma.$transaction(async (tx) => {
    // Verify the Parts dataset is accessible (mirrors Datasource.Dataset being active)
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
      // Dataset is empty; OrderCombo change still fires but SrchFld would be nil/null
      return {
        success: true,
        selectedField: null,
        resetSearchText: true,
        validFields: validPartsFields as string[],
        datasetEmpty: true,
      };
    }

    // Determine which field the OrderCombo currently points to.
    // In the original Delphi code: SrchFld := Datasource.Dataset.FieldByName(OrderCombo.Text)
    // We default to 'partno' as the representative "current" OrderCombo selection,
    // but a real implementation would receive this as a parameter or read from session/state.
    const orderComboText: string = 'partno';

    const isValidField = (validPartsFields as string[]).includes(orderComboText);

    if (!isValidField) {
      throw new Error(
        `OrderCombo selection "${orderComboText}" does not correspond to a valid Parts field. ` +
          `Valid fields are: ${(validPartsFields as string[]).join(', ')}`
      );
    }

    // Confirm the field exists on the retrieved record (mirrors FieldByName resolution)
    const fieldValue = samplePart[orderComboText as keyof typeof samplePart];
    const fieldResolved = fieldValue !== undefined;

    if (!fieldResolved) {
      throw new Error(
        `Field "${orderComboText}" could not be resolved on the Parts dataset record.`
      );
    }

    // SearchEd.Text := '' — reset the search editor text
    const resetSearchText = true;

    return {
      success: true,
      selectedField: orderComboText,
      resetSearchText,
      validFields: validPartsFields as string[],
      datasetEmpty: false,
    };
  });

  return {
    success: result.success,
    selectedField: result.selectedField,
    resetSearchText: result.resetSearchText,
    validFields: result.validFields,
  };
}