import type { FieldType, FormField } from '@/types/field';

// Pragmatic email shape check — intentionally not RFC-exhaustive.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    case 'text':
    default:
      return undefined;
  }
}

/** A label is required (flagged on submit, never blocking). */
export function validateLabel(label: string): string | undefined {
  return label.trim() === '' ? 'Label is required.' : undefined;
}

/**
 * Full-field validation. Surfaces a single message (model carries one
 * `error` string, TRD §6): label problems take priority over value problems.
 */
export function validateField(field: FormField): string | undefined {
  return validateLabel(field.label) ?? validateValue(field.type, field.value);
}
