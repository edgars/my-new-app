import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Rule: EDORDERS_PAS_BR_008
// Condition: Change handler on OrdersSourceState
// Mirrors Delphi logic: PostBtn/CancelBtn enabled when Orders dataset is in an edit mode (dsEdit or dsInsert);
// CloseBtn enabled only when Orders dataset is in browse mode (dsBrowse).
// In a server-side context there is no visual dataset state machine, so this rule
// enforces the equivalent invariant: an Order that has unsaved (draft) changes must
// have at least one associated Items row (i.e. it is "in edit"), while an Order
// with no pending changes is considered "browsable" / fully committed.
// The function audits every Order and flags inconsistencies.

export interface OrderStateAuditResult {
  ordersInEditMode: number[];   // Orders that have items but are not yet fully paid (analogous to dsEditModes)
  ordersInBrowseMode: number[]; // Orders that are fully settled (analogous to dsBrowse)
  inconsistencies: string[];    // Human-readable warnings for a reviewer
}

export async function rule_EDORDERS_PAS_BR_008(): Promise<OrderStateAuditResult> {
  // TODO(rnc): verify that the concepts of "edit mode" (PostBtn/CancelBtn enabled) and
  // "browse mode" (CloseBtn enabled) map correctly to the server-side heuristics used
  // here (presence of Items rows + amountdue > 0 for edit mode; amountdue === 0 for
  // browse mode). Confirm with the business owner whether additional status fields
  // (e.g. a dedicated status/state column) should be added to the Orders model to
  // track dataset state explicitly, replacing these heuristics.

  const result: OrderStateAuditResult = {
    ordersInEditMode: [],
    ordersInBrowseMode: [],
    inconsistencies: [],
  };

  await prisma.$transaction(async (tx) => {
    // Fetch all orders with their associated items
    const allOrders = await tx.orders.findMany({
      select: {
        id: true,
        orderno: true,
        amountdue: true,
        amountpaid: true,
        itemstotal: true,
      },
    });

    if (allOrders.length === 0) {
      result.inconsistencies.push('No Orders found in the database.');
      return;
    }

    const orderIds = allOrders.map((o) => o.id);

    // Fetch item counts grouped by orderno so we can determine which orders
    // have line items (analogous to the dataset being in an editable state)
    const itemGroups = await tx.items.groupBy({
      by: ['orderno'],
      _count: { id: true },
      where: {
        orderno: { in: allOrders.map((o) => o.orderno) },
      },
    });

    const itemCountByOrderno = new Map<string, number>(
      itemGroups.map((g) => [String(g.orderno), g._count.id])
    );

    for (const order of allOrders) {
      const ordernoKey = String(order.orderno);
      const itemCount = itemCountByOrderno.get(ordernoKey) ?? 0;

      // Heuristic for "edit mode": order has line items AND still has an outstanding balance
      const amountDue =
        order.amountdue !== null && order.amountdue !== undefined
          ? Number(order.amountdue)
          : null;

      const hasItems = itemCount > 0;
      const hasOutstandingBalance = amountDue !== null && amountDue > 0;

      if (hasItems && hasOutstandingBalance) {
        // Analogous to dsEditModes — PostBtn and CancelBtn should be enabled
        result.ordersInEditMode.push(order.id);
      } else if (!hasOutstandingBalance && amountDue !== null) {
        // Analogous to dsBrowse — CloseBtn should be enabled
        result.ordersInBrowseMode.push(order.id);
      } else {
        // Edge cases that need human review
        if (!hasItems) {
          result.inconsistencies.push(
            `Order id=${order.id} (orderno=${order.orderno}) has no line items — ` +
              `cannot determine dataset state. PostBtn/CancelBtn and CloseBtn states are ambiguous.`
          );
        }
        if (amountDue === null) {
          result.inconsistencies.push(
            `Order id=${order.id} (orderno=${order.orderno}) has a NULL amountdue — ` +
              `cannot determine whether it is in browse or edit mode.`
          );
        }
      }
    }

    // Cross-check: an order in "edit mode" should have a valid associated customer
    if (result.ordersInEditMode.length > 0) {
      const editOrders = await tx.orders.findMany({
        where: { id: { in: result.ordersInEditMode } },
        select: { id: true, orderno: true, custno: true },
      });

      const custnosToCheck = editOrders
        .map((o) => o.custno)
        .filter((c): c is string => c !== null && c !== undefined);

      const validCustomers = await tx.customers.findMany({
        where: { custno: { in: custnosToCheck } },
        select: { custno: true },
      });

      const validCustnoSet = new Set(validCustomers.map((c) => String(c.custno)));

      for (const eo of editOrders) {
        if (eo.custno === null || eo.custno === undefined) {
          result.inconsistencies.push(
            `Order id=${eo.id} (orderno=${eo.orderno}) is in edit mode but has no custno — ` +
              `PostBtn should be disabled until a customer is assigned.`
          );
        } else if (!validCustnoSet.has(String(eo.custno))) {
          result.inconsistencies.push(
            `Order id=${eo.id} (orderno=${eo.orderno}) references custno=${eo.custno} ` +
              `which does not exist in Customers — data integrity issue detected.`
          );
        }
      }
    }
  });

  return result;
}