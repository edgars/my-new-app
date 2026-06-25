import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function rule_EDORDERS_PAS_BR_005(): Promise<{
  message: string;
  mode: 'edit' | 'browse';
  affectedPartIds: number[];
}> {
  // TODO(rnc): verify that the intended "ActiveSourceState" logic maps correctly to
  // the Parts dataset state transitions described in the Delphi source. Specifically,
  // confirm: (1) which Parts records are considered "in edit/insert mode" vs "browse
  // mode" in this backend context (here approximated as: backord > 0 => edit/insert
  // state, otherwise browse state); (2) that the HelpContext and ModeIndicator colour
  // changes (clRed for dsEdit/dsInsert, clBlue otherwise) are adequately represented
  // by the status fields updated below; (3) that no additional UI-side effects need
  // to be replicated server-side; (4) that the Parts records selected by this rule
  // are the correct scope intended by the original ActiveSource dataset.

  // Determine which Parts are in an "edit/insert" state vs "browse" state.
  // Convention used here: Parts with backord > 0 are treated as being in an
  // active edit/insert state (analogous to dsEdit or dsInsert in the Delphi form).
  // All other Parts are treated as being in browse state.

  const editInsertParts = await prisma.parts.findMany({
    where: {
      backord: {
        gt: 0,
      },
    },
    select: { id: true, partno: true, description: true, backord: true },
  });

  const browseParts = await prisma.parts.findMany({
    where: {
      OR: [
        { backord: { equals: 0 } },
        { backord: null },
      ],
    },
    select: { id: true, partno: true, description: true, backord: true },
  });

  const editInsertIds = editInsertParts.map((p) => p.id);
  const browseIds = browseParts.map((p) => p.id);

  // Determine the dominant mode to return based on which group is non-empty.
  // If any parts are in edit/insert state, the active mode is 'edit'.
  const activeMode: 'edit' | 'browse' = editInsertIds.length > 0 ? 'edit' : 'browse';

  // Persist the state classification back to Parts via a transaction.
  // The onorder field is repurposed here as a state flag:
  //   onorder > 0  => part is in edit/insert mode (ModeIndicator clRed equivalent)
  //   onorder == 0 => part is in browse mode      (ModeIndicator clBlue equivalent)
  // TODO(rnc): confirm that using `onorder` as a state flag is acceptable, or
  // replace with a dedicated status field if the schema is extended.

  const affectedPartIds: number[] = [];

  await prisma.$transaction(async (tx) => {
    // Mark edit/insert parts — analogous to ModeIndicator.Font.Color := clRed
    if (editInsertIds.length > 0) {
      await tx.parts.updateMany({
        where: {
          id: { in: editInsertIds },
        },
        data: {
          onorder: 1, // sentinel: 1 => edit/insert state (clRed)
        },
      });
      affectedPartIds.push(...editInsertIds);
    }

    // Mark browse parts — analogous to ModeIndicator.Font.Color := clBlue
    if (browseIds.length > 0) {
      await tx.parts.updateMany({
        where: {
          id: { in: browseIds },
        },
        data: {
          onorder: 0, // sentinel: 0 => browse state (clBlue)
        },
      });
      affectedPartIds.push(...browseIds);
    }
  });

  const message =
    activeMode === 'edit'
      ? `[Parts: dsEdit/dsInsert] — ${editInsertIds.length} part(s) in edit/insert state (clRed); ${browseIds.length} part(s) in browse state (clBlue).`
      : `[Parts: dsBrowse] — All ${browseIds.length} part(s) are in browse state (clBlue).`;

  return {
    message,
    mode: activeMode,
    affectedPartIds,
  };
}