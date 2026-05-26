// Shared domain types for the dynamic form builder (TRD §6).

/** Supported field types. Drives the input element and validation. */
export type FieldType = 'text' | 'number' | 'email';

/** A single dynamic field in the form. */
export interface FormField {
  /** Stable id (nanoid) — used as React key; never changes. */
  id: string;
  /** User-defined label. */
  label: string;
  /** Always stored as a string; coerced on render. */
  value: string;
  /** Controls input element + validation. */
  type: FieldType;
  /** Validation message, surfaced inline. Absent when valid. */
  error?: string;
  /** Epoch ms of the last edit — powers "last edited" tooltips. */
  updatedAt: number;
}

/** Reducer action types. */
export type FieldAction =
  | { type: 'ADD_FIELD'; field: FormField }
  | { type: 'REMOVE_FIELD'; id: string }
  | { type: 'UPDATE_FIELD'; id: string; patch: Partial<FormField> }
  | { type: 'SUBMIT' }
  | { type: 'RESET' }
  | { type: 'HYDRATE'; fields: FormField[] };

/** Top-level state shape owned by FormBuilder. */
export interface FormState {
  fields: FormField[];
  lastSubmittedAt: number | null;
}
