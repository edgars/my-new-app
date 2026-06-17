export async function getToDate(toEditText: string): Promise<Date | null> {
  // TODO(rnc): verify that empty string should map to null (equivalent to Delphi's 0/TDateTime zero),
  // and confirm that date parsing locale/format matches the original StrToDate behavior in TQueryCustDlg

  if (!toEditText || toEditText.trim() === '') {
    return null;
  }

  const parsed = new Date(toEditText);

  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date value provided for ToDate: "${toEditText}"`);
  }

  return parsed;
}