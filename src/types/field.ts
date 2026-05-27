// Shared domain types for the form builder (TRD §6).

/**
 * Supported field types. Drives the input control and validation.
 * The presentation for each (label, group, icon, control) lives in the
 * single-source registry at `@/lib/fieldTypes`.
 */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'url'
  | 'phone'
  | 'password'
  | 'search'
  | 'number'
  | 'currency'
  | 'percentage'
  | 'rating'
  | 'range'
  | 'stepper'
  | 'date'
  | 'time'
  | 'datetime'
  | 'month'
  | 'week'
  | 'boolean'
  | 'dropdown'
  | 'radio'
  | 'checkboxes'
  | 'multiselect'
  | 'likert'
  | 'tags'
  | 'otp'
  | 'year'
  | 'daterange'
  | 'file'
  | 'image'
  | 'address'
  // Media & smart (Wave 5 — free / no-key libraries only).
  | 'richtext'
  | 'map'
  | 'addressauto'
  | 'captcha'
  // Layout / display elements (no respondent value).
  | 'heading'
  | 'subheading'
  | 'sectionheader'
  | 'description'
  | 'divider'
  | 'imageblock'
  | 'video'
  | 'html'
  | 'progress';

/**
 * A field definition in the form being built. This is the schema a builder
 * configures — the value a respondent enters lives separately, in the fill
 * page's own state, keyed by field id.
 */
export interface FormField {
  /** Stable id (nanoid) — React key; never changes. */
  id: string;
  /** Controls the input element + validation. */
  type: FieldType;
  /** Unique variable name used as the backend/data key. */
  name: string;
  /** Human-facing label. */
  label: string;
  /** Placeholder shown in the control (input-style types). */
  placeholder: string;
  /** Pre-filled / default value for respondents. */
  defaultValue: string;
  /** Choices for option-based types (dropdown, radio, etc.). */
  options?: string[];
  /** Hidden from the rendered form. */
  hidden: boolean;
  /** Must be filled before submit. */
  required: boolean;
  /** Spans the full width of the form grid. */
  fullWidth: boolean;
  /** Rendered as its own block row (label above, full width). */
  block: boolean;
  /** Rendered read-only / non-editable. */
  disabled: boolean;
  /** Show the formatted display value rather than the raw value. */
  useDisplayValue: boolean;
  /** Epoch ms of the last edit — powers "last edited" tooltips. */
  updatedAt: number;
}

/** A complete, publishable form. */
export interface FormSchema {
  /** Stable id, assigned on first publish. Carried in the share link and
   *  used to key saved forms and their responses in the local store. */
  id?: string;
  title: string;
  fields: FormField[];
}

/** Reducer action types. */
export type FieldAction =
  | { type: 'ADD_FIELD'; field: FormField }
  | { type: 'UPDATE_FIELD'; id: string; patch: Partial<FormField> }
  | { type: 'REMOVE_FIELD'; id: string }
  | { type: 'MOVE_FIELD'; id: string; direction: 'up' | 'down' }
  | { type: 'SET_TITLE'; title: string }
  | { type: 'RESET' }
  | { type: 'HYDRATE'; schema: FormSchema };

/** Top-level builder state owned by FormBuilder. */
export interface FormState {
  title: string;
  fields: FormField[];
}
