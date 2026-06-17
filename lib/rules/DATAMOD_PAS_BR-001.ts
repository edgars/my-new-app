export async function confirmNextcust(msg: string): Promise<boolean> {
  // TODO(rnc): verify that this server-side confirmation logic is intentional —
  // the original Delphi Confirm() showed a UI dialog (MessageDlg with Yes/No/Cancel)
  // which cannot be replicated server-side; confirm whether this should instead
  // be handled client-side (e.g., window.confirm or a modal), and that the
  // newcust field on Nextcust is being set/checked correctly before calling this,
  // and that the caller handles the false/cancel case appropriately.

  if (!msg || msg.trim() === "") {
    return false;
  }

  try {
    const nextcust = await prisma.nextcust.findFirst({
      select: {
        newcust: true,
      },
    });

    if (!nextcust) {
      return false;
    }

    // Server-side representation of the confirmation:
    // Since MessageDlg is a UI construct, we treat the presence and truthiness
    // of newcust as the server-side equivalent of the user having clicked "Yes".
    const result = Boolean(nextcust.newcust);

    return result;
  } catch (error) {
    console.error("confirmNextcust error:", error);
    return false;
  }
}