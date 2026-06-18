import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * rule_EDORDERS_PAS_BR_008
 *
 * Implements the OrdersSourceState change handler logic originally found in
 * the Delphi TDataSource.OnStateChange event for the Orders master dataset.
 *
 * The rule evaluates the current "edit mode" state of every open Order record
 * and updates a derived control-state snapshot so that downstream UI or API
 * consumers know which Orders are in an editable state (PostBtn / CancelBtn
 * enabled) versus browse state (CloseBtn enabled).
 *
 * Because Prisma/Next.js has no concept of a live dataset cursor, we model
 * the intent as:
 *   - "dsEditModes"  → Orders that have been modified since their last
 *     shipdate (i.e. amountdue > 0 AND shipdate IS NULL — a proxy for
 *     "open / being edited").
 *   - "dsBrowse"     → Orders that are fully settled (amountdue = 0 AND
 *     shipdate IS NOT NULL).
 *
 * The function returns a summary object so callers can replicate the
 * PostBtn / CancelBtn / CloseBtn enabled logic.
 */

export async function rule_EDORDERS_PAS_BR_008(): Promise<{
  postBtnEnabled: boolean;
  cancelBtnEnabled: boolean;
  closeBtnEnabled: boolean;
  editModeOrderIds: number[];
  browseOrderIds: number[];
}> {
  // TODO(rnc): verify — A human must confirm:
  //   1. The correct proxy condition for "dsEditModes" (Orders in an edit/insert
  //      state). The current heuristic (amountdue > 0 AND shipdate IS NULL) is
  //      an approximation; the real condition depends on how the application
  //      tracks unsaved / in-flight order edits.
  //   2. The correct proxy condition for "dsBrowse" (Orders in browse/read-only
  //      state). Currently modelled as amountdue = 0 AND shipdate IS NOT NULL.
  //   3. Whether this rule should mutate any persisted data or is purely a
  //      read/derive operation. If mutations are needed, wrap them in the
  //      prisma.$transaction block below.
  //   4. Field nullability — confirm that shipdate, amountdue, and amountpaid
  //      are nullable in the actual Prisma schema before deploying.

  const result = await prisma.$transaction(async (tx) => {
    // ── Fetch all orders ──────────────────────────────────────────────────────
    const allOrders = await tx.orders.findMany({
      select: {
        id: true,
        orderno: true,
        shipdate: true,
        amountdue: true,
        amountpaid: true,
        itemstotal: true,
      },
    });

    // ── Classify each order by its "dataset state" proxy ─────────────────────
    //
    // dsEditModes (Insert | Edit):
    //   Order has outstanding amount due OR has not yet been shipped.
    //   Enables PostBtn and CancelBtn.
    //
    // dsBrowse:
    //   Order is fully paid and has a recorded ship date.
    //   Enables CloseBtn.

    const editModeOrders = allOrders.filter((o) => {
      const amountDue =
        o.amountdue !== null && o.amountdue !== undefined
          ? Number(o.amountdue)
          : null;
      const hasShipDate = o.shipdate !== null && o.shipdate !== undefined;

      // Proxy for "record is open / being edited"
      return (amountDue !== null && amountDue > 0) || !hasShipDate;
    });

    const browseOrders = allOrders.filter((o) => {
      const amountDue =
        o.amountdue !== null && o.amountdue !== undefined
          ? Number(o.amountdue)
          : null;
      const hasShipDate = o.shipdate !== null && o.shipdate !== undefined;

      // Proxy for "record is settled / browse only"
      return amountDue !== null && amountDue === 0 && hasShipDate;
    });

    const editModeOrderIds = editModeOrders.map((o) => o.id);
    const browseOrderIds = browseOrders.map((o) => o.id);

    // ── Derive button-enabled flags (mirrors the Delphi OnStateChange logic) ──
    //
    // PostBtn.Enabled   := Orders.State in dsEditModes
    // CancelBtn.Enabled := PostBtn.Enabled          (same condition)
    // CloseBtn.Enabled  := Orders.State = dsBrowse
    //
    // At the dataset level we report aggregate flags:
    //   postBtnEnabled  → true when ANY order is in edit mode
    //   closeBtnEnabled → true when ALL orders are in browse mode
    //     (no order is currently being edited)

    const postBtnEnabled = editModeOrderIds.length > 0;
    const cancelBtnEnabled = postBtnEnabled; // identical condition
    const closeBtnEnabled = editModeOrderIds.length === 0 && allOrders.length > 0;

    // ── Optional: persist derived state if a tracking table exists ────────────
    // (No suitable model is available in the current schema; add writes here
    //  once a state-tracking entity is introduced.)

    return {
      postBtnEnabled,
      cancelBtnEnabled,
      closeBtnEnabled,
      editModeOrderIds,
      browseOrderIds,
    };
  });

  return result;
}