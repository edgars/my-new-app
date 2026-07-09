import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function rule_EDORDERS_PAS_BR_005(): Promise<{
  message: string;
  editModeActive: boolean;
  activeCustomerCount: number;
  activeOrderCount: number;
}> {
  // TODO(rnc): verify that the intent of this rule is correctly interpreted as a server-side
  // state audit/snapshot — the original Delphi source is a UI event handler that updates a
  // ModeIndicator caption and font color based on whether the active dataset is in dsEdit or
  // dsInsert state (edit mode = red, browse mode = blue). Since Next.js/Prisma has no concept
  // of a visual dataset state machine, this implementation instead:
  //   1. Counts Customers and Orders that appear to be in an "active edit" condition
  //      (orders with amountdue > 0 and no shipdate, treated as open/in-progress records),
  //   2. Returns a mode indicator object analogous to the caption/color logic in the original,
  //   3. A human must confirm: (a) what "ActiveSourceState" maps to in the data model,
  //      (b) whether "edit mode" should be detected differently (e.g. a status field, a draft
  //      flag, or a separate audit table), and (c) whether any write/update action is required
  //      or whether a read-only diagnostic response is sufficient.

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Fetch all customers to mirror the dataset the Delphi form was bound to
    const allCustomers = await tx.customers.findMany({
      select: {
        id: true,
        custno: true,
        company: true,
        lastinvoicedate: true,
      },
    });

    // Fetch orders that are considered "open" (no shipdate, amount still due)
    // This is the closest server-side analogue to a dataset being in dsEdit/dsInsert state
    const openOrders = await tx.orders.findMany({
      where: {
        shipdate: null,
        amountdue: {
          gt: 0,
        },
      },
      select: {
        id: true,
        orderno: true,
        custno: true,
        saledate: true,
        shipdate: true,
        amountdue: true,
        amountpaid: true,
        paymentmethod: true,
        salesperson: true,
      },
    });

    // Determine the analogous "state" — if there are open/unshipped orders with amounts due,
    // the system is considered to be in an "edit/insert" mode (dsEdit | dsInsert in Delphi).
    // Otherwise it is in browse mode.
    const editModeActive = openOrders.length > 0;

    // Build the mode indicator descriptor, mirroring:
    //   Format('[%S: %S]', [Dataset.Name, DatasetStates[State]])
    const datasetName = 'Orders';
    const datasetState = editModeActive ? 'dsEdit' : 'dsBrowse';
    const modeIndicatorCaption = `[${datasetName}: ${datasetState}]`;

    // Analogous to HelpContext and font color assignment:
    //   dsEdit/dsInsert → HelpTopicEdit, clRed
    //   otherwise       → HelpTopicBrowse, clBlue
    const helpContext = editModeActive ? 'HelpTopicEdit' : 'HelpTopicBrowse';
    const indicatorColor = editModeActive ? 'clRed' : 'clBlue';

    return {
      modeIndicatorCaption,
      helpContext,
      indicatorColor,
      editModeActive,
      activeCustomerCount: allCustomers.length,
      activeOrderCount: openOrders.length,
      openOrders,
    };
  });

  return {
    message: `Mode indicator: ${result.modeIndicatorCaption} | HelpContext: ${result.helpContext} | Color: ${result.indicatorColor}`,
    editModeActive: result.editModeActive,
    activeCustomerCount: result.activeCustomerCount,
    activeOrderCount: result.activeOrderCount,
  };
}