export async function handleSearchEdChange(searchText: string): Promise<{ searchButtonEnabled: boolean }> {
  // TODO(rnc): verify that this handler is wired to the onChange event of the SearchEd input field,
  // and that the SearchButton's disabled/enabled state is correctly bound to the returned boolean
  // in the UI component; also confirm no server-side persistence is needed for this rule (pure UI state).

  const searchButtonEnabled = searchText.trim() !== '';

  return { searchButtonEnabled };
}