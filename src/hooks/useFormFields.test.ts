import { describe, expect, it } from 'vitest';
import type { FormField, FormState } from '@/types/field';
import { formReducer, initialState } from './useFormFields';

const makeField = (over: Partial<FormField> = {}): FormField => ({
  id: 'a',
  label: 'Name',
  value: 'Aarav',
  type: 'text',
  updatedAt: 0,
  ...over,
});

describe('formReducer', () => {
  it('starts empty', () => {
    expect(initialState.fields).toHaveLength(0);
    expect(initialState.lastSubmittedAt).toBeNull();
  });

  it('ADD_FIELD appends the provided field', () => {
    const field = makeField();
    const next = formReducer(initialState, { type: 'ADD_FIELD', field });
    expect(next.fields).toEqual([field]);
  });

  it('REMOVE_FIELD removes by id and preserves the rest', () => {
    const state: FormState = {
      fields: [makeField({ id: 'a' }), makeField({ id: 'b' }), makeField({ id: 'c' })],
      lastSubmittedAt: null,
    };
    const next = formReducer(state, { type: 'REMOVE_FIELD', id: 'b' });
    expect(next.fields.map((f) => f.id)).toEqual(['a', 'c']);
  });

  it('UPDATE_FIELD patches only the target and never resets siblings (FR-4)', () => {
    const state: FormState = {
      fields: [makeField({ id: 'a', value: 'keep' }), makeField({ id: 'b', value: 'old' })],
      lastSubmittedAt: null,
    };
    const next = formReducer(state, { type: 'UPDATE_FIELD', id: 'b', patch: { value: 'new' } });
    expect(next.fields[0].value).toBe('keep');
    expect(next.fields[1].value).toBe('new');
    expect(next.fields[1].updatedAt).toBeGreaterThanOrEqual(state.fields[1].updatedAt);
  });

  it('SUBMIT stamps lastSubmittedAt and flags invalid fields', () => {
    const state: FormState = {
      fields: [makeField({ label: '' }), makeField({ type: 'email', value: 'bad' })],
      lastSubmittedAt: null,
    };
    const next = formReducer(state, { type: 'SUBMIT' });
    expect(next.lastSubmittedAt).toBeTypeOf('number');
    expect(next.fields[0].error).toBe('Label is required.');
    expect(next.fields[1].error).toMatch(/email/i);
  });

  it('RESET clears everything', () => {
    const state: FormState = { fields: [makeField()], lastSubmittedAt: 123 };
    expect(formReducer(state, { type: 'RESET' })).toEqual(initialState);
  });

  it('HYDRATE replaces the field list', () => {
    const fields = [makeField({ id: 'z' })];
    const next = formReducer(initialState, { type: 'HYDRATE', fields });
    expect(next.fields).toEqual(fields);
  });

  it('is immutable — the input state is not mutated', () => {
    const state: FormState = { fields: [makeField({ id: 'a' })], lastSubmittedAt: null };
    const snapshot = JSON.stringify(state);
    formReducer(state, { type: 'UPDATE_FIELD', id: 'a', patch: { value: 'changed' } });
    expect(JSON.stringify(state)).toBe(snapshot);
  });
});
