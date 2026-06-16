export async function handleSearchEdChange(searchText: string): Promise<{ searchEnabled: boolean }> {
  // TODO(rnc): verify that the client-side enable/disable of the search button is also enforced server-side to prevent empty search submissions

  const searchEnabled = searchText.trim() !== '';

  return { searchEnabled };
}