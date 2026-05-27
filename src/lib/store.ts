// Client-side data layer (PRD §3.2 — no backend). Saved forms and their
// responses live in localStorage. Because there is no server, response
// counts reflect activity in THIS browser only; a form filled on another
// device won't appear here. Everything is wrapped in try/catch so private
// mode / disabled storage degrades silently.

import type { FormField, FormSchema } from '@/types/field';
import { createId } from '@/utils/id';

export const DRAFT_KEY = 'supremus-angel:schema';
const FORMS_KEY = 'supremus-angel:forms';
const RESPONSES_KEY = 'supremus-angel:responses';
/** Fired after any write so open views (dashboard) can refresh in-tab. */
const CHANGE_EVENT = 'supremus-angel:store-change';

/** A form the user has published, plus its captured fields. */
export interface SavedForm {
  id: string;
  title: string;
  fields: FormField[];
  createdAt: number;
  updatedAt: number;
}

/** One submitted response. `answers` is keyed by field id. */
export interface Submission {
  id: string;
  submittedAt: number;
  answers: Record<string, string>;
}

type ResponsesMap = Record<string, Submission[]>;

// --- low-level json helpers ------------------------------------------------

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Storage unavailable — operate in-memory for this session only.
  }
}

// --- forms -----------------------------------------------------------------

/** All saved forms, newest first. */
export function getForms(): SavedForm[] {
  return read<SavedForm[]>(FORMS_KEY, [])
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getForm(id: string): SavedForm | null {
  return read<SavedForm[]>(FORMS_KEY, []).find((f) => f.id === id) ?? null;
}

/**
 * Upserts a form by schema id (creating an id if absent) and returns it.
 * Preserves the original createdAt on update.
 */
export function saveForm(schema: FormSchema): SavedForm {
  const forms = read<SavedForm[]>(FORMS_KEY, []);
  const id = schema.id ?? createId();
  const now = Date.now();
  const existing = forms.find((f) => f.id === id);
  const saved: SavedForm = {
    id,
    title: schema.title.trim() || 'Untitled form',
    fields: schema.fields,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  const next = existing ? forms.map((f) => (f.id === id ? saved : f)) : [...forms, saved];
  write(FORMS_KEY, next);
  return saved;
}

/** Removes a form and its responses. */
export function deleteForm(id: string): void {
  write(
    FORMS_KEY,
    read<SavedForm[]>(FORMS_KEY, []).filter((f) => f.id !== id),
  );
  const responses = read<ResponsesMap>(RESPONSES_KEY, {});
  if (id in responses) {
    delete responses[id];
    write(RESPONSES_KEY, responses);
  }
}

/**
 * Clones a form (fresh id, no responses) and returns it. The copy title is
 * de-duplicated against existing forms: "(copy)", then "(copy 2)", "(copy 3)", …
 */
export function duplicateForm(id: string): SavedForm | null {
  const forms = read<SavedForm[]>(FORMS_KEY, []);
  const source = forms.find((f) => f.id === id);
  if (!source) return null;
  const now = Date.now();
  const taken = new Set(forms.map((f) => f.title));
  let title = `${source.title} (copy)`;
  for (let n = 2; taken.has(title); n += 1) title = `${source.title} (copy ${n})`;
  const copy: SavedForm = { ...source, id: createId(), title, createdAt: now, updatedAt: now };
  write(FORMS_KEY, [...forms, copy]);
  return copy;
}

// --- responses -------------------------------------------------------------

export function getResponses(formId: string): Submission[] {
  return read<ResponsesMap>(RESPONSES_KEY, {})[formId] ?? [];
}

/** Appends a respondent's answers to a form. No-op without a form id. */
export function addResponse(formId: string | undefined, answers: Record<string, string>): void {
  if (!formId) return;
  const map = read<ResponsesMap>(RESPONSES_KEY, {});
  const submission: Submission = { id: createId(), submittedAt: Date.now(), answers };
  map[formId] = [...(map[formId] ?? []), submission];
  write(RESPONSES_KEY, map);
}

export function responseCount(formId: string): number {
  return getResponses(formId).length;
}

// --- draft (hand-off from dashboard "Edit" back to the builder) ------------

/** Writes a schema into the builder's draft slot, so opening "/" loads it. */
export function writeDraft(schema: FormSchema): void {
  write(DRAFT_KEY, schema);
}

// --- live updates ----------------------------------------------------------

/**
 * Subscribes to store changes — both in-tab writes (custom event) and writes
 * from other tabs (the native `storage` event). Returns an unsubscribe fn.
 */
export function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => onChange();
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
