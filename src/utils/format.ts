import type { FormField } from '@/types/field';

/** True when a field is numeric and holds a parseable, non-empty number. */
export function isNumeric(field: FormField): boolean {
  return (
    field.type === 'number' && field.value.trim() !== '' && Number.isFinite(Number(field.value))
  );
}

/** A field contributes to the preview once it has a label or a value. */
export function hasContent(field: FormField): boolean {
  return field.label.trim() !== '' || field.value.trim() !== '';
}

/** Human-readable value for a card. Numbers are grouped; empties show an em dash. */
export function formatDisplayValue(field: FormField): string {
  if (field.value.trim() === '') return '—';
  if (isNumeric(field)) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(Number(field.value));
  }
  return field.value;
}

/** Compact relative time, e.g. "8s ago", "3m ago". */
export function timeAgo(timestamp: number, now: number = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - timestamp) / 1000));
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/** Tooltip metadata line (UI/UX Brief §14 — "Type: number · 4 chars · Last edited 8s ago"). */
export function metaSummary(field: FormField, now: number = Date.now()): string {
  const detail = isNumeric(field)
    ? `value ${formatDisplayValue(field)}`
    : `${field.value.length} char${field.value.length === 1 ? '' : 's'}`;
  return `Type: ${field.type} · ${detail} · Last edited ${timeAgo(field.updatedAt, now)}`;
}
