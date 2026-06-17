import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Represents the dataset states mirrored from the legacy Delphi TDataSetState enum
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
  helpContext: 'HelpTopicEdit' | 'HelpTopicBrowse';
  modeIndicatorColor: 'Red' | 'Blue';
  partsSnapshot: {
    id: number;
    partno: string | null;
    description: string | null;
    onhand: number | null;
    onorder: number | null;
    vendorno: string | null;
    cost: number | null;
    listprice: number | null;
    backord: number | null;
  }[];
}

export async function rule_EDORDERS_PAS_BR_005(): Promise<ActiveSourceStateResult> {
  // TODO(rnc): verify that the ActiveSourceState being simulated here correctly maps to the
  // legacy Delphi TDataSource.OnStateChange handler; confirm which dataset (Parts) is the
  // "ActiveSource" dataset in this context, that the DatasetState value injected below
  // reflects the real runtime state, and that HelpTopicEdit / HelpTopicBrowse context IDs
  // match the migrated help system. Also confirm that the Parts snapshot scope (all records)
  // is appropriate or should be filtered by a specific criteria (e.g., active vendor, backorder).

  // Simulate the current dataset name and state as would be provided by the legacy ActiveSource
  const datasetName = 'Parts';
  const currentState: DatasetState = 'dsBrowse'; // Replace with runtime-determined state

  const editStates: DatasetState[] = ['dsEdit', 'dsInsert'];
  const isEditOrInsert = editStates.includes(currentState);

  const helpContext: 'HelpTopicEdit' | 'HelpTopicBrowse' = isEditOrInsert
    ? 'HelpTopicEdit'
    : 'HelpTopicBrowse';

  const modeIndicatorColor: 'Red' | 'Blue' = isEditOrInsert ? 'Red' : 'Blue';

  // Format caption mirroring: Format('[%S: %S]', [Dataset.Name, DatasetStates[State]])
  const modeCaption = `[${datasetName}: ${currentState}]`;

  // Fetch the Parts dataset snapshot within a transaction to ensure consistent read
  const partsSnapshot = await prisma.$transaction(async (tx) => {
    // TODO(rnc): confirm whether all parts should be fetched or only a filtered subset
    // (e.g., parts with backorders, parts belonging to a specific vendor, etc.)
    const parts = await tx.parts.findMany({
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
      orderBy: {
        partno: 'asc',
      },
    });

    // Business rule enforcement: if in edit/insert state, flag parts with backorders
    // for awareness — this mirrors the UI concern of highlighting edit mode in red
    if (isEditOrInsert) {
      const backorderedParts = parts.filter(
        (p) => p.backord !== null && p.backord > 0
      );
      // TODO(rnc): confirm whether backordered parts require additional processing
      // (e.g., triggering reorder, notifying vendor) when entering edit/insert state
      if (backorderedParts.length > 0) {
        // Log or handle backordered parts in edit context as needed
        // Placeholder: no write performed without further business confirmation
        void backorderedParts;
      }
    }

    return parts;
  });

  return {
    datasetName,
    state: currentState,
    modeCaption,
    helpContext,
    modeIndicatorColor,
    partsSnapshot,
  };
}