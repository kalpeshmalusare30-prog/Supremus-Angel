'use client';

import { useCallback, useReducer } from 'react';
import type { FieldAction, FieldType, FormField, FormState } from '@/types/field';
import { validateField } from '@/lib/validators';
import { createId } from '@/utils/id';

export const initialState: FormState = {
  fields: [],
  lastSubmittedAt: null,
};

/** Factory for a fresh, empty field. */
function makeField(): FormField {
  return { id: createId(), label: '', value: '', type: 'text', updatedAt: Date.now() };
}

/**
 * Pure state transition function (TRD §8.1). Exported for unit testing.
 * Every update is immutable so React can reconcile by reference.
 */
export function formReducer(state: FormState, action: FieldAction): FormState {
  switch (action.type) {
    case 'ADD_FIELD':
      return { ...state, fields: [...state.fields, action.field] };

    case 'REMOVE_FIELD':
      return { ...state, fields: state.fields.filter((f) => f.id !== action.id) };

    case 'UPDATE_FIELD':
      return {
        ...state,
        fields: state.fields.map((f) =>
          f.id === action.id ? { ...f, ...action.patch, updatedAt: Date.now() } : f,
        ),
      };

    case 'SUBMIT':
      return {
        ...state,
        fields: state.fields.map((f) => ({ ...f, error: validateField(f) })),
        lastSubmittedAt: Date.now(),
      };

    case 'RESET':
      return { ...initialState };

    case 'HYDRATE':
      return { ...state, fields: action.fields };

    default:
      return state;
  }
}

export interface UseFormFields {
  fields: FormField[];
  lastSubmittedAt: number | null;
  /** Adds an empty field and returns its id (for autofocus). */
  addField: () => string;
  removeField: (id: string) => void;
  updateField: (id: string, patch: Partial<FormField>) => void;
  submit: () => void;
  reset: () => void;
  hydrate: (fields: FormField[]) => void;
}

/**
 * Clean API over the reducer (TRD §8.2). Handlers are stable via useCallback
 * so memoised rows don't re-render on unrelated updates (TRD §11).
 */
export function useFormFields(): UseFormFields {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const addField = useCallback((): string => {
    const field = makeField();
    dispatch({ type: 'ADD_FIELD', field });
    return field.id;
  }, []);

  const removeField = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FIELD', id });
  }, []);

  const updateField = useCallback((id: string, patch: Partial<FormField>) => {
    dispatch({ type: 'UPDATE_FIELD', id, patch });
  }, []);

  const submit = useCallback(() => {
    dispatch({ type: 'SUBMIT' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const hydrate = useCallback((fields: FormField[]) => {
    dispatch({ type: 'HYDRATE', fields });
  }, []);

  return {
    fields: state.fields,
    lastSubmittedAt: state.lastSubmittedAt,
    addField,
    removeField,
    updateField,
    submit,
    reset,
    hydrate,
  };
}

/** Re-exported for convenience in components that need the literal union. */
export type { FieldType };
