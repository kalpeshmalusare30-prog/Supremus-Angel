// Form-schema helpers: building fields, generating backend names, and
// encoding/decoding a whole form to a URL-safe string so a published form
// is fully shareable with no backend (PRD §3.2 — client-side only).

import type { FieldType, FormField, FormSchema } from '@/types/field';
import { defaultValueFor, getFieldType } from '@/lib/fieldTypes';
import { createId } from '@/utils/id';

/** A valid backend variable name: starts with a letter/underscore. */
const NAME_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

/** True when `name` is a usable variable identifier. */
export function isValidName(name: string): boolean {
  return NAME_RE.test(name);
}

/** Turns a label into a snake_case variable-name candidate. */
export function slugify(input: string): string {
  const slug = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  // Names can't start with a digit; prefix if needed.
  if (slug === '') return 'field';
  return /^[0-9]/.test(slug) ? `field_${slug}` : slug;
}

/** Ensures `base` is unique against `existing`, appending _2, _3, … if not. */
export function uniqueName(base: string, existing: string[]): string {
  if (!existing.includes(base)) return base;
  let n = 2;
  while (existing.includes(`${base}_${n}`)) n += 1;
  return `${base}_${n}`;
}

const OPTION_CONTROLS = new Set(['select', 'radio', 'segmented', 'checkboxes', 'multiselect']);
const LIKERT_OPTIONS = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];

/** A fresh field of `type` with sensible defaults and a unique name. */
export function createField(type: FieldType, existingNames: string[]): FormField {
  const def = getFieldType(type);
  const seededOptions =
    type === 'likert'
      ? LIKERT_OPTIONS
      : OPTION_CONTROLS.has(def.control)
        ? ['Option 1', 'Option 2', 'Option 3']
        : undefined;
  return {
    id: createId(),
    type,
    name: uniqueName(slugify(def.label), existingNames),
    label: def.label,
    placeholder: def.placeholder ?? '',
    defaultValue: defaultValueFor(type),
    ...(seededOptions ? { options: seededOptions } : {}),
    hidden: false,
    required: false,
    fullWidth: false,
    block: false,
    disabled: false,
    useDisplayValue: false,
    updatedAt: Date.now(),
  };
}

// --- URL encoding (UTF-8 safe, base64url) ---------------------------------

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(encoded: string): Uint8Array {
  const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(b64);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

/** Serialises a form to a URL-safe string (carried in the published link hash). */
export function encodeSchema(schema: FormSchema): string {
  const json = JSON.stringify(schema);
  return toBase64Url(new TextEncoder().encode(json));
}

/** Parses a published string back into a form, or null when malformed. */
export function decodeSchema(encoded: string): FormSchema | null {
  try {
    const json = new TextDecoder().decode(fromBase64Url(encoded));
    const parsed = JSON.parse(json) as unknown;
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray((parsed as FormSchema).fields) &&
      typeof (parsed as FormSchema).title === 'string'
    ) {
      return parsed as FormSchema;
    }
    return null;
  } catch {
    return null;
  }
}
