export async function getFromDate(fromText: string | undefined | null): Promise<Date | null> {
  // TODO(rnc): verify that the date parsing locale/format matches the original Delphi StrToDate behavior (e.g. DD/MM/YYYY vs MM/DD/YYYY), and confirm that a null/zero result should map to null rather than epoch or a sentinel value

  if (!fromText || fromText.trim() === '') {
    return null;
  }

  const parsed = new Date(fromText.trim());

  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date value for fromText: "${fromText}"`);
  }

  return parsed;
}