export async function handlePartSearchValidation(
  partId: string,
  inputChar: string
): Promise<{ isValid: boolean; processedChar: string }> {
  // TODO(rnc): verify that the character validation logic matches the original
  // TSearchDlg.SearchEdKeyPress behavior where invalid characters are beeped
  // and cleared, and only valid searchable characters are allowed through
  
  const part = await prisma.parts.findUnique({
    where: { id: partId }
  });

  if (!part) {
    return { isValid: false, processedChar: '' };
  }

  // Check if character is printable (greater than space)
  if (inputChar <= ' ') {
    return { isValid: true, processedChar: inputChar };
  }

  // Basic character validation - allow alphanumeric and common search chars
  const isValidChar = /^[a-zA-Z0-9\s\-_\.#]+$/.test(inputChar);
  
  if (!isValidChar) {
    // In the original, this would trigger MessageBeep(0) and set Key := #0
    return { isValid: false, processedChar: '' };
  }

  return { isValid: true, processedChar: inputChar };
}