// Deterministic input masking — no external library.
// Mask tokens: # = digit, A = uppercase letter, 0 = digit. Any other char is a literal.
// Applied progressively while typing: literals are inserted as soon as the next token is consumed.

export function applyMask(raw: string, mask: string): string {
  const tokens = mask.split("");
  const isTokenChar = (c: string) => c === "#" || c === "A" || c === "0";
  const clean = raw
    .split("")
    .filter((c) => /[a-zA-Z0-9]/.test(c))
    .join("");

  let out = "";
  let ci = 0;
  for (let ti = 0; ti < tokens.length && ci < clean.length; ti++) {
    const t = tokens[ti];
    if (!isTokenChar(t)) {
      out += t;
      continue;
    }
    // Find the next input char acceptable for this token; drop chars that can never match.
    let c = clean[ci];
    if (t === "#" || t === "0") {
      while (ci < clean.length && !/[0-9]/.test(clean[ci])) ci++;
      if (ci >= clean.length) break;
      c = clean[ci];
    } else {
      while (ci < clean.length && !/[a-zA-Z]/.test(clean[ci])) ci++;
      if (ci >= clean.length) break;
      c = clean[ci].toUpperCase();
    }
    out += c;
    ci++;
  }
  return out;
}
