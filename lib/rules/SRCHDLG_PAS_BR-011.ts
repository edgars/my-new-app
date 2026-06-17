import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * rule_SRCHDLG_PAS_BR_011
 *
 * Business Rule: OrderCombo Change Handler
 *
 * When the user changes the selected field in the OrderCombo dropdown,
 * this rule resets the search context by:
 *   1. Resolving the named field from the Orders dataset to confirm it exists.
 *   2. Clearing/resetting the search edit value (SearchEd.Text := '') so that
 *      any prior search input is discarded when the search field changes.
 *
 * Translated to the backend: given a field name selected in OrderCombo, validate
 * that the field is a recognised, searchable column on the Orders model, then
 * return a cleared search state (empty searchValue) so the UI can reset SearchEd.
 */

// The set of searchable Orders fields exposed to the OrderCombo selector.
const SEARCHABLE_ORDER_FIELDS: ReadonlyArray<keyof Prisma.OrdersWhereInput> = [
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
  'salesperson',
] as const;

export type OrderComboChangeResult = {
  /** The validated field name now active in the search dialog. */
  selectedField: string;
  /** Always empty string — mirrors SearchEd.Text := '' after combo change. */
  searchValue: '';
  /** Human-readable confirmation message. */
  message: string;
};

export async function rule_SRCHDLG_PAS_BR_011(): Promise<OrderComboChangeResult> {
  // TODO(rnc): verify that the OrderCombo selected value is passed into this
  // function (currently hardcoded to 'orderno' for skeleton purposes); confirm
  // which Orders fields should be exposed in the OrderCombo list; confirm that
  // clearing SearchEd.Text on the frontend is handled by consuming the returned
  // searchValue === '' from this response; and confirm no persistent DB write
  // is required — this rule is purely a state-reset / validation concern.

  // ---------------------------------------------------------------------------
  // In the original Delphi source the combo's Text property names a field on
  // the Orders dataset.  Here we simulate receiving that selection and validate
  // it against the known Orders schema before returning the cleared search state.
  // ---------------------------------------------------------------------------

  // Simulate the currently selected OrderCombo value (replace with real input).
  const orderComboText: string = 'orderno';

  // Step 1 — Validate that the named field exists on the Orders model.
  const isRecognisedField = (SEARCHABLE_ORDER_FIELDS as ReadonlyArray<string>).includes(
    orderComboText,
  );

  if (!isRecognisedField) {
    throw new Error(
      `rule_SRCHDLG_PAS_BR_011: OrderCombo value "${orderComboText}" does not ` +
        `correspond to a searchable field on the Orders model. ` +
        `Allowed fields: ${SEARCHABLE_ORDER_FIELDS.join(', ')}.`,
    );
  }

  // Step 2 — Confirm the Orders table is reachable and at least one record
  //           exists so the search dialog has a valid dataset to operate on.
  //           This mirrors Datasource.Dataset.FieldByName(...) which would
  //           raise if the dataset were closed / unavailable.
  await prisma.$transaction(async (tx) => {
    const orderCount = await tx.orders.count();
    if (orderCount === 0) {
      // Non-fatal: dataset is open but empty — search will simply return no rows.
      // Throw only if the table itself cannot be reached (Prisma will surface
      // connection errors automatically).
    }
  });

  // Step 3 — Return the reset search state.
  //           selectedField  → mirrors SrchFld := Datasource.Dataset.FieldByName(OrderCombo.Text)
  //           searchValue    → mirrors SearchEd.Text := ''
  const result: OrderComboChangeResult = {
    selectedField: orderComboText,
    searchValue: '',
    message:
      `Search field changed to "${orderComboText}". ` +
      `Search input has been cleared (SearchEd reset).`,
  };

  return result;
}