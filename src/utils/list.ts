// Multi-value fields (checkboxes, multi-select, tags) store their value as a
// JSON-encoded string array so the single-string FormField model still holds.

/** Parses a stored multi-value string into an array (empty on anything odd). */
export function parseList(value: string): string[] {
  const t = value.trim();
  if (t === '') return [];
  try {
    const parsed = JSON.parse(t) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/** Serialises an array back to its stored string form. */
export function serializeList(items: string[]): string {
  return JSON.stringify(items);
}
