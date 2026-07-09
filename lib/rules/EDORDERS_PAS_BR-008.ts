import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function rule_EDORDERS_PAS_BR_008(): Promise<{
  editMode: boolean;
  browseMode: boolean;
  postEnabled: boolean;
  cancelEnabled: boolean;
  closeEnabled: boolean;
}> {
  // TODO(rnc): verify that the "OrdersSourceState" concept maps correctly to a
  // runtime dataset state (dsEditModes = dsEdit | dsInsert vs. dsBrowse).
  // Confirm which order record(s) should be evaluated, how the current state is
  // persisted or derived (e.g. a status/flag field on Orders), and whether
  // button-enable logic should be enforced server-side as a guard or is purely
  // informational for the client.  Also confirm that no additional Orders fields
  // (e.g. a "state" or "status" column) need to be added to the Prisma schema
  // to represent dsEdit / dsInsert / dsBrowse modes before this rule is used
  // in production.

  // ── Derive the "current state" of the Orders dataset ─────────────────────
  // In the original Delphi form the state is a runtime TDataSet.State value.
  // Here we approximate it by inspecting the most-recently modified order for
  // the customer whose lastinvoicedate is the most recent (i.e. the "active"
  // customer/order pair visible in the master-detail form).
  //
  // dsEditModes  → the record has unsaved changes  (amountdue != amountpaid, or
  //                shipdate is null — used as a proxy for "open / being edited")
  // dsBrowse     → the record is fully settled      (shipdate set, amounts match)

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 1. Find the most recently invoiced customer (master dataset head).
    const activeCustomer = await tx.customers.findFirst({
      orderBy: { lastinvoicedate: 'desc' },
    });

    if (!activeCustomer) {
      return {
        editMode: false,
        browseMode: true,
        postEnabled: false,
        cancelEnabled: false,
        closeEnabled: true,
      };
    }

    // 2. Find the most recent order for that customer (detail dataset head).
    const activeOrder = await tx.orders.findFirst({
      where: { custno: activeCustomer.custno },
      orderBy: { saledate: 'desc' },
    });

    if (!activeOrder) {
      return {
        editMode: false,
        browseMode: true,
        postEnabled: false,
        cancelEnabled: false,
        closeEnabled: true,
      };
    }

    // 3. Determine dataset state.
    //    Proxy rules (must be confirmed with the team — see TODO above):
    //      • editMode  : shipdate is null  OR  amountdue != amountpaid
    //                    (record is "open" / actively being worked on)
    //      • browseMode: shipdate is set   AND amountdue == amountpaid
    //                    (record is fully settled / read-only)
    const isShipped = activeOrder.shipdate !== null;
    const amountsDiffer =
      activeOrder.amountdue !== null &&
      activeOrder.amountpaid !== null &&
      activeOrder.amountdue !== activeOrder.amountpaid;

    const editMode: boolean = !isShipped || amountsDiffer;
    const browseMode: boolean = !editMode;

    // 4. Map to button-enable flags (mirrors the Delphi OnStateChange handler):
    //      PostBtn.Enabled   := Orders.State in dsEditModes
    //      CancelBtn.Enabled := PostBtn.Enabled
    //      CloseBtn.Enabled  := Orders.State = dsBrowse
    const postEnabled: boolean = editMode;
    const cancelEnabled: boolean = editMode;
    const closeEnabled: boolean = browseMode;

    // 5. Persist the derived state back to the order so downstream consumers
    //    can read it without re-deriving (optional audit / cache column).
    //    NOTE: only executes when the computed state differs from what can be
    //    inferred — no extra schema column is written here because no "state"
    //    field exists in the current schema.  Remove this comment once a
    //    dedicated status field is added and wired up.

    return {
      editMode,
      browseMode,
      postEnabled,
      cancelEnabled,
      closeEnabled,
    };
  });

  return result;
}