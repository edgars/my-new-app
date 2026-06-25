import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the OrderCombo field name selection logic correctly maps UI combo values
// to valid Parts field names (partno, description, onhand, onorder, vendorno, cost, listprice, backord),
// and that clearing the search text (SearchEd) on combo change is the intended UX behavior before
// executing any filtered queries against prisma.parts.

export async function rule_SRCHDLG_PAS_BR_011(): Promise<{
  selectedField: string | null;
  searchTextCleared: boolean;
  availableSearchFields: string[];
}> {
  // TODO(rnc): verify that the list of searchable fields below matches exactly what
  // OrderCombo presents to the user in the original Delphi form, and confirm that
  // resetting the search input on combo change is acceptable in the migrated UI.

  const availableSearchFields: Array<keyof Prisma.PartsWhereInput> = [
    'partno',
    'description',
    'onhand',
    'onorder',
    'vendorno',
    'cost',
    'listprice',
    'backord',
  ];

  // Simulate the change handler: when OrderCombo selection changes,
  // determine the currently selected field and clear the search text.
  // In the original Delphi code:
  //   SrchFld := Datasource.Dataset.FieldByName(OrderCombo.Text);
  //   SearchEd.Text := '';
  // Here we validate that the selected field exists on the Parts model
  // and return a cleared search state.

  const result = await prisma.$transaction(async (tx) => {
    // Fetch a representative Parts record to confirm the model is accessible
    // and to validate that the field resolution would succeed at runtime.
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
      // No parts exist yet; field resolution still proceeds with known schema.
      return {
        selectedField: null,
        searchTextCleared: true,
        availableSearchFields: availableSearchFields as string[],
        note: 'Parts table is empty; field list derived from schema only.',
      };
    }

    // Validate that every field in availableSearchFields is actually present
    // on the retrieved record (mirrors FieldByName resolution in Delphi).
    const resolvedFields = availableSearchFields.filter(
      (field) => field in samplePart,
    );

    // The combo change handler sets SrchFld to the dataset field matching
    // OrderCombo.Text and clears SearchEd.Text. We represent this by:
    //   - selectedField: the first valid field (default/reset state)
    //   - searchTextCleared: true (mirrors SearchEd.Text := '')
    const selectedField =
      resolvedFields.length > 0 ? (resolvedFields[0] as string) : null;

    return {
      selectedField,
      searchTextCleared: true, // mirrors SearchEd.Text := ''
      availableSearchFields: resolvedFields as string[],
    };
  });

  return result;
}