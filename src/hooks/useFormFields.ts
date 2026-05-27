'use client';

import { useCallback, useReducer } from 'react';
import type { FieldAction, FieldType, FormField, FormSchema, FormState } from '@/types/field';

export const initialState: FormState = {
  title: 'Untitled form',
  fields: [],
};

/**
 * Pure state transition function (TRD §8.1). Exported for unit testing.
 * Every update is immutable so React can reconcile by reference.
 */
export function formReducer(state: FormState, action: FieldAction): FormState {
  switch (action.type) {
    case 'ADD_FIELD':
      return { ...state, fields: [...state.fields, action.field] };

    case 'UPDATE_FIELD':
      return {
        ...state,
        fields: state.fields.map((f) =>
          f.id === action.id ? { ...f, ...action.patch, updatedAt: Date.now() } : f,
        ),
      };

    case 'REMOVE_FIELD':
      return { ...state, fields: state.fields.filter((f) => f.id !== action.id) };

    case 'MOVE_FIELD': {
      const index = state.fields.findIndex((f) => f.id === action.id);
      const target = action.direction === 'up' ? index - 1 : index + 1;
      if (index === -1 || target < 0 || target >= state.fields.length) return state;
      const fields = [...state.fields];
      [fields[index], fields[target]] = [fields[target], fields[index]];
      return { ...state, fields };
    }

    case 'SET_TITLE':
      return { ...state, title: action.title };

    case 'RESET':
      return { ...initialState };

    case 'HYDRATE':
      return { title: action.schema.title, fields: action.schema.fields };

    default:
      return state;
  }
}

export interface UseFormFields {
  title: string;
  fields: FormField[];
  /** Appends an already-configured field. */
  addField: (field: FormField) => void;
  /** Patches a field's settings. */
  updateField: (id: string, patch: Partial<FormField>) => void;
  removeField: (id: string) => void;
  /** Swaps a field with its neighbour in the given direction. */
  moveField: (id: string, direction: 'up' | 'down') => void;
  setTitle: (title: string) => void;
  reset: () => void;
  hydrate: (schema: FormSchema) => void;
}

/**
 * Clean API over the reducer (TRD §8.2). Handlers are stable via useCallback
 * so memoised cards don't re-render on unrelated updates (TRD §11).
 */
export function useFormFields(): UseFormFields {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const addField = useCallback((field: FormField) => {
    dispatch({ type: 'ADD_FIELD', field });
  }, []);

  const updateField = useCallback((id: string, patch: Partial<FormField>) => {
    dispatch({ type: 'UPDATE_FIELD', id, patch });
  }, []);

  const removeField = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FIELD', id });
  }, []);

  const moveField = useCallback((id: string, direction: 'up' | 'down') => {
    dispatch({ type: 'MOVE_FIELD', id, direction });
  }, []);

  const setTitle = useCallback((title: string) => {
    dispatch({ type: 'SET_TITLE', title });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const hydrate = useCallback((schema: FormSchema) => {
    dispatch({ type: 'HYDRATE', schema });
  }, []);

  return {
    title: state.title,
    fields: state.fields,
    addField,
    updateField,
    removeField,
    moveField,
    setTitle,
    reset,
    hydrate,
  };
}

/** Re-exported for convenience in components that need the literal union. */
export type { FieldType };
