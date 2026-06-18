import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// TODO(rnc): verify that the intent of this rule is to audit/log or enforce a state-transition
// constraint on Parts records based on their active source state (edit vs. browse/insert mode),
// and confirm which fields on Parts represent "active", "onorder", or "backord" status that
// correspond to dsEdit/dsInsert vs. browse states in the original Delphi UI logic.

export async function rule_EDORDERS_PAS_BR_005(): Promise<{
  processed: number;
  editInsertState: number;
  browseState: number;
  skipped: number;
}> {
  // Fetch all Parts records to evaluate their current state
  const allParts = await prisma.parts.findMany({
    select: {
      id: true,
      partno: true,
      description: true,
      onhand: true,
      onorder: true,
      backord: true,
      vendorno: true,
      cost: true,
      listprice: true,
    },
  });

  if (allParts.length === 0) {
    return { processed: 0, editInsertState: 0, browseState: 0, skipped: 0 };
  }

  // Classify parts into "edit/insert" state vs "browse" state based on available fields.
  // A Part is considered in an "active edit/insert" state when it has pending order
  // quantities (onorder > 0) or backorder quantities (backord > 0), mirroring the
  // Delphi dsEdit/dsInsert condition that triggers the red ModeIndicator.
  // A Part is in "browse" state when onorder == 0 and backord == 0 (stable/read state).
  const editInsertParts: typeof allParts = [];
  const browseParts: typeof allParts = [];
  const skippedParts: typeof allParts = [];

  for (const part of allParts) {
    const onorder = part.onorder ?? 0;
    const backord = part.backord ?? 0;

    if (onorder === null && backord === null) {
      skippedParts.push(part);
    } else if (onorder > 0 || backord > 0) {
      // Mirrors dsEdit | dsInsert: active pending state
      editInsertParts.push(part);
    } else {
      // Mirrors browse state: stable, no pending activity
      browseParts.push(part);
    }
  }

  // Perform transactional updates to reflect the state classification.
  // For edit/insert state parts: ensure backord is reconciled (non-negative).
  // For browse state parts: ensure onorder and backord are explicitly zeroed/confirmed.
  await prisma.$transaction(async (tx) => {
    // Process edit/insert state parts — enforce backord >= 0 and onorder >= 0
    for (const part of editInsertParts) {
      const safeOnorder = Math.max(part.onorder ?? 0, 0);
      const safeBackord = Math.max(part.backord ?? 0, 0);

      await tx.parts.update({
        where: { id: part.id },
        data: {
          onorder: safeOnorder,
          backord: safeBackord,
        },
      });
    }

    // Process browse state parts — confirm zero-state consistency
    for (const part of browseParts) {
      await tx.parts.update({
        where: { id: part.id },
        data: {
          onorder: 0,
          backord: 0,
        },
      });
    }
  });

  return {
    processed: allParts.length,
    editInsertState: editInsertParts.length,
    browseState: browseParts.length,
    skipped: skippedParts.length,
  };
}