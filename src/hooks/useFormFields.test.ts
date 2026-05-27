import { describe, expect, it } from 'vitest';
import type { FormField, FormState } from '@/types/field';
import { formReducer, initialState } from './useFormFields';

const makeField = (over: Partial<FormField> = {}): FormField => ({
  id: 'a',
  type: 'text',
  name: 'full_name',
  label: 'Full name',
  placeholder: '',
  defaultValue: '',
  hidden: false,
  required: false,
  fullWidth: false,
  block: false,
  disabled: false,
  useDisplayValue: false,
  updatedAt: 0,
  ...over,
});

describe('formReducer', () => {
  it('starts empty with a default title', () => {
    expect(initialState.fields).toHaveLength(0);
    expect(initialState.title).toBe('Untitled form');
  });

  it('ADD_FIELD appends the provided field', () => {
    const field = makeField();
    const next = formReducer(initialState, { type: 'ADD_FIELD', field });
    expect(next.fields).toEqual([field]);
  });

  it('REMOVE_FIELD removes by id and preserves the rest', () => {
    const state: FormState = {
      title: 'T',
      fields: [makeField({ id: 'a' }), makeField({ id: 'b' }), makeField({ id: 'c' })],
    };
    const next = formReducer(state, { type: 'REMOVE_FIELD', id: 'b' });
    expect(next.fields.map((f) => f.id)).toEqual(['a', 'c']);
  });

  it('UPDATE_FIELD patches only the target and never resets siblings (FR-4)', () => {
    const state: FormState = {
      title: 'T',
      fields: [makeField({ id: 'a', label: 'keep' }), makeField({ id: 'b', label: 'old' })],
    };
    const next = formReducer(state, {
      type: 'UPDATE_FIELD',
      id: 'b',
      patch: { label: 'new', required: true },
    });
    expect(next.fields[0].label).toBe('keep');
    expect(next.fields[1].label).toBe('new');
    expect(next.fields[1].required).toBe(true);
    expect(next.fields[1].updatedAt).toBeGreaterThanOrEqual(state.fields[1].updatedAt);
  });

  it('MOVE_FIELD swaps a field with its neighbour (BUG-07)', () => {
    const state: FormState = {
      title: 'T',
      fields: [makeField({ id: 'a' }), makeField({ id: 'b' }), makeField({ id: 'c' })],
    };
    expect(formReducer(state, { type: 'MOVE_FIELD', id: 'b', direction: 'up' }).fields.map((f) => f.id)).toEqual(
      ['b', 'a', 'c'],
    );
    expect(formReducer(state, { type: 'MOVE_FIELD', id: 'b', direction: 'down' }).fields.map((f) => f.id)).toEqual(
      ['a', 'c', 'b'],
    );
  });

  it('MOVE_FIELD is a no-op at the boundaries', () => {
    const state: FormState = { title: 'T', fields: [makeField({ id: 'a' }), makeField({ id: 'b' })] };
    expect(formReducer(state, { type: 'MOVE_FIELD', id: 'a', direction: 'up' })).toBe(state);
    expect(formReducer(state, { type: 'MOVE_FIELD', id: 'b', direction: 'down' })).toBe(state);
  });

  it('SET_TITLE updates the form title', () => {
    const next = formReducer(initialState, { type: 'SET_TITLE', title: 'Survey' });
    expect(next.title).toBe('Survey');
  });

  it('RESET clears everything', () => {
    const state: FormState = { title: 'T', fields: [makeField()] };
    expect(formReducer(state, { type: 'RESET' })).toEqual(initialState);
  });

  it('HYDRATE replaces title and fields', () => {
    const schema = { title: 'Loaded', fields: [makeField({ id: 'z' })] };
    const next = formReducer(initialState, { type: 'HYDRATE', schema });
    expect(next).toEqual(schema);
  });

  it('is immutable — the input state is not mutated', () => {
    const state: FormState = { title: 'T', fields: [makeField({ id: 'a' })] };
    const snapshot = JSON.stringify(state);
    formReducer(state, { type: 'UPDATE_FIELD', id: 'a', patch: { label: 'changed' } });
    expect(JSON.stringify(state)).toBe(snapshot);
  });
});
