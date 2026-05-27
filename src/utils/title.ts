// Shared form-title handling. An empty title isn't an error — it falls back
// to a friendly default — but the fallback is always rendered as a visually
// distinct *placeholder*, never passed off as real entered data.

export const FALLBACK_TITLE = 'Untitled form';

export interface ResolvedTitle {
  /** The text to display. */
  text: string;
  /** True when `text` is the fallback (so the UI can render it muted). */
  isFallback: boolean;
}

/** Resolves a (possibly blank) title to display text + a fallback flag. */
export function resolveTitle(title: string): ResolvedTitle {
  const trimmed = title.trim();
  return trimmed ? { text: trimmed, isFallback: false } : { text: FALLBACK_TITLE, isFallback: true };
}

/** Normalises a title for storage/sharing: trimmed, or the fallback if blank. */
export function normalizeTitle(title: string): string {
  return title.trim() || FALLBACK_TITLE;
}
