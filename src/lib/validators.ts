import type { FieldType, FormField } from '@/types/field';
import { parseList } from '@/utils/list';

// Multi-value types whose emptiness is "no items selected".
const MULTI_TYPES = new Set<FieldType>(['checkboxes', 'multiselect', 'tags']);

/** True when a respondent has effectively left a field blank. */
export function isEmptyAnswer(type: FieldType, value: string): boolean {
  if (MULTI_TYPES.has(type)) return parseList(value).length === 0;
  return value.trim() === '';
}

// Pragmatic email shape check — intentionally not RFC-exhaustive.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Matches an explicit scheme like "https://" or "ftp://" at the start.
const SCHEME_RE = /^[a-z][a-z\d+.-]*:\/\//i;

// Phone: digits with optional +, spaces, dashes, dots and parentheses.
const PHONE_RE = /^[+]?[\d\s().-]+$/;

// Strips currency symbols, thousands separators and spaces before parsing.
const CURRENCY_STRIP_RE = /[$€£¥₹,\s]/g;

/** Counts the digits in a string (used for a sane phone-length floor). */
function digitCount(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

/**
 * Pragmatic URL check. Accepts an optional http(s) scheme — "example.com"
 * and "https://example.com/path" both pass — but requires a dotted host so
 * bare words ("hello") are rejected. Mirrors the light email check above.
 */
export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(SCHEME_RE.test(value) ? value : `https://${value}`);
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.')
    );
  } catch {
    return false;
  }
}

/**
 * Validates a field's value against its type. An empty value is allowed
 * (light validation per PRD §4.3 — we never block editing). Returns a
 * human, sentence-case message, or undefined when valid.
 */
export function validateValue(type: FieldType, value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed === '') return undefined;

  switch (type) {
    case 'email':
      return EMAIL_RE.test(trimmed) ? undefined : "This doesn't look like a valid email.";
    case 'number':
      return Number.isFinite(Number(trimmed)) ? undefined : 'This doesn’t look like a number.';
    case 'currency':
      return Number.isFinite(Number(trimmed.replace(CURRENCY_STRIP_RE, '')))
        ? undefined
        : "This doesn't look like an amount.";
    case 'percentage':
      return Number.isFinite(Number(trimmed.replace('%', '')))
        ? undefined
        : "This doesn't look like a percentage.";
    case 'rating': {
      const n = Number(trimmed);
      return Number.isInteger(n) && n >= 1 && n <= 5 ? undefined : 'Enter a whole number from 1 to 5.';
    }
    case 'url':
      return isValidUrl(trimmed) ? undefined : "This doesn't look like a valid URL.";
    case 'phone':
      return PHONE_RE.test(trimmed) && digitCount(trimmed) >= 7
        ? undefined
        : "This doesn't look like a phone number.";
    case 'text':
    case 'textarea':
    case 'address':
    case 'password':
    case 'date':
    case 'time':
    case 'datetime':
    case 'boolean':
    default:
      // Free-form, masked, or native-picker types: nothing to validate here.
      return undefined;
  }
}

/** A label is required (flagged inline, never blocking). */
export function validateLabel(label: string): string | undefined {
  return label.trim() === '' ? 'Label is required.' : undefined;
}

/**
 * Validates a respondent's answer in the published form: a required field
 * must be non-empty; otherwise the value must satisfy its type.
 */
export function validateAnswer(
  type: FieldType,
  value: string,
  required: boolean,
): string | undefined {
  if (required && isEmptyAnswer(type, value)) return 'This field is required.';
  if (isEmptyAnswer(type, value)) return undefined;
  return validateValue(type, value);
}

/** Field-aware answer validation (required + type). */
export function validateFieldAnswer(field: FormField, value: string): string | undefined {
  return validateAnswer(field.type, value, field.required);
}
