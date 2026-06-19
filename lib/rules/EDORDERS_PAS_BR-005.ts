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
 * Translated server-side interpretation:
 *   - Scans Parts records to classify them as "editable" (backord > 0 or
 *     onorder > 0, implying pending/active mutation state) vs. "browse"
 *     (stable, read-only state).
 *   - For "edit/insert" state parts: ensures a linked Vendor exists and is
 *     active (isactive = true), mirroring the elevated-attention (red) mode.
 *   - For "browse" state parts: ensures any linked Vendor is not forcibly
 *     deactivated solely due to this part, mirroring the calm (blue) mode.
 *   - Produces a summary result describing how many parts were found in each
 *     state and how many vendor records were affected.
 */

export async function rule_EDORDERS_PAS_BR_005(): Promise<{
  editStatePartsCount: number;
  browseStatePartsCount: number;
  vendorsActivated: number;
  vendorsReviewed: number;
  stateLog: Array<{ partId: number; partno: string; resolvedState: 'edit_insert' | 'browse'; vendorAction: string }>;
}> {
  // TODO(rnc): verify that the "edit/insert" state classification (backord > 0 OR onorder > 0)
  // correctly maps to the Delphi dsEdit/dsInsert dataset states for Parts in this application;
  // confirm that activating a Vendor record is the intended server-side analogue of the red
  // ModeIndicator font color; and confirm that no additional UI-only logic needs a server-side
  // counterpart before deploying this rule to production.

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 1. Fetch all Parts records
    const allParts = await tx.parts.findMany({
      select: {
        id: true,
        partno: true,
        description: true,
        onhand: true,
        onorder: true,
        backord: true,
        vendorno: true,
      },
    });

    // 2. Classify each part into "edit/insert" state vs. "browse" state
    //    Delphi dsEdit / dsInsert → part has pending order or backorder activity
    //    Delphi browse/other     → part is in a stable, read-only state
    const editInsertParts = allParts.filter(
      (p) => (p.backord != null && p.backord > 0) || (p.onorder != null && p.onorder > 0)
    );
    const browseParts = allParts.filter(
      (p) => !(p.backord != null && p.backord > 0) && !(p.onorder != null && p.onorder > 0)
    );

    const stateLog: Array<{
      partId: number;
      partno: string;
      resolvedState: 'edit_insert' | 'browse';
      vendorAction: string;
    }> = [];

    let vendorsActivated = 0;
    let vendorsReviewed = 0;

    // 3. Handle "edit/insert" state parts (analogous to red ModeIndicator / HelpTopicEdit)
    //    Ensure the linked vendor is active — elevated attention required.
    for (const part of editInsertParts) {
      let vendorAction = 'no_vendor_no';

      if (part.vendorno != null && part.vendorno !== '') {
        // Attempt to find a matching vendor by vendorname (vendorno is the FK reference)
        const vendor = await tx.vendors.findFirst({
          where: { vendorname: part.vendorno },
          select: { id: true, vendorname: true, isactive: true },
        });

        if (vendor) {
          vendorsReviewed += 1;
          if (!vendor.isactive) {
            // Activate vendor — part is in an active/edit state and needs an active source
            await tx.vendors.update({
              where: { id: vendor.id },
              data: { isactive: true },
            });
            vendorsActivated += 1;
            vendorAction = `vendor_activated(id=${vendor.id})`;
          } else {
            vendorAction = `vendor_already_active(id=${vendor.id})`;
          }
        } else {
          vendorAction = `vendor_not_found(vendorno=${part.vendorno})`;
        }
      }

      stateLog.push({
        partId: part.id,
        partno: part.partno ?? '',
        resolvedState: 'edit_insert',
        vendorAction,
      });
    }

    // 4. Handle "browse" state parts (analogous to blue ModeIndicator / HelpTopicBrowse)
    //    Review linked vendors — no forced activation; just audit/log.
    for (const part of browseParts) {
      let vendorAction = 'no_vendor_no';

      if (part.vendorno != null && part.vendorno !== '') {
        const vendor = await tx.vendors.findFirst({
          where: { vendorname: part.vendorno },
          select: { id: true, vendorname: true, isactive: true },
        });

        if (vendor) {
          vendorsReviewed += 1;
          vendorAction = vendor.isactive
            ? `vendor_active_browse_ok(id=${vendor.id})`
            : `vendor_inactive_browse_noted(id=${vendor.id})`;
        } else {
          vendorAction = `vendor_not_found(vendorno=${part.vendorno})`;
        }
      }

      stateLog.push({
        partId: part.id,
        partno: part.partno ?? '',
        resolvedState: 'browse',
        vendorAction,
      });
    }

    return {
      editStatePartsCount: editInsertParts.length,
      browseStatePartsCount: browseParts.length,
      vendorsActivated,
      vendorsReviewed,
      stateLog,
    };
  });

  return result;
}