import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Represents the possible dataset states mirrored from the legacy Delphi TDataSetState enum
type DatasetState =
  | 'dsInactive'
  | 'dsBrowse'
  | 'dsEdit'
  | 'dsInsert'
  | 'dsSetKey'
  | 'dsCalcFields'
  | 'dsFilter'
  | 'dsNewValue'
  | 'dsOldValue'
  | 'dsCurValue'
  | 'dsBlockRead'
  | 'dsInternalCalc'
  | 'dsOpening';

interface ActiveSourceStateResult {
  datasetName: string;
  state: DatasetState;
  modeCaption: string;
  fontColor: 'red' | 'blue';
  helpContext: 'edit' | 'browse';
  activePartsSample: {
    id: number;
    partno: string | null;
    description: string | null;
    onhand: number | null;
    onorder: number | null;
    backord: number | null;
  }[];
}

/**
 * Simulates the ActiveSourceState change handler from the legacy Delphi form.
 *
 * Legacy logic:
 *   - Formats a mode indicator caption as "[DatasetName: StateName]"
 *   - If state is dsEdit or dsInsert → HelpContext = HelpTopicEdit, font color = Red
 *   - Otherwise                      → HelpContext = HelpTopicBrowse, font color = Blue
 *
 * This server-side implementation:
 *   - Determines the current "active source state" by inspecting Parts records
 *     that have pending back-orders (backord > 0) or open on-order quantities (onorder > 0),
 *     treating such records as being in an "edit/insert-like" pending state.
 *   - Returns a result object mirroring what the UI handler would have produced.
 */
export async function rule_EDORDERS_PAS_BR_005(): Promise<ActiveSourceStateResult> {
  // TODO(rnc): verify — A human must confirm:
  //   1. The correct mapping between the legacy Delphi TDataSetState values and
  //      the server-side condition used here (backord > 0 OR onorder > 0 → dsEdit).
  //   2. Whether "ActiveSource" in the original form refers specifically to the
  //      Parts dataset or another dataset (Orders, Items, etc.) in this context.
  //   3. That HelpTopicEdit and HelpTopicBrowse numeric constants are no longer
  //      needed server-side and that returning string literals is acceptable.
  //   4. That reading Parts within a read-only transaction is sufficient, or
  //      whether a write transaction is required to update a status field.

  const DATASET_NAME = 'Parts';

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Fetch Parts records that indicate a "pending / active edit" condition:
    // backord > 0 means unfulfilled back-orders exist (insert/edit-like state).
    // onorder > 0 means stock has been ordered but not yet received.
    const pendingParts = await tx.parts.findMany({
      where: {
        OR: [
          { backord: { gt: 0 } },
          { onorder: { gt: 0 } },
        ],
      },
      select: {
        id: true,
        partno: true,
        description: true,
        onhand: true,
        onorder: true,
        backord: true,
      },
      orderBy: { id: 'asc' },
      take: 50, // safety cap — mirror of a browse/grid page
    });

    // Determine the effective dataset state based on pending records
    const isEditOrInsert = pendingParts.length > 0;
    const state: DatasetState = isEditOrInsert ? 'dsEdit' : 'dsBrowse';

    // Format the mode indicator caption exactly as the Delphi handler did:
    // Format('[%S: %S]', [Dataset.Name, DatasetStates[State]])
    const modeCaption = `[${DATASET_NAME}: ${state}]`;

    // Replicate the conditional UI property assignments
    const fontColor: 'red' | 'blue' = isEditOrInsert ? 'red' : 'blue';
    const helpContext: 'edit' | 'browse' = isEditOrInsert ? 'edit' : 'browse';

    return {
      datasetName: DATASET_NAME,
      state,
      modeCaption,
      fontColor,
      helpContext,
      activePartsSample: pendingParts,
    } satisfies ActiveSourceStateResult;
  });

  return result;
}