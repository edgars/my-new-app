export async function handleSearchEdKeyPress(
  searchField: string,
  key: string
): Promise<{ isValid: boolean; processedKey: string }> {
  // TODO(rnc): verify that the search field validation logic matches the original IsValidChar behavior
  // and that the beep notification is handled appropriately in the UI layer
  
  if (!searchField || !key || key <= ' ') {
    return { isValid: true, processedKey: key };
  }

  // Simulate the original logic where invalid characters are rejected
  const validChars = /^[a-zA-Z0-9\s!@#$%^&*(),.?":{}|<>[\]\\;'`~_+=/-]+$/;
  const isValid = validChars.test(key);
  
  if (!isValid) {
    // In the original code this would trigger MessageBeep(0) and set Key := #0
    // We return the processed result for the UI to handle accordingly
    return { isValid: false, processedKey: '\0' };
  }
  
  return { isValid: true, processedKey: key };
}