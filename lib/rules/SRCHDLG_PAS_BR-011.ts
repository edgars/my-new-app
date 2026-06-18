import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the intended behavior is: when the user changes the selected
// field name in the "OrderCombo" dropdown (which represents a column/field to search by),
// the system should validate that the chosen field name actually exists on the Orders
// dataset, clear any previously entered search text, and return the resolved field
// metadata so the UI can reset its search input accordingly.

export async function rule_SRCHDLG_PAS_BR_011(): Promise<{
  resolvedField: string | null;
  clearedSearchText: string;
  availableOrderFields: string[];
}> {
  // TODO(rnc): verify the following with a human reviewer:
  // 1. The original Delphi code calls FieldByName(OrderCombo.Text) on the Orders dataset —
  //    confirm which field names are valid choices for OrderCombo (they must match the
  //    Orders model fields listed below).
  // 2. Confirm that "clearing SearchEd.Text" maps to returning an empty string here,
  //    and that the caller (UI layer) is responsible for applying it to the input element.
  // 3. Confirm that a missing/invalid field name should return null (not throw), matching
  //    the Delphi behavior where FieldByName returns nil for unknown fields.
  // 4. Confirm that no database write is needed — this is a pure read/metadata operation.

  const availableOrderFields: string[] = [
    'id',
    'orderno',
    'custno',
    'saledate',
    'shipdate',
    'shiptocontact',
    'shiptoaddr1',
    'shiptoaddr2',
    'shiptocity',
    'shiptostate',
    'shiptozip',
    'shiptocountry',
    'shiptophone',
    'shipvia',
    'po',
    'empno',
    'terms',
    'paymentmethod',
    'itemstotal',
    'taxrate',
    'taxtotal',
    'freight',
    'amountpaid',
    'amountdue',
    'salesperson',
  ];

  // Simulate the OrderCombo.Text selection — in a real Next.js handler this value
  // would come from request parameters; here we demonstrate the rule logic by
  // attempting to resolve the first available field as a representative default.
  // The caller must supply the actual selected field name and replace this placeholder.
  const orderComboText: string = availableOrderFields[0]; // placeholder — caller must override

  // Replicate: SrchFld := Datasource.Dataset.FieldByName(OrderCombo.Text)
  // Validate that the chosen field name exists in the Orders schema.
  const resolvedField: string | null = availableOrderFields.includes(orderComboText)
    ? orderComboText
    : null;

  if (resolvedField !== null) {
    // Confirm the field is actually queryable by fetching a minimal Orders record
    // selecting only that field — mirrors the dataset field resolution in Delphi.
    await prisma.$transaction(async (tx) => {
      // Build a dynamic select object containing only the resolved field.
      const selectClause: Record<string, boolean> = {};
      selectClause[resolvedField] = true;

      // Fetch one record to confirm the field resolves against real data.
      const sample = await (tx.orders.findFirst as (args: Prisma.OrdersFindFirstArgs) => Promise<Partial<Record<string, unknown>> | null>)({
        select: selectClause as Prisma.OrdersSelect,
        orderBy: { id: 'asc' },
      });

      // sample may be null if the Orders table is empty — that is acceptable;
      // the field name itself has been validated against the schema above.
      void sample;
    });
  }

  // Replicate: SearchEd.Text := ''
  // Return an empty string so the UI layer can clear the search input element.
  const clearedSearchText: string = '';

  return {
    resolvedField,
    clearedSearchText,
    availableOrderFields,
  };
}