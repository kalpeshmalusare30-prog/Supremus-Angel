'use client';

import { useEffect, useRef } from 'react';
import type { FormSchema } from '@/types/field';
import { DRAFT_KEY } from '@/lib/store';

const STORAGE_KEY = DRAFT_KEY;

/** Narrows untrusted parsed JSON to a FormSchema before hydrating. */
function isFormSchema(value: unknown): value is FormSchema {
  if (!value || typeof value !== 'object') return false;
  const v = value as FormSchema;
  return (
    typeof v.title === 'string' &&
    Array.isArray(v.fields) &&
    v.fields.every(
      (f) =>
        !!f &&
        typeof f === 'object' &&
        typeof f.id === 'string' &&
        typeof f.type === 'string' &&
        typeof f.name === 'string' &&
        typeof f.label === 'string',
    )
  );
}

/**
 * Optional session persistence (TRD §8.3). Reads the saved schema once on
 * mount and hydrates; thereafter mirrors the working schema to localStorage
 * on every change. All access is wrapped in try/catch so private-mode
 * failures are silent.
 */
export function useSchemaPersistence(
  schema: FormSchema,
  onHydrate: (schema: FormSchema) => void,
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
        if (isFormSchema(parsed) && parsed.fields.length > 0) {
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
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(schema));
    } catch {
      // Ignore write failures; the app continues without persistence.
    }
  }, [schema]);
}
