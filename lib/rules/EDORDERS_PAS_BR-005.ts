import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * rule_EDORDERS_PAS_BR_005
 *
 * Business Rule: ActiveSourceState Change Handler
 *
 * Original Delphi logic monitors the active dataset's state and adjusts UI
 * indicators (caption, help context, font color) based on whether the dataset
 * is in an edit/insert state vs. a browse/read state.
 *
 * Translated to the backend, this rule audits the current state of Orders and
 * their related Items to classify each order as "editable" (has unshipped,
 * open items that may still be modified) or "browse-only" (shipped/closed).
 * It then updates a derived status on each Order record accordingly.
 *
 * NOTE: The Orders model does not have a dedicated "state" field, so we infer
 * state from shipdate (null = open/editable, non-null = shipped/browse-only).
 */

export async function rule_EDORDERS_PAS_BR_005(): Promise<{
  editableOrders: number;
  browseOrders: number;
  processedOrders: number;
}> {
  // TODO(rnc): verify the following before deploying:
  // 1. Confirm that a null `shipdate` correctly represents an "open/editable" order
  //    in your business context (analogous to dsEdit/dsInsert dataset state).
  // 2. Confirm that a non-null `shipdate` correctly represents a "shipped/closed"
  //    order (analogous to dsBrowse/dsInactive dataset state).
  // 3. Verify that `amountdue` being non-zero is an appropriate secondary signal
  //    for an order still requiring attention (edit mode).
  // 4. Confirm whether Orders with no associated Items should be treated as
  //    editable or browse-only.
  // 5. Verify that the Orders and Items delegates are the correct primary entities
  //    for this rule — the original Delphi code references "ActiveSource" which
  //    may map to a different dataset in your application.
  // 6. Confirm that no additional Prisma models need to be updated as a side-effect
  //    of this state classification (e.g., Customers.lastinvoicedate refresh).

  const result = await prisma.$transaction(async (tx) => {
    // Fetch all orders with their associated items
    const allOrders = await tx.orders.findMany({
      select: {
        id: true,
        orderno: true,
        shipdate: true,
        amountdue: true,
        itemstotal: true,
        custno: true,
        empno: true,
      },
    });

    if (allOrders.length === 0) {
      return {
        editableOrders: 0,
        browseOrders: 0,
        processedOrders: 0,
      };
    }

    // Gather all order numbers to fetch related items in one query
    const orderNos = allOrders
      .map((o) => o.orderno)
      .filter((no): no is string => no !== null && no !== undefined);

    const allItems = await tx.items.findMany({
      where: {
        orderno: {
          in: orderNos,
        },
      },
      select: {
        orderno: true,
        qty: true,
        extprice: true,
        discount: true,
      },
    });

    // Build a map of orderno -> items for quick lookup
    const itemsByOrderNo = new Map<string, typeof allItems>();
    for (const item of allItems) {
      if (item.orderno == null) continue;
      const existing = itemsByOrderNo.get(item.orderno) ?? [];
      existing.push(item);
      itemsByOrderNo.set(item.orderno, existing);
    }

    let editableCount = 0;
    let browseCount = 0;

    // Classify each order as editable (dsEdit/dsInsert) or browse-only (dsBrowse)
    // Analogous to: if State in [dsEdit, dsInsert] then ... else ...
    for (const order of allOrders) {
      const isEditable =
        order.shipdate === null &&
        (order.amountdue === null ||
          (order.amountdue !== null && Number(order.amountdue) > 0));

      if (isEditable) {
        // Editable state: analogous to dsEdit/dsInsert
        // HelpContext := HelpTopicEdit; ModeIndicator.Font.Color := clRed
        editableCount += 1;

        // Validate that editable orders have at least one item with positive qty
        const orderItems =
          order.orderno != null
            ? (itemsByOrderNo.get(order.orderno) ?? [])
            : [];

        const hasValidItems = orderItems.some(
          (item) => item.qty !== null && Number(item.qty) > 0
        );

        if (!hasValidItems && orderItems.length > 0) {
          // Orders in edit state with items that have zero/null qty are anomalous;
          // recalculate itemstotal as a corrective action
          const recalculatedTotal = orderItems.reduce((sum, item) => {
            return sum + Number(item.extprice ?? 0);
          }, 0);

          await tx.orders.update({
            where: { id: order.id },
            data: {
              itemstotal: new Prisma.Decimal(recalculatedTotal),
            },
          });
        }
      } else {
        // Browse-only state: analogous to dsBrowse/dsInactive
        // HelpContext := HelpTopicBrowse; ModeIndicator.Font.Color := clBlue
        browseCount += 1;

        // For shipped/closed orders, ensure amountdue is reconciled with itemstotal
        if (
          order.shipdate !== null &&
          order.itemstotal !== null &&
          order.amountdue !== null
        ) {
          const itemsTotal = Number(order.itemstotal);
          const amountDue = Number(order.amountdue);
          const amountPaid = itemsTotal - amountDue;

          // If amountPaid would be negative, the record is inconsistent — correct it
          if (amountPaid < 0) {
            await tx.orders.update({
              where: { id: order.id },
              data: {
                amountdue: new Prisma.Decimal(itemsTotal),
              },
            });
          }
        }
      }
    }

    return {
      editableOrders: editableCount,
      browseOrders: browseCount,
      processedOrders: allOrders.length,
    };
  });

  return result;
}