'use client';

import { useEffect, useRef } from 'react';
import type { FieldType, FormField } from '@/types/field';

const STORAGE_KEY = 'supremus-angel:fields';
const FIELD_TYPES: FieldType[] = ['text', 'number', 'email'];

/** Narrows untrusted parsed JSON to a FormField[] before hydrating. */
function isFormFieldArray(value: unknown): value is FormField[] {
  return (
    Array.isArray(value) &&
    value.every(
      (f): f is FormField =>
        !!f &&
        typeof f === 'object' &&
        typeof (f as FormField).id === 'string' &&
        typeof (f as FormField).label === 'string' &&
        typeof (f as FormField).value === 'string' &&
        FIELD_TYPES.includes((f as FormField).type),
    )
  );
}

/**
 * Optional session persistence (TRD §8.3). Reads once on mount and dispatches
 * a hydrate; thereafter mirrors `fields` to localStorage on every change.
 * All access is wrapped in try/catch so private-mode failures are silent.
 */
export function useFieldPersistence(
  fields: FormField[],
  onHydrate: (fields: FormField[]) => void,
): void {
  // Skip the first persist run so the empty initial state never clobbers
  // previously saved data before hydration lands.
  const isFirstRun = useRef(true);

  // Read once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isFormFieldArray(parsed) && parsed.length > 0) {
          onHydrate(parsed);
        }
      }
    } catch {
      // localStorage unavailable (private mode / disabled) — start empty.
    }
    // Mount-only: onHydrate is a stable useCallback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on change.
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
    } catch {
      // Ignore write failures; the app continues without persistence.
    }
  }, [fields]);
}
