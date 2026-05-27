import { beforeEach, describe, expect, it } from 'vitest';
import {
  addResponse,
  deleteForm,
  duplicateForm,
  getForm,
  getForms,
  getResponses,
  responseCount,
  saveForm,
} from './store';
import { createField } from './schema';

const schema = (id?: string) => ({ id, title: 'Test', fields: [createField('text', [])] });

beforeEach(() => window.localStorage.clear());

describe('store — forms', () => {
  it('saves a form and lists it', () => {
    const saved = saveForm(schema());
    expect(saved.id).toBeTruthy();
    expect(getForms()).toHaveLength(1);
    expect(getForm(saved.id)?.title).toBe('Test');
  });

  it('upserts by id rather than duplicating, preserving createdAt', () => {
    const a = saveForm(schema());
    const b = saveForm({ id: a.id, title: 'Renamed', fields: a.fields });
    expect(getForms()).toHaveLength(1);
    expect(b.createdAt).toBe(a.createdAt);
    expect(getForm(a.id)?.title).toBe('Renamed');
  });

  it('duplicates with a new id and "(copy)" title and no responses', () => {
    const a = saveForm(schema());
    addResponse(a.id, { x: '1' });
    const copy = duplicateForm(a.id);
    expect(copy).not.toBeNull();
    expect(copy?.id).not.toBe(a.id);
    expect(copy?.title).toMatch(/\(copy\)/);
    expect(responseCount(copy!.id)).toBe(0);
  });

  it('auto-increments the copy title to avoid collisions (BUG-08)', () => {
    const a = saveForm(schema());
    const first = duplicateForm(a.id);
    const second = duplicateForm(a.id);
    expect(first?.title).toBe('Test (copy)');
    expect(second?.title).toBe('Test (copy 2)');
    expect(new Set(getForms().map((f) => f.title)).size).toBe(getForms().length);
  });

  it('deletes a form together with its responses', () => {
    const a = saveForm(schema());
    addResponse(a.id, { x: '1' });
    deleteForm(a.id);
    expect(getForm(a.id)).toBeNull();
    expect(getResponses(a.id)).toHaveLength(0);
  });
});

describe('store — responses', () => {
  it('records and counts submissions', () => {
    const a = saveForm(schema());
    addResponse(a.id, { x: '1' });
    addResponse(a.id, { x: '2' });
    expect(responseCount(a.id)).toBe(2);
  });

  it('ignores a missing form id without throwing', () => {
    expect(() => addResponse(undefined, { x: '1' })).not.toThrow();
    expect(getResponses('nope')).toHaveLength(0);
  });
});
