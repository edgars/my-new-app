export async function handleSearchEdChange(searchText: string) {
  // TODO(rnc): verify that the search text validation and button state logic matches the original Delphi implementation
  const isSearchEnabled = searchText.trim() !== '';
  
  return {
    searchButtonEnabled: isSearchEnabled,
    searchText: searchText.trim()
  };
}