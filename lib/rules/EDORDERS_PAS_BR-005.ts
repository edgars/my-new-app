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
  modeIndicatorCaption: string;
  modeIndicatorFontColor: 'Red' | 'Blue';
  helpContext: 'HelpTopicEdit' | 'HelpTopicBrowse';
  editModeActive: boolean;
  auditLogId: number | null;
}

/**
 * Simulates the ActiveSourceState change handler from the legacy Delphi UI layer.
 * In the original code this handler fires whenever the active dataset's state changes
 * (e.g. a user begins editing or inserting a Parts record).  Here we replicate the
 * business logic server-side: we inspect the current state of the Parts dataset,
 * derive the mode-indicator caption and colour, set the appropriate help context,
 * and persist an audit entry so the state transition is traceable.
 */
export async function rule_EDORDERS_PAS_BR_005(): Promise<ActiveSourceStateResult> {
  // TODO(rnc): verify —
  //   1. That the "active dataset" concept maps correctly to the Parts entity in this
  //      server-side context; the original Delphi code operated on whichever dataset
  //      happened to be active in the UI, which may span multiple entities.
  //   2. That the simulated state ('dsEdit') used below is replaced with the real
  //      runtime state sourced from the calling context (e.g. a request body or
  //      session flag) before deploying to production.
  //   3. That the audit logging approach (writing to Parts.description as a stand-in)
  //      is replaced with a dedicated AuditLog model once one is available in the schema.
  //   4. That HelpTopicEdit / HelpTopicBrowse numeric IDs match the ported help system.
  //   5. That colour values ('Red' / 'Blue') are correctly consumed by the front-end
  //      component that replaces the Delphi ModeIndicator label.

  // ── Simulated runtime inputs ────────────────────────────────────────────────
  // In production these would come from the request context / session.
  const simulatedDatasetName: string = 'Parts';
  const simulatedState: DatasetState = 'dsEdit'; // replace with real runtime value

  const EDIT_STATES: DatasetState[] = ['dsEdit', 'dsInsert'];

  // ── Derive display values (pure logic, mirrors the Delphi handler) ──────────
  const isEditMode: boolean = EDIT_STATES.includes(simulatedState);

  const modeIndicatorCaption: string = `[${simulatedDatasetName}: ${simulatedState}]`;
  const modeIndicatorFontColor: 'Red' | 'Blue' = isEditMode ? 'Red' : 'Blue';
  const helpContext: 'HelpTopicEdit' | 'HelpTopicBrowse' = isEditMode
    ? 'HelpTopicEdit'
    : 'HelpTopicBrowse';

  // ── Persist audit trail inside a transaction ────────────────────────────────
  // We record the state transition against the first Parts record as a proxy audit
  // entry.  Replace this with a proper AuditLog model when available.
  let auditLogId: number | null = null;

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Fetch the most recently modified Parts record to attach the audit note to.
    const targetPart = await tx.parts.findFirst({
      orderBy: { id: 'desc' },
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

    if (targetPart === null) {
      // No Parts rows exist yet; nothing to audit against.
      return;
    }

    // Build an audit annotation appended to the existing description field.
    // This is a temporary measure until a dedicated audit table is available.
    const timestamp: string = new Date().toISOString();
    const auditSuffix: string =
      ` | STATE_CHANGE [${timestamp}] dataset=${simulatedDatasetName}` +
      ` state=${simulatedState} mode=${isEditMode ? 'EDIT' : 'BROWSE'}` +
      ` help=${helpContext} color=${modeIndicatorFontColor}`;

    const currentDescription: string = targetPart.description ?? '';
    // Truncate to avoid unbounded growth in a real system; adjust limit as needed.
    const maxLength = 1000;
    const newDescription: string = (currentDescription + auditSuffix).slice(
      -maxLength,
    );

    const updated = await tx.parts.update({
      where: { id: targetPart.id },
      data: { description: newDescription },
      select: { id: true },
    });

    auditLogId = updated.id;
  });

  // ── Return structured result ─────────────────────────────────────────────────
  return {
    datasetName: simulatedDatasetName,
    state: simulatedState,
    modeIndicatorCaption,
    modeIndicatorFontColor,
    helpContext,
    editModeActive: isEditMode,
    auditLogId,
  };
}