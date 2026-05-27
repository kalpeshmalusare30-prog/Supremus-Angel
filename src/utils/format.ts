import type { FieldType } from '@/types/field';
import { parseList } from '@/utils/list';

// Multi-value types store a JSON string array.
const MULTI_TYPES = new Set<FieldType>(['checkboxes', 'multiselect', 'tags']);

// Symbols/separators stripped before parsing a currency value.
const CURRENCY_STRIP_RE = /[$€£¥₹,\s]/g;
// Explicit URL scheme like "https://".
const SCHEME_RE = /^[a-z][a-z\d+.-]*:\/\//i;
// Types whose values are formatted as numbers.
const NUMERIC_TYPES = new Set<FieldType>([
  'number',
  'currency',
  'percentage',
  'rating',
  'range',
  'stepper',
]);

/** Parses a value to a number, stripping currency/percent symbols first. */
export function numericValue(type: FieldType, value: string): number {
  if (type === 'currency') return Number(value.replace(CURRENCY_STRIP_RE, ''));
  if (type === 'percentage') return Number(value.replace('%', '').trim());
  return Number(value);
}

/** True when a numeric-type value is present and parseable. */
export function isNumericValue(type: FieldType, value: string): boolean {
  return NUMERIC_TYPES.has(type) && value.trim() !== '' && Number.isFinite(numericValue(type, value));
}

/** An href for link-style fields (url/email/phone), or null when not linkable. */
export function linkHref(type: FieldType, value: string): string | null {
  const v = value.trim();
  if (v === '') return null;
  switch (type) {
    case 'email':
      return `mailto:${v}`;
    case 'phone':
      return `tel:${v.replace(/[^\d+]/g, '')}`;
    case 'url':
      return SCHEME_RE.test(v) ? v : `https://${v}`;
    case 'map': {
      const m = /^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/.exec(v);
      return m ? `https://www.openstreetmap.org/?mlat=${m[1]}&mlon=${m[2]}#map=15/${m[1]}/${m[2]}` : null;
    }
    default:
      return null;
  }
}

/** Strips tags from rich-text HTML down to readable, single-spaced text. */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Human-readable value, formatted per field type. */
export function formatDisplayValue(type: FieldType, value: string): string {
  const v = value.trim();

  if (type === 'boolean') return value === 'true' ? 'Yes' : 'No';
  if (MULTI_TYPES.has(type)) {
    const items = parseList(value);
    return items.length ? items.join(', ') : '—';
  }
  if (v === '') return '—';

  switch (type) {
    case 'currency': {
      const n = numericValue(type, value);
      return Number.isFinite(n)
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
        : value;
    }
    case 'rating': {
      const n = numericValue(type, value);
      return Number.isInteger(n) && n >= 1 && n <= 5 ? '★'.repeat(n) + '☆'.repeat(5 - n) : value;
    }
    case 'percentage': {
      const n = numericValue(type, value);
      return Number.isFinite(n) ? `${new Intl.NumberFormat('en-US').format(n)}%` : value;
    }
    case 'number':
    case 'range':
    case 'stepper': {
      const n = numericValue(type, value);
      return Number.isFinite(n)
        ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(n)
        : value;
    }
    case 'date': {
      // Parse y-m-d as a local date so it never shifts a day across timezones.
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
      const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(v);
      if (Number.isNaN(d.getTime())) return value;
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    case 'datetime': {
      const d = new Date(v);
      if (Number.isNaN(d.getTime())) return value;
      return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    }
    case 'daterange': {
      const [start = '', end = ''] = value.split('|');
      const fmt = (s: string) => (s ? formatDisplayValue('date', s) : '…');
      return start === '' && end === '' ? '—' : `${fmt(start)} – ${fmt(end)}`;
    }
    case 'image':
      return 'Image uploaded';
    case 'password':
      return '•'.repeat(Math.min(value.length, 12));
    case 'richtext':
      return stripHtml(value) || '—';
    case 'map':
      return v.replace(',', ', ');
    case 'captcha':
      return value === 'verified' ? 'Verified' : '—';
    default:
      return value;
  }
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
